import * as core from "core";
import {Application} from "core";
import {
    Company,
    ContractDocument,
    DocumentStatus,
    DocumentSubType,
    DocumentTemplate,
    DocumentType
} from "app/domain/model-classes";
import {ApprovalIteration} from "app/domain/model-ext";
import {LoadResponse} from "lib/interop/.interop";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import {Violation} from "lib/ui/editor/ObjectEditor";
import {obtainDocPropName} from "app/ui/dictionary/documentType/contract/ContractDocumentTemplateHelper";
import {peEmployeeDropDown} from "dms/modules/dictionary/orgstructure/peEmployeeDropDown";
import * as DocumentTemplateEditor from "dms/modules/document/dictionary/documentType/DocumentTemplateEditor";
import {currentUserService} from "dms/modules/security/CurrentUserService";
import * as EditorPageEx from "app/ui/editor/EditorPageEx";
import * as attributesPageTemplate
    from "xhtmpl!app/ui/dictionary/documentType/contract/templates/ContractDocumentTemplateAttributes.hbs";
import * as attachmentPageTemplate
    from "xhtmpl!app/ui/dictionary/documentType/contract/templates/ContractDocumentTemplateAttachment.hbs";
import * as mainPageTemplate
    from "xhtmpl!app/ui/dictionary/documentType/contract/templates/ContractDocumentTemplateMain.hbs";
import * as resources from "i18n!app/nls/resources";
import * as RegCardObjectEditor from "dms/modules/document/regCard/RegCardObjectEditor";
import * as peViewOnly from "lib/ui/pe/peViewOnly";
import * as documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as ApprovalIterationEditor from "dms/modules/document/approval/ApprovalIterationEditor";
import * as DataSource from "lib/data/DataSource";
import * as peNumber from "lib/ui/pe/peNumber";
import * as peDateTime from "lib/ui/pe/peDateTime";
import * as peBoolean from "lib/ui/pe/peBoolean";
import * as peString from "lib/ui/pe/peString";
import * as peEnumDropDownSelect2 from "lib/ui/pe/peEnumDropDownSelect2";
import * as peDictionaryDropDown from "dms/modules/dictionary/common/peDictionaryDropDown";
import * as peContractDocumentContractor from "app/ui/document/contract/peContractDocumentContractor";


const DocumentTemplateProps = DocumentTemplate.meta.props;

/**
 * Редактор шаблона документа Договор.
 */
