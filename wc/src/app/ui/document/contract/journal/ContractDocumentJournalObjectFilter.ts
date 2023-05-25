import * as contractDocumentJournalFilterTemplate
    from "xhtmpl!app/ui/document/contract/journal/templates/ContractDocumentJournalFilter.hbs";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";
import * as peObjectDropDownLookup from "lib/ui/pe/peObjectDropDownLookup";
import * as resources from "i18n!app/nls/resources";
import * as core from "core";
import {Application} from "core";
import {ContractDocumentJournalFilter} from "app/domain/model-classes";
import {DropDownLookupMenuIcon} from "dms/modules/icons/Icons";

/**
 * Фильтр журнала документов Договор.
 */
class ContractDocumentJournalObjectFilter extends ObjectFilter {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectFilter:" + ContractDocumentJournalFilter.meta.name;

    /**
     * Изменение меню элементов управления для выбора сотрудников.
     * Добавление действия "выбора меня" и т.п.
     */
    static SET_ME_MENU_CHANGE = {
        update: [{
            name: "SetMe",
            order: 10,
            icon: DropDownLookupMenuIcon.ME,
            command: function (editor: ContractDocumentJournalObjectFilter) {
                return new core.commands.BoundCommand(function (this: peObjectDropDownLookup) {
                    const that = this;
                    (that.viewModel.uow as any).getCurrentEmployeePosition().done(function (employeePosition) {
                        that.viewModel.set(that.viewModelProp, employeePosition);
                    });
                }, function () {
                    return true;
                }, editor);
            }
        }]
    };


    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentJournalObjectFilter.Options = {
        type: ContractDocumentJournalFilter.meta.name,
        pages: [{
            template: contractDocumentJournalFilterTemplate,
            cssColumnPrefix: "col-sm-",
            properties: [
                {name: ContractDocumentJournalFilter.meta.props.organization.name},
                {name: ContractDocumentJournalFilter.meta.props.contractor.name},
                {
                    name: ContractDocumentJournalFilter.meta.props.status.name,
                    emptyValueText: "<i class='text-muted'>" + resources["common.all.default"] + "</i>"
                },
                {name: ContractDocumentJournalFilter.meta.props.contractState.name, presentation: "dropdown"},
                {name: ContractDocumentJournalFilter.meta.props.summary.name},
                {name: ContractDocumentJournalFilter.meta.props.costFrom.name, spinner: false},
                {name: ContractDocumentJournalFilter.meta.props.costTo.name, spinner: false},
                {
                    name: ContractDocumentJournalFilter.meta.props.performer.name,
                    menu: ContractDocumentJournalObjectFilter.SET_ME_MENU_CHANGE
                },

                {name: ContractDocumentJournalFilter.meta.props.creationDateFrom.name},
                {name: ContractDocumentJournalFilter.meta.props.creationDateTo.name},
                {name: ContractDocumentJournalFilter.meta.props.signingDateFrom.name},
                {name: ContractDocumentJournalFilter.meta.props.signingDateTo.name},
                {
                    name: ContractDocumentJournalFilter.meta.props.curator.name,
                    menu: ContractDocumentJournalObjectFilter.SET_ME_MENU_CHANGE
                },
                {
                    name: ContractDocumentJournalFilter.meta.props.signatory.name,
                    menu: ContractDocumentJournalObjectFilter.SET_ME_MENU_CHANGE
                },
                {name: ContractDocumentJournalFilter.meta.props.dealWithInterest.name},
                {name: ContractDocumentJournalFilter.meta.props.bigDeal.name},
                {name: ContractDocumentJournalFilter.meta.props.greatlyDeal.name}
            ]
        }]
    };

    /**
     * @constructs
     * @param {ContractDocumentJournalObjectFilter.Options} options Опции компонента.
     */
    constructor(options?: ContractDocumentJournalObjectFilter.Options) {
        super(ContractDocumentJournalObjectFilter.mixOptions(options, ContractDocumentJournalObjectFilter.DEFAULT_OPTIONS));
    }
}

namespace ContractDocumentJournalObjectFilter {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectFilter.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentJournalObjectFilter.PART_NAME, (options?: ContractDocumentJournalObjectFilter.Options) => {
        return new ContractDocumentJournalObjectFilter(options);
    });
});

export = ContractDocumentJournalObjectFilter;