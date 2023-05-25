import * as core from "core";
import {Application} from "core";
import {ContractDocument, ContractDocumentContractor, Contractor} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";
import * as ContractDocumentTaskBaseEditor from "app/ui/document/contract/ContractDocumentTaskBaseEditor";
import * as peDocumentAttachment from "app/ui/peDocumentAttachment";
import * as contractDocumentAttachOriginalTab
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentAttachOriginalTab.hbs";
import * as documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as dmsResources from "i18n!dms/modules/document/nls/resources";
import * as EditorPage from "lib/ui/editor/EditorPage";
import * as PropertyEditor from "lib/ui/pe/PropertyEditor";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as peViewOnly from "lib/ui/pe/peViewOnly";
import * as ApprovalHistoryList from "dms/modules/document/approval/ApprovalHistoryList";

/**
 * Парт для создания проекта документа Договор.
 */
class ContractDocumentTaskAttachOriginalPart extends ContractDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Attach_Original:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskAttachOriginalPart.Options = {
        subtitle: resources["part.task.subtitle.attach"],
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-xs-",
            template: contractDocumentAttachOriginalTab,
            properties: [
                // Левая колонка до списка вложений
                {name: ContractDocument.meta.props.organization.name, readOnly: true},
                {name: ContractDocument.meta.props.documentType.name, readOnly: true},
                {name: ContractDocument.meta.props.documentKind.name, readOnly: true},
                {name: ContractDocument.meta.props.summary.name, vt: "text", readOnly: true},
                {name: ContractDocument.meta.props.contractors.name},
                {name: ContractDocument.meta.props.sheetsAmount.name},
                {name: ContractDocument.meta.props.annexSheetsAmount.name},
                {name: ContractDocument.meta.props.notes.name, vt: "text", readOnly: true},
                {name: ContractDocument.meta.props.permission.name, readOnly: true},
                {name: ContractDocument.meta.props.nomenclatureCase.name},
                {name: ContractDocument.meta.props.contractState.name, readOnly: true},

                // Правая колонка до списка вложений
                {
                    name: ContractDocument.meta.props.urgent.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.protocolDisagreements.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.paper.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.protocolApproveDisagreements.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {name: ContractDocument.meta.props.curator.name, readOnly: true},
                {name: ContractDocument.meta.props.performer.name, readOnly: true},
                {name: ContractDocument.meta.props.signatory.name, readOnly: true},
                {name: ContractDocument.meta.props.warrantName.name, readOnly: true},
                {name: ContractDocument.meta.props.signingDate.name, readOnly: true},
                {name: ContractDocument.meta.props.agreementDate.name, readOnly: true},
                {name: ContractDocument.meta.props.durationFromDate.name, readOnly: true},
                {name: ContractDocument.meta.props.durationToDate.name, readOnly: true},
                {name: ContractDocument.meta.props.registrator.name, readOnly: true},
                {
                    name: ContractDocument.meta.props.dealWithInterest.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.propertyTransfer.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.greatlyDeal.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.officialRegistration.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },
                {
                    name: ContractDocument.meta.props.bigDeal.name,
                    presentation: "checkbox",
                    nullable: false,
                    readOnly: true
                },

                // Список вложений
                {
                    name: ContractDocument.meta.props.attachment.name,
                    PropertyEditor: peDocumentAttachment,
                    useTitledListLayout: true
                }
            ]
        },
        approvalPageOptions: {
            name: "approval",
            title: resources["part.document.pages.approval"],
            template: documentApprovalTab,
            hideTopMenu: true
        },
        attachmentPageOptions: null,
        leftMenu: {
            update: [{
                name: "CompleteTask",
                title: dmsResources["part.task.complete"],
                icon: "redo"
            }]
        },
        onSetViewModel: function (viewModel) {
            return (this as any)._ownUow.load(ContractDocument.meta.name, this.getTaskEntityId(), {
                preloads: [
                    ContractDocument.meta.props.documentKind.name,
                    ContractDocument.meta.props.documentType.name,
                    ContractDocument.meta.props.createdBasedOn.name,
                    ContractDocument.meta.props.organization.name,
                    ContractDocument.meta.props.author.name,
                    ContractDocument.meta.props.status.name,
                    ContractDocument.meta.props.nomenclatureCase.name,
                    ContractDocument.meta.props.performer.name,
                    ContractDocument.meta.props.registrator.name,
                    ContractDocument.meta.props.signatory.name,
                    ContractDocument.meta.props.currency.name,
                    ContractDocument.meta.props.terminationReason.name,
                    ContractDocument.meta.props.curator.name,
                    ContractDocument.meta.props.contractors.name,
                    ContractDocument.meta.props.attachment.name
                ]
            });
        },
        resourcesFormatter: function (value) {
            return resources[value];
        }
    };

    /**
     * @constructs
     * @param {ContractDocumentTaskAttachOriginalPart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskAttachOriginalPart.Options) {
        super(ContractDocumentTaskAttachOriginalPart.mixOptions(options, ContractDocumentTaskAttachOriginalPart.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected onCreatePropEditor(page: EditorPage, propMeta: PropertyEditor.Options, viewModel: ObjectEditor.Model): PropertyEditor.Options {
        const meta: PropertyEditor.Options = super.onCreatePropEditor(page, propMeta, viewModel);

        // TODO: https://jira.croc.ru/browse/A1900895-87 Проверить и при необходимости убрать ручную настройку peViewOnly для списка Контрагентов на РК Договора
        //TODO проверить, возможно это и не нужно вовсе, т.к. работает так же, по умолчанию, в wc.
        if (meta.name === ContractDocument.meta.props.contractors.name) {
            meta.PropertyEditor = peViewOnly;
            (meta as peViewOnly.Options).itemFormatter = function () {
                const contractDocumentContractor: ContractDocumentContractor = this;
                return contractDocumentContractor.contractor().name();
            };
            const that = this;
            (meta as peViewOnly.Options).commands = {
                View: core.createCommand({
                    execute: function (args) {
                        const contractDocumentContractor: ContractDocumentContractor = args.object;
                        const contractor: Contractor = contractDocumentContractor.contractor();

                        return that.navigationService.navigate({
                            part: "ObjectViewer:" + contractor.meta.name,
                            partOptions: {
                                viewModel: contractor
                            }
                        });
                    }
                })
            }
        }

        return meta;
    }

    /**
     * @inheritDoc
     */
    protected onApprovalPageCreated(page: EditorPage): void {
        (page as any).queueComponent = core.createPart(ApprovalHistoryList.PART_NAME, {
            documentId: this.viewModel.id,
            uow: core.Application.current.createUnitOfWork(),
            pageContext: page
        });
        this.registerChild((page as any).queueComponent, {keepOnUnload: true, trackStatus: true});
    }
}

namespace ContractDocumentTaskAttachOriginalPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentTaskBaseEditor.Options {

        //TODO убрать вызов форматтера, либо сделать его во всех редакторах.
        /**
         * Форматтер ресурсов, для вызоав из шаблона страницы редактора.
         */
        resourcesFormatter?: (value) => string;
    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskAttachOriginalPart.PART_NAME, (options?: ContractDocumentTaskAttachOriginalPart.Options) => {
        return new ContractDocumentTaskAttachOriginalPart(options);
    });
});
