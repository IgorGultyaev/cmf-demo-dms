import * as core from "core";
import * as PropertyEditor from "lib/ui/pe/PropertyEditor";
import * as peContractDocumentContractor from "app/ui/document/contract/peContractDocumentContractor";
import {ContractDocument} from "app/domain/model-ext";
import lang = core.lang;

/**
 * Общие параметры для документа Договор.
 */
namespace ContractDocumentSharedParams {

    /**
     * Общие проперти документа Договор для внепроцессного просмотра/редактирования.
     */
    export const CONTRACT_EDITOR_COMMON_PROPERTIES: ((PropertyEditor.Options & lang.Map<any>) | string)[] =
        [
            // Левая колонка до списка КА
            {name: ContractDocument.meta.props.organization.name, navigable: false, readOnly: true},
            {name: ContractDocument.meta.props.documentType.name, navigable: false, readOnly: true},
            {name: ContractDocument.meta.props.documentKind.name, navigable: false},
            {name: ContractDocument.meta.props.summary.name, vt: "text"},
            {
                name: ContractDocument.meta.props.cost.name,
                decimalSeparator: ".",
                spinner: false,
                hideClearButton: true
            },
            {name: ContractDocument.meta.props.currency.name, navigable: false},
            {
                name: ContractDocument.meta.props.costRub.name,
                decimalSeparator: ".",
                spinner: false,
                hideClearButton: true
            },
            {name: ContractDocument.meta.props.settlementType.name},
            {name: ContractDocument.meta.props.determiningCost.name, vt: "string"},
            {name: ContractDocument.meta.props.conditionIntoForce.name},
            {name: ContractDocument.meta.props.contractState.name},

            // Правая колонка до списка КА
            {name: ContractDocument.meta.props.createdBasedOn.name, navigable: false, readOnly: true},
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
            {name: ContractDocument.meta.props.curator.name, navigable: false},
            {name: ContractDocument.meta.props.performer.name, navigable: false},
            {name: ContractDocument.meta.props.signatory.name, navigable: false},
            {name: ContractDocument.meta.props.warrantName.name},
            {name: ContractDocument.meta.props.signingDate.name},
            {name: ContractDocument.meta.props.agreementDate.name},
            {name: ContractDocument.meta.props.durationFromDate.name},
            {name: ContractDocument.meta.props.durationToDate.name},
            {name: ContractDocument.meta.props.completedDate.name},

            // Список КА
            {
                name: ContractDocument.meta.props.contractors.name,
                useTitledListLayout: true,
                PropertyEditor: peContractDocumentContractor
            },

            // Левая колонка после списка КА
            {name: ContractDocument.meta.props.nomenclatureCase.name, navigable: false},
            {name: ContractDocument.meta.props.sheetsAmount.name},
            {name: ContractDocument.meta.props.annexSheetsAmount.name},
            {name: ContractDocument.meta.props.notes.name, vt: "text"},
            {name: ContractDocument.meta.props.terminationDate.name},
            {name: ContractDocument.meta.props.terminationReason.name, navigable: false},
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
            {name: ContractDocument.meta.props.status.name, navigable: false, readOnly: true},
            {name: ContractDocument.meta.props.creationDate.name, readOnly: true},
            {name: ContractDocument.meta.props.registrator.name, navigable: false},
            {name: ContractDocument.meta.props.regNumber.name},
            {name: ContractDocument.meta.props.regDate.name}
        ];

}

export = ContractDocumentSharedParams;