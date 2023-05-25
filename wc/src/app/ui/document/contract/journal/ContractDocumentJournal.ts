import * as ObjectList from "lib/ui/list/ObjectList";
import * as BookmarkablePartMixin from "dms/modules/bookmarks/BookmarkablePartMixin";
import * as resources from "i18n!app/nls/resources";
import * as ContractDocumentJournalObjectFilter
    from "app/ui/document/contract/journal/ContractDocumentJournalObjectFilter";
import * as CounterWidgetDataSourceRegistry from "cmf/modules/dashboard/counter/CounterWidgetDataSourceRegistry";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";
import * as domainResources from "i18n!app/domain/nls/resources";
import * as modelResources from "i18n!app/domain/nls/resources";
import * as GroupedVerticalBarWidgetDataSourceRegistry
    from "cmf/modules/dashboard/groupedverticalbar/GroupedVerticalBarWidgetDataSourceRegistry";
import * as Icons from "dms/modules/icons/Icons";
import * as core from "core";
import {Application} from "core";
import {ListWithRestrictions} from "cmf/modules/dashboard/ListWithRestrictions";
import {AbstractDocument, ContractDocument, ContractDocumentContractor, Currency} from "app/domain/model-ext";

/**
 * Парт - журнал документов Договор.
 */
class ContractDocumentJournal extends ObjectList implements ListWithRestrictions {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ContractDocumentJournal";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentJournal.Options = {
        title: resources["part.contractDocumentJournal"],
        entityType: ContractDocument.meta.name,
        autoLoad: true,
        filter: ContractDocumentJournalObjectFilter.PART_NAME,
        columns: [
            {
                name: "hasAttachment",
                role: "icon",
                width: 30,
                title: core.ui.iconProvider.getIcon(Icons.JournalIcon.ATTACHMENT),
                toolTip: modelResources["model.AbstractDocument.attachment"],
                getter: function () {
                    let that: ContractDocument = this;
                    return that.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : null;
                },
                formatterHtml: function () {
                    let result = "";
                    let that: ContractDocument = this;
                    const icon = core.ui.iconProvider.getIcon(
                        that.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : "", {});
                    if (icon) {
                        result += "<a href='#' class='x-cmd-link'"
                            + " data-cmd-name='ShowAttachment' tabIndex='-1'>" + icon + "</a>";
                    }
                    return result;
                }
            }, {
                name: ContractDocument.meta.props.urgent.name,
                role: "icon",
                width: 30,
                hidden: true,
                title: core.ui.iconProvider.getIcon(Icons.JournalIcon.URGENT),
                toolTip: ContractDocument.meta.props.urgent.descr,
                getter: function () {
                    let that: ContractDocument = this;
                    return that.urgent() ? Icons.JournalIcon.URGENT : null;
                }
            }, {
                name: ContractDocument.meta.props.documentType.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.documentKind.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.organization.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.contractors.name,
                width: 50,
                getter: function (): string {
                    let that: ContractDocument = this;
                    //TODO решить проблему с any
                    let text = (jQuery as any).uniqueSort(that.contractors().all().map(
                        function (contractDocumentContractor: ContractDocumentContractor) {
                            return contractDocumentContractor.contractor().name();
                        }
                    )).join(";\n");
                    return text;
                }
            }, {
                name: ContractDocument.meta.props.regNumber.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.regDate.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.status.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.summary.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.cost.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.currency.name,
                width: 50,
                hidden: true,
                formatter: function (value: Currency) {
                    return value ? value.codeAlfa() : "";
                }
            }, {
                name: ContractDocument.meta.props.identifier.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.creationDate.name,
                width: 50
            }, {
                name: ContractDocument.meta.props.contractState.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.agreementDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.signingDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.durationFromDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.durationToDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.completedDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.conditionIntoForce.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.terminationDate.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.terminationReason.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.performer.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.curator.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.signatory.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.warrantName.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.dealWithInterest.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.bigDeal.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.greatlyDeal.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.officialRegistration.name,
                width: 50,
                hidden: true
            }, {
                name: ContractDocument.meta.props.propertyTransfer.name,
                width: 50,
                hidden: true
            }
        ],
        commands: {
            ShowAttachment: core.createCommand({
                execute: function (params) {
                    var primaryItem = params.object.attachment().all().find(function (item) {
                        return item.primary();
                    });
                    if (primaryItem) {
                        var url = (core.Application.current as any).files.getBinaryPropLoadUrl(primaryItem, "content", {});
                        window.open(url);
                    } else {
                        // TODO: просто открыть вкладку вложений на карточке
                    }
                }
            })
        },
        menuRow: {
            items: [{
                name: "View",
                title: resources["part.document.list.command.View"],
                icon: "view",
                isDefaultAction: true,
                order: 100
            }]
        }
    };

    /**
     * @constructs
     * @param {Application} app Текущий экземпляр приложения.
     * @param {ContractDocumentJournal.Options} options Опции компонента.
     */
    constructor(app: Application, options?: ContractDocumentJournal.Options) {
        const _options: ContractDocumentJournal.Options = BookmarkablePartMixin.mixJournalOptions(options);
        _options.dataSource = _options.dataSource || new core.data.DataSource(app, {
            name: "document/contract/journal",
            supportQuery: false,
            preloads: [
                ContractDocument.meta.props.attachment.name,
                ContractDocument.meta.props.documentType.name,
                ContractDocument.meta.props.documentKind.name,
                ContractDocument.meta.props.organization.name,
                ContractDocument.meta.props.contractors.name,
                ContractDocument.meta.props.status.name,
                ContractDocument.meta.props.currency.name,
                ContractDocument.meta.props.terminationReason.name,
                ContractDocument.meta.props.performer.name,
                ContractDocument.meta.props.curator.name,
                ContractDocument.meta.props.signatory.name,
            ]
        });

        super(app, ContractDocumentJournal.mixOptions(_options, ContractDocumentJournal.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    getRestrictions() {
        return this.getFilterRestrictions();
    }

    /**
     * @inheritDoc
     */
    setRestrictions(restriction?: any) {
        (this.filter as ObjectFilter).applyRestrictions(restriction);
    }
}

namespace ContractDocumentJournal {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectList.Options, BookmarkablePartMixin.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentJournal.PART_NAME, (options?: ContractDocumentJournal.Options) => {
        return new ContractDocumentJournal(app, options);
    });
});

