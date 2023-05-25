import * as core from "core";
import * as peDropDownWithInfo from "dms/modules/info/pe/peDropDownWithInfo";
import {ContractDocumentContractor, Contractor} from "app/domain/model-ext";
import * as peObjectListWithDropDownSelector from "dms/modules/info/pe/peObjectListWithDropDownSelector";
import * as  ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as  resources from "i18n!app/nls/resources";
import * as  domainResources from "i18n!app/domain/nls/resources";
import * as  peContractDocumentContractorMenuRowTemplate
    from "xhtmpl!app/ui/document/contract/templates/peContractDocumentContractorMenuRow.hbs";
import * as  libResources from "i18n!lib/nls/resources";
import * as  ContractorObjectSelector from "app/ui/dictionary/contractor/ContractorObjectSelector";

/**
 * Редактор списка контрагентов документа Договор.
 */
class peContractDocumentContractor extends peObjectListWithDropDownSelector {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: peContractDocumentContractor.Options & { inlineEdit?: boolean } = {
        selectorComponentOptions: {
            name: "contractChoice",
            vt: "object",
            entityType: Contractor.meta.name,
            ref: Contractor.meta.name,
            nullable: true,
            PropertyEditor: peDropDownWithInfo.factory(ContractorObjectSelector.PART_NAME, {
                commandsOptions: {
                    Select: {
                        partOptions: {
                            entityType: Contractor.meta.name
                        }
                    }
                },
                showInfoButton: false
            }),
            onDataLoading: function (pe, args) {
                // TODO: проблема описана здесь https://qa.rnd.croc.ru/questions/9244025
                if (args.query) {
                    args.query.params = {
                        deleted: false
                    };
                } else if (args.params) {
                    args.params = {
                        deleted: false
                    };
                }
            },
            descr: resources["peContractDocumentContractor.addContractor"]
        },
        preloads: [ContractDocumentContractor.meta.props.contractor.name],
        presenterOptions: {
            partialTemplates: {
                menuRow: peContractDocumentContractorMenuRowTemplate
            }
        },
        menuSelection: {
            items: []
        },
        menuRow: {
            items: []
        },
        columns: [
            {name: ContractDocumentContractor.meta.props.contractor.name, editor: null},
            {name: ContractDocumentContractor.meta.props.number.name},
            {name: ContractDocumentContractor.meta.props.signingDate.name},
            {
                name: ContractDocumentContractor.meta.props.contractor.name + "." + Contractor.meta.props.ogrn.name,
                title: domainResources["model." + Contractor.meta.name + "." + Contractor.meta.props.ogrn.name],
                editor: null,
                getter: function () {
                    const that: ContractDocumentContractor = this;
                    return that ? that.contractor().ogrn() : "";
                }
            },
            {
                name: ContractDocumentContractor.meta.props.contractor.name + "." + Contractor.meta.props.inn.name,
                title: domainResources["model." + Contractor.meta.name + "." + Contractor.meta.props.inn.name],
                editor: null,
                getter: function () {
                    const that: ContractDocumentContractor = this;
                    return that ? that.contractor().inn() : "";
                }
            },
            {
                name: ContractDocumentContractor.meta.props.contractor.name + "." + Contractor.meta.props.kpp.name,
                title: domainResources["model." + Contractor.meta.name + "." + Contractor.meta.props.kpp.name],
                editor: null,
                getter: function () {
                    const that: ContractDocumentContractor = this;
                    return that ? that.contractor().kpp() : "";
                }
            },
            {name: ContractDocumentContractor.meta.props.signerName.name},
            {name: ContractDocumentContractor.meta.props.warrantName.name}
        ],
        infoValueConverter: function (value: ContractDocumentContractor): any {
            return value.contractor();
        }
    };

    /**
     * Опции компонента.
     */
    options: peContractDocumentContractor.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: peContractDocumentContractor.Options) {
        options = peContractDocumentContractor.mixOptions(options, peContractDocumentContractor.DEFAULT_OPTIONS);

        if (!options.readOnly) {
            options.menuRow.items.push({
                name: "Delete",
                title: libResources["delete"],
                hotKey: "del"
            });
        }

        super(options);
    }

    protected onSelectorComponentChange(sender, selectedContractor: Contractor): any {
        const that = this;
        if (selectedContractor !== null) {
            const allContractDocumentContractors: ContractDocumentContractor[] = that.items.all() as ContractDocumentContractor[];
            const foundContractor: ContractDocumentContractor = core.lang.find(allContractDocumentContractors,
                (item: ContractDocumentContractor) => {
                    return item.contractor().id == selectedContractor.id;
                });

            // Если в списке КА документа ещё нет выбранного КА
            if (!foundContractor) {
                const newContractDocumentContractor: ContractDocumentContractor = this.viewModel.uow.create(ContractDocumentContractor.meta.name);
                newContractDocumentContractor.contractor(selectedContractor);
                selectedContractor.load({
                    preloads: []
                }).done(function () {
                    that.items.add(newContractDocumentContractor);
                    that.selectorComponent.commands.Unlink.execute();
                });
            } else {
                that.selectorComponent.commands.Unlink.execute();
            }
        }
    }
}

namespace peContractDocumentContractor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends peObjectListWithDropDownSelector.Options {
        send?: boolean;
    }
}

export = peContractDocumentContractor;
