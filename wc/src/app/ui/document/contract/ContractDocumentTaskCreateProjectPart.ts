import * as core from "core";
import {Application} from "core";
import * as ContractDocumentTaskBaseEditor from "app/ui/document/contract/ContractDocumentTaskBaseEditor";
import {ContractDocument} from "app/domain/model-classes";
import * as contractDocumentCreateTask from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCreateTask.hbs";
import * as peContractDocumentContractor from "app/ui/document/contract/peContractDocumentContractor";
import * as resources from "i18n!app/nls/resources";

/**
 * Парт для создания проекта документа Договор.
 */
class ContractDocumentTaskCreateProjectPart extends ContractDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Create_Project:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskCreateProjectPart.Options = {
        subtitle: resources["part.task.createDocumentProject"],
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
        },
    };

    /**
     * @constructs
     * @param {ContractDocumentTaskCreateProjectPart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskCreateProjectPart.Options) {
        super(ContractDocumentTaskCreateProjectPart.mixOptions(options, ContractDocumentTaskCreateProjectPart.DEFAULT_OPTIONS));
    }
}

namespace ContractDocumentTaskCreateProjectPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentTaskBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskCreateProjectPart.PART_NAME, (options?: ContractDocumentTaskCreateProjectPart.Options) => {
        return new ContractDocumentTaskCreateProjectPart(options);
    });
});
