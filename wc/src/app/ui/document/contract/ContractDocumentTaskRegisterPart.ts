import * as core from "core";
import {Application} from "core";
import {ContractDocument} from "app/domain/model-ext";
import {documentActionNotifier} from "dms/modules/document/process/notification/DocumentActionNotifier";
import * as  ContractDocumentTaskBaseEditor from "app/ui/document/contract/ContractDocumentTaskBaseEditor";
import * as  documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as  documentAttachmentsTab from "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs";
import * as  EditorPage from "lib/ui/editor/EditorPage";
import * as  ApprovalHistoryList from "dms/modules/document/approval/ApprovalHistoryList";
import * as  resources from "i18n!app/nls/resources";
import * as  contractDocumentTaskRegisterTemplate
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentTaskRegisterTemplate.hbs";
import * as  peContractDocumentContractor from "app/ui/document/contract/peContractDocumentContractor";

/**
 * Парт для регистрации документа Договор.
 */
class ContractDocumentTaskRegisterPart extends ContractDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Register:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskRegisterPart.Options = {
        subtitle: resources["part.task.registerDocument"],
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-sm-",
            template: contractDocumentTaskRegisterTemplate,
            properties: [
                // Левая колонка до списка КА
                {name: ContractDocument.meta.props.organization.name, readOnly: true},
                {name: ContractDocument.meta.props.documentType.name, readOnly: true},
                {name: ContractDocument.meta.props.documentKind.name},
                {name: ContractDocument.meta.props.summary.name, vt: "text"},
                {
                    name: ContractDocument.meta.props.cost.name,
                    decimalSeparator: ".",
                    spinner: false,
                    hideClearButton: true
                },
                {name: ContractDocument.meta.props.currency.name},
                {
                    name: ContractDocument.meta.props.costRub.name,
                    decimalSeparator: ".",
                    spinner: false,
                    hideClearButton: true
                },
                {name: ContractDocument.meta.props.settlementType.name},
                {name: ContractDocument.meta.props.determiningCost.name, vt: "string"},
                {name: ContractDocument.meta.props.conditionIntoForce.name},

                // Правая колонка до списка КА
                {
                    name: ContractDocument.meta.props.preparedByContractor.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.protocolDisagreements.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.paper.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.protocolApproveDisagreements.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {name: ContractDocument.meta.props.curator.name},
                {name: ContractDocument.meta.props.performer.name},
                {name: ContractDocument.meta.props.signatory.name, readOnly: true},
                {name: ContractDocument.meta.props.warrantName.name},
                {name: ContractDocument.meta.props.signingDate.name},
                {name: ContractDocument.meta.props.agreementDate.name},
                {name: ContractDocument.meta.props.durationFromDate.name},
                {name: ContractDocument.meta.props.durationToDate.name},
                {name: ContractDocument.meta.props.nomenclatureCase.name},
                {name: ContractDocument.meta.props.contractState.name},

                // Список КА
                {
                    name: ContractDocument.meta.props.contractors.name,
                    PropertyEditor: peContractDocumentContractor,
                    useTitledListLayout: true
                },

                // Левая колонка после списка КА
                {name: ContractDocument.meta.props.sheetsAmount.name},
                {name: ContractDocument.meta.props.annexSheetsAmount.name},
                {name: ContractDocument.meta.props.notes.name, vt: "text"},
                {name: ContractDocument.meta.props.permission.name},

                // Правая колонка после списка КА
                {
                    name: ContractDocument.meta.props.dealWithInterest.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.propertyTransfer.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.greatlyDeal.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.officialRegistration.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: ContractDocument.meta.props.bigDeal.name,
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {name: ContractDocument.meta.props.identifier.name, readOnly: true},
                {name: ContractDocument.meta.props.creationDate.name, readOnly: true}
            ]
        },
        attachmentPageOptions: {
            name: "attachment",
            title: resources["part.document.pages.attachment"],
            template: documentAttachmentsTab
        },
        approvalPageOptions: {
            name: "approval",
            title: resources["part.document.pages.approval"],
            template: documentApprovalTab,
            hideTopMenu: true
        },
        leftMenu: {
            update: [{
                name: "CompleteTask",
                title: resources["part.task.completeRegistration"],
                icon: "redo"
            }]
        }
    };

    /**
     * Тип модели  редактора.
     */
    viewModel: ContractDocument;

    /**
     * Тип опций компонента.
     */
    options: ContractDocumentTaskRegisterPart.Options;

    /**
     * @constructs
     * @param {ContractDocumentTaskRegisterPart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskRegisterPart.Options) {
        super(ContractDocumentTaskRegisterPart.mixOptions(options, ContractDocumentTaskRegisterPart.DEFAULT_OPTIONS));
    }


    /**
     * @inheritDoc
     */
    protected doCompleteTask(args: any): core.lang.Promise<void> {
        return super.doCompleteTask(args).done(() => {
            documentActionNotifier.publishDocumentRegistrationEvent(ContractDocumentTaskRegisterPart.CONTRACT_DOCUMENT_REGISTRATION_SUCCESS, {
                action: resources["part.document.registration.documentHasBeenRegistered"],
                document: this.viewModel,
                showCloseButton: true,
            });
        });
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

namespace ContractDocumentTaskRegisterPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentTaskBaseEditor.Options {

    }

    /**
     * Идентификатор события успешной регистрации документа.
     * @type {string}
     */
    export const CONTRACT_DOCUMENT_REGISTRATION_SUCCESS: string = "document.contract.registration.success";

}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskRegisterPart.PART_NAME, (options?: ContractDocumentTaskRegisterPart.Options) => {
        return new ContractDocumentTaskRegisterPart(options);
    });
});