class ContractDocumentTemplateEditor extends RegCardObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = DocumentTemplateEditor.PART_NAME + ":" + ContractDocument.meta.name;


    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTemplateEditor.Options = {
        pages: [{
            name: "main",
            title: resources["part.dictionary.documentType.contractDocument.pages.main.title"],
            template: mainPageTemplate,
            properties: [{
                name: DocumentTemplateProps.parent.name,
                descr: DocumentSubType.meta.descr,
                readOnly: true,
                nullable: true,
            }, {
                name: DocumentTemplateProps.name.name,
            }, {
                name: DocumentTemplateProps.description.name,
            }],
        }, {
            name: "attachments",
            template: attachmentPageTemplate,
            title: resources["part.document.pages.attachment"],
            hideTopMenu: true,
        }, {
            name: "approval",
            template: documentApprovalTab,
            title: resources["part.task.pages.approvalPath"],
            resources: {
                title: resources["part.task.pages.approvalPath"],
            },
        }, {
            name: "attributes",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-sm-",
            template: attributesPageTemplate,
            properties: [
                // Здесь можем указать только проперти AbstractDocument (такой тип поля в модели шаблона документа).
                // Для остальных пропертей Договора нужно явно определять редакторы полей в onPageCreated,
                // т.к. штатный механизм этого сделать не позволяет (ObjectEditor._getPropertyEditorMd).
                // Левая колонка до списка КА
                {name: obtainDocPropName(ContractDocument.meta.props.author.name), readOnly: true},
                {name: obtainDocPropName(ContractDocument.meta.props.organization.name), readOnly: true},
                {name: obtainDocPropName(ContractDocument.meta.props.documentKind.name)},

                // Правая колонка до списка КА

                // Левая колонка после списка КА
                {name: obtainDocPropName(ContractDocument.meta.props.nomenclatureCase.name)},
                {name: obtainDocPropName(ContractDocument.meta.props.permission.name)},

                // Правая колонка после списка КА
                {name: obtainDocPropName(ContractDocument.meta.props.status.name), readOnly: true}
            ]
        }],
        preloads: [DocumentTemplateProps.document.name],
        noTitleRef: true,
        titleFormatter: (editor): string => {
            return resources["part.dictionary.documentType.contractDocument.title"];
        },
        resources: {
            attachmentTitle: resources["part.document.pages.attachment"],
            approvalTitle: resources["part.task.pages.approvalPath"],
        },
    };

    /**
     * Опции компонента.
     */
    options: ContractDocumentTemplateEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: DocumentTemplate;

    /**
     * Итерация согласования.
     */
    private approvalIteration: ApprovalIteration;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: ContractDocumentTemplateEditor.Options) {
        options = ContractDocumentTemplateEditor.mixOptions(options, ContractDocumentTemplateEditor.DEFAULT_OPTIONS);
        super(options);
    }

    /**
     * @inheritDoc
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        let that = this;
        if (args.page.name == "main") {
            const editor = new peViewOnly(core.lang.extend({}, DocumentTemplateProps.parent.entity.props.parent, {
                nullable: true,
                descr: DocumentType.meta.descr,
            }));
            editor.setViewModel(this.viewModel.parent());
            args.page.editors["parent.parent"] = editor;
        } else if (args.page.name == "attributes") {
            // Левая колонка до списка КА
            // Определяем здесь, а не в массиве properties, иначе не подтягивается кастомное название контрола для UI
            const documentTypeEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.documentType, {}));
            documentTypeEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.documentType.name)] = documentTypeEditor;

            // Определяем здесь, а не в массиве properties, иначе не подтягивается кастомное название контрола для UI
            const summaryEditor = new peString(core.lang.extend({}, ContractDocument.meta.props.summary, {
                vt: "text"
            }));
            summaryEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.summary.name)] = summaryEditor;

            const costEditor = new peNumber(core.lang.extend({}, ContractDocument.meta.props.cost, {
                decimalSeparator: ".",
                spinner: false,
                hideClearButton: true
            }));
            costEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.cost.name)] = costEditor;

            const currencyEditor = new peDictionaryDropDown(core.lang.extend({}, ContractDocument.meta.props.currency, {
                // todo finance Задействовать маппинг CurrencyObjectMapping.ts
                showInfoButton: false
            }) as peDictionaryDropDown.Options);
            currencyEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.currency.name)] = currencyEditor;

            const costRubEditor = new peNumber(core.lang.extend({}, ContractDocument.meta.props.costRub, {
                decimalSeparator: ".",
                spinner: false,
                hideClearButton: true
            }));
            costRubEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.costRub.name)] = costRubEditor;

            const settlementTypeEditor = new peEnumDropDownSelect2(core.lang.extend({}, ContractDocument.meta.props.settlementType, {}) as peEnumDropDownSelect2.Options);
            settlementTypeEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.settlementType.name)] = settlementTypeEditor;

            const determiningCostEditor = new peString(core.lang.extend({}, ContractDocument.meta.props.determiningCost, {}));
            determiningCostEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.determiningCost.name)] = determiningCostEditor;

            const conditionIntoForceEditor = new peEnumDropDownSelect2(core.lang.extend({}, ContractDocument.meta.props.conditionIntoForce, {}) as peEnumDropDownSelect2.Options);
            conditionIntoForceEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.conditionIntoForce.name)] = conditionIntoForceEditor;

            const contractStateEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.contractState, {}));
            contractStateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.contractState.name)] = contractStateEditor;

            // Правая колонка до списка КА
            const createdBasedOnEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.createdBasedOn, {}));
            createdBasedOnEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.createdBasedOn.name)] = createdBasedOnEditor;

            const preparedByContractorEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.preparedByContractor, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            preparedByContractorEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.preparedByContractor.name)] = preparedByContractorEditor;

            const urgentEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.urgent, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            urgentEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.urgent.name)] = urgentEditor;

            const protocolDisagreementsEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.protocolDisagreements, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            protocolDisagreementsEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.protocolDisagreements.name)] = protocolDisagreementsEditor;

            const paperEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.paper, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            paperEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.paper.name)] = paperEditor;

            const protocolApproveDisagreementsEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.protocolApproveDisagreements, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            protocolApproveDisagreementsEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.protocolApproveDisagreements.name)] = protocolApproveDisagreementsEditor;

            const curatorEditor = new peEmployeeDropDown(core.lang.extend({}, ContractDocument.meta.props.curator, {}) as peEmployeeDropDown.Options);
            curatorEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.curator.name)] = curatorEditor;

            const performerEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.performer, {}));
            performerEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.performer.name)] = performerEditor;

            const signatoryEditor = new peEmployeeDropDown(core.lang.extend({}, ContractDocument.meta.props.signatory, {}) as peEmployeeDropDown.Options);
            signatoryEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.signatory.name)] = signatoryEditor;

            const warrantNameEditor = new peString(core.lang.extend({}, ContractDocument.meta.props.warrantName, {}));
            warrantNameEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.warrantName.name)] = warrantNameEditor;

            const signingDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.signingDate, {}) as peDateTime.Options);
            signingDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.signingDate.name)] = signingDateEditor;

            const agreementDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.agreementDate, {}) as peDateTime.Options);
            agreementDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.agreementDate.name)] = agreementDateEditor;

            const durationFromDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.durationFromDate, {}) as peDateTime.Options);
            durationFromDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.durationFromDate.name)] = durationFromDateEditor;

            const durationToDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.durationToDate, {}) as peDateTime.Options);
            durationToDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.durationToDate.name)] = durationToDateEditor;

            const completedDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.completedDate, {}) as peDateTime.Options);
            completedDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.completedDate.name)] = completedDateEditor;

            // Список КА
            const contractorsEditor = new peContractDocumentContractor(core.lang.extend({}, ContractDocument.meta.props.contractors, {
                useTitledListLayout: true
            }) as peContractDocumentContractor.Options);
            contractorsEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.contractors.name)] = contractorsEditor;

            // Левая колонка после списка КА
            const sheetsAmountEditor = new peNumber(core.lang.extend({}, ContractDocument.meta.props.sheetsAmount, {}));
            sheetsAmountEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.sheetsAmount"] = sheetsAmountEditor;

            const annexSheetsAmountEditor = new peNumber(core.lang.extend({}, ContractDocument.meta.props.annexSheetsAmount, {}));
            annexSheetsAmountEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.annexSheetsAmount"] = annexSheetsAmountEditor;

            const notesEditor = new peString(core.lang.extend({}, ContractDocument.meta.props.notes, {
                vt: "text"
            }));
            notesEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.notes.name)] = notesEditor;

            const terminationDateEditor = new peDateTime(core.lang.extend({}, ContractDocument.meta.props.terminationDate, {}) as peDateTime.Options);
            terminationDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.terminationDate.name)] = terminationDateEditor;

            const terminationReasonEditor = new peDictionaryDropDown(core.lang.extend({}, ContractDocument.meta.props.terminationReason, {
                // todo finance Задействовать маппинг ContractRevokeReasonObjectMapping.ts
                showInfoButton: false
            }) as peDictionaryDropDown.Options);
            terminationReasonEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.terminationReason.name)] = terminationReasonEditor;

            // Правая колонка после списка КА
            const dealWithInterestEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.dealWithInterest, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            dealWithInterestEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.dealWithInterest.name)] = dealWithInterestEditor;

            const greatlyDealEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.greatlyDeal, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            greatlyDealEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.greatlyDeal.name)] = greatlyDealEditor;

            const bigDealEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.bigDeal, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            bigDealEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.bigDeal.name)] = bigDealEditor;

            const propertyTransferEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.propertyTransfer, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            propertyTransferEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.propertyTransfer.name)] = propertyTransferEditor;

            const officialRegistrationEditor = new peBoolean(core.lang.extend({}, ContractDocument.meta.props.officialRegistration, {
                presentation: "checkbox",
                nullable: false,
                threeStates: false,
            }));
            officialRegistrationEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.officialRegistration.name)] = officialRegistrationEditor;

            const identifierEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.identifier, {}));
            identifierEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.identifier.name)] = identifierEditor;

            const creationDateEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.creationDate, {}));
            creationDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.creationDate.name)] = creationDateEditor;

            const registratorEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.registrator, {}));
            registratorEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.registrator.name)] = registratorEditor;

            const regNumberEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.regNumber, {}));
            regNumberEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.regNumber.name)] = regNumberEditor;

            const regDateEditor = new peViewOnly(core.lang.extend({}, ContractDocument.meta.props.regDate, {}));
            regDateEditor.setViewModel(this.viewModel.document());
            args.page.editors[obtainDocPropName(ContractDocument.meta.props.regDate.name)] = regDateEditor;

        } else if (args.page.name == "approval") {
            (args.page as any).queueComponent = core.createPart(ApprovalIterationEditor.PART_NAME, {
                approvalIteration: this.approvalIteration,
                uow: this.viewModel.uow,
                presenterOptions: {
                    menuRowCssClass: "x-menu-bar",
                },
            });
            this.registerChild((args.page as any).queueComponent, {
                keepOnUnload: true,
                trackStatus: true,
            });
        }

        super.onPageCreated(args);
    }

    /**
     * @inheritDoc
     */
    protected onConfirmDialogNoResult(deferred: core.lang.Deferred<void>) {
        //Если viewModel - новый объект, то уйти, отменив его создание всегда можно
        if (this.viewModel.isNew()) {
            super.onConfirmDialogNoResult(deferred);
            return;
        }

        //Со страницы нельзя уйти, если не заполнены обязательные поля.
        const violations: Violation[] = this.runValidation();
        if (violations && violations.length) {
            return deferred.reject();
        }

        super.onConfirmDialogNoResult(deferred);
    }

    /**
     * @inheritDoc
     */
    protected onPageSwitching(args: ObjectEditor.PageSwitchingEventArgs): void {
        if (this.viewModel.isNew()) {
            this.save();
            return;
        }

        super.onPageSwitching(args);
    }

    /**
     * @inheritDoc
     */
    protected onSetViewModel(viewModel: DocumentTemplate): core.lang.Promisable<ObjectEditor.Model> {
        return core.lang.resolved().then(() => {
            if (!viewModel.document()) {
                viewModel.document(viewModel.uow.createContractDocument());
            }

            if (viewModel.document().isNew()) {
                // Заполняем умолчательные значения шаблонного документа
                return core.lang.whenAll(currentUserService.getCurrentEmployeePosition().then((employeePosition) => {
                    viewModel.document().author(employeePosition);
                }), viewModel.uow.load(DocumentStatus, "id_DocumentStatus_Template").then(status => {
                    viewModel.document().status(status);
                }), viewModel.uow.load(DocumentType, this.options.documentSubTypeId).then(type => {
                    viewModel.document().documentType(type);
                    viewModel.parent(type);
                }), viewModel.uow.load(Company, this.options.companyId).then(company => {
                    viewModel.document().organization(company);
                    viewModel.company(company);
                })).then(() => {
                    const document: ContractDocument = viewModel.document() as ContractDocument;
                    document.creationDate(new Date());
                    document.identifier(core.lang.uuid().toString());
                    document.preparedByContractor(false);
                    document.urgent(false);
                    document.protocolDisagreements(false);
                    document.paper(false);
                    document.protocolApproveDisagreements(false);
                    document.dealWithInterest(false);
                    document.propertyTransfer(false);
                    document.greatlyDeal(false);
                    document.officialRegistration(false);
                    document.bigDeal(false);
                });
            }
        }).then(() => {
            return super.onSetViewModel(viewModel);
        }).then((viewmodel: DocumentTemplate) => {
            return new DataSource(core.Application.current, {
                entityType: ApprovalIteration.meta.name,
                params: {
                    $filter: {
                        document: viewModel.document().id,
                    }
                }
            }).load().then((loadResponse: LoadResponse) => {
                const objects = viewModel.uow.fromServerResponse(loadResponse) as ApprovalIteration[];
                if (objects.length == 1) {
                    this.approvalIteration = objects[0];
                } else {
                    this.approvalIteration = viewModel.uow.createApprovalIteration();
                    this.approvalIteration.document(viewModel.document());
                }

                return viewModel;
            });
        });
    }
}

namespace ContractDocumentTemplateEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends RegCardObjectEditor.Options {
        /**
         * Идентификатор подтипа документа, для создания нового шаблона.
         */
        documentSubTypeId?: string;

        /**
         * Идентификатор организации, для которой создается новый шаблон.
         */
        companyId?: string;

        /**
         * Ресурсы для локализации компонента, которые должны быть отображены в шаблонах.
         */
        resources?: core.lang.Map<string>;

        /**
         * Страницы редактора, расширенные.
         */
        pages?: EditorPageEx.Options[];
    }

}

export = ContractDocumentTemplateEditor;

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTemplateEditor.PART_NAME, (options?: ContractDocumentTemplateEditor.Options) => {
        return new ContractDocumentTemplateEditor(options);
    });
});