export = ContractDocumentJournal;

CounterWidgetDataSourceRegistry.counterWidgetDataSourceRegistry.register({
    dataSource: "document/contract/journal",
    partName: ContractDocumentJournal.PART_NAME,
    displayedName: resources["part.contractDocumentJournal"],
});

GroupedVerticalBarWidgetDataSourceRegistry.groupedVerticalBarWidgetDataSourceRegistry.register({
    dataSource: "document/contract/journal_grouping_by",
    partName: ContractDocumentJournal.PART_NAME,
    displayedName: resources["part.contractDocumentJournal"],
    groupBy: [{
        property: ContractDocument.meta.props.urgent.name,
        formattedName: domainResources[`model.${ContractDocument.meta.name}.${ContractDocument.meta.props.urgent.name}`],
        vt: "boolean",
    }, {
        property: ContractDocument.meta.props.performer.name,
        formattedName: domainResources[`model.${ContractDocument.meta.name}.${ContractDocument.meta.props.performer.name}`],
    }, {
        property: ContractDocument.meta.props.registrator.name,
        formattedName: domainResources[`model.${ContractDocument.meta.name}.${ContractDocument.meta.props.registrator.name}`],
    }, {
        property: ContractDocument.meta.props.signatory.name,
        formattedName: domainResources[`model.${ContractDocument.meta.name}.${ContractDocument.meta.props.signatory.name}`],
    }, {
        property: AbstractDocument.meta.props.documentKind.name,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.meta.props.documentKind.name}`],
    }, {
        property: AbstractDocument.meta.props.regDate.name,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.meta.props.regDate.name}`],
        vt: "date",
    }, {
        property: AbstractDocument.meta.props.status.name,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.meta.props.status.name}`],
    }],
});