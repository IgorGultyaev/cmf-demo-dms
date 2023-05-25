import * as  core from "core";
import {Application} from "core";
import * as  resources from "i18n!app/nls/resources";
import * as  documentApprovalTabWithHistory from "xhtmpl!app/ui/templates/documentApprovalTabWithHistory.hbs";
import * as  EditorPage from "lib/ui/editor/EditorPage";
import * as  ContractDocumentTaskBaseEditor from "app/ui/document/contract/ContractDocumentTaskBaseEditor";
import * as  ApprovalHistoryList from "dms/modules/document/approval/ApprovalHistoryList";
import {ContractDocument} from "app/domain/model-classes";
import * as contractDocumentCreateTask from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCreateTask.hbs";
import * as peContractDocumentContractor from "app/ui/document/contract/peContractDocumentContractor";


/**
 * Парт для доработки документа Договор.
 */
class ContractDocumentTaskRefinePart extends ContractDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Refine:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskRefinePart.Options = {
        subtitle: resources["part.task.refineDocument"],
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-sm-",
            template: contractDocumentCreateTask,
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
                    name: ContractDocument.meta.props.urgent.name,
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
                {name: ContractDocument.meta.props.agreementDate.name},
                {name: ContractDocument.meta.props.durationFromDate.name},
                {name: ContractDocument.meta.props.durationToDate.name},

                // Список КА
                {
                    name: ContractDocument.meta.props.contractors.name,
                    PropertyEditor: peContractDocumentContractor,
                    useTitledListLayout: true
                },

                // Левая колонка после списка КА
                {name: ContractDocument.meta.props.nomenclatureCase.name},
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
                {name: ContractDocument.meta.props.status.name, readOnly: true},
                {name: ContractDocument.meta.props.creationDate.name, readOnly: true}
            ]
        },
        approvalPageOptions: {
            name: "approval",
            title: resources["part.task.pages.approvalPath"],
            template: documentApprovalTabWithHistory,
            resources: {
                queueTitle: resources["part.task.pages.approvalPath"]
            }
        },
        leftMenu: {
            update: [
                {
                    name: "CompleteTask",
                    title: resources["part.task.sendForApproval"],
                    icon: "redo"
                },
                {
                    name: "RevokeDocument",
                    title: resources["part.task.voidTask"],
                    icon: "stop"
                }
            ]
        }
    };

    /**
     * @constructs
     * @param {ContractDocumentTaskRefinePart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskRefinePart.Options) {
        super(ContractDocumentTaskRefinePart.mixOptions(options, ContractDocumentTaskRefinePart.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected onApprovalPageCreated(page: EditorPage): void {
        super.onApprovalPageCreated(page);

        //TODO сделать по другому, возможно через дочерний парт.
        (page as any).historyComponent = core.createPart(ApprovalHistoryList.PART_NAME, {
            uow: this.viewModel.uow,
            documentPerformerId: this.viewModel.performer().id,
            documentStatusId: this.viewModel.status().id,
            documentId: this.viewModel.id,
            pageContext: page
        });

        this.registerChild((page as any).historyComponent, {
            keepOnUnload: true,
            trackStatus: true
        });
    }

    protected canRevokeDocument(): boolean {
        // todo finance https://jira.croc.ru/browse/A1900895-15 Реализовать аннулирование из задачи на доработку Договора
        return false;
    }

}

namespace ContractDocumentTaskRefinePart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentTaskBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskRefinePart.PART_NAME, (options?: ContractDocumentTaskRefinePart.Options) => {
        return new ContractDocumentTaskRefinePart(options);
    });
});
