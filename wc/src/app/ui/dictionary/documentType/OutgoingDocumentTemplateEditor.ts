import * as core from "core";
import {Application} from "core";
import {
    Company,
    DocumentStatus,
    DocumentSubType,
    DocumentTemplate,
    DocumentType,
    OutgoingDocument
} from "app/domain/model-classes";
import {peEmployeeDropDown} from "dms/modules/dictionary/orgstructure/peEmployeeDropDown";
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import * as DocumentTemplateEditor from "dms/modules/document/dictionary/documentType/DocumentTemplateEditor";
import attributesPageTemplate = require("xhtmpl!app/ui/dictionary/documentType/templates/outgoingDocumentTemplate.attributes.hbs");
import attachmentPageTemplate = require("xhtmpl!app/ui/dictionary/documentType/templates/outgoingDocumentTemplate.attachment.hbs");
import mainPageTemplate  = require("xhtmpl!app/ui/dictionary/documentType/templates/outgoingDocumentTemplate.main.hbs");
import resources = require("i18n!app/nls/resources");
import RegCardObjectEditor = require("dms/modules/document/regCard/RegCardObjectEditor");
import {currentUserService} from "dms/modules/security/CurrentUserService";
import peOutgoingAddressee = require("app/ui/document/outgoing/peOutgoingAddressee");
import peViewOnly = require("lib/ui/pe/peViewOnly");
import peNumber = require("lib/ui/pe/peNumber");
import peBoolean = require("lib/ui/pe/peBoolean");
import documentApprovalTab = require( "xhtmpl!app/ui/templates/documentApprovalTab.hbs" );
import ApprovalIterationEditor = require("dms/modules/document/approval/ApprovalIterationEditor");
import {AbstractDocument, ApprovalIteration, ApprovalIterationState} from "app/domain/model-ext";
import {LoadResponse} from "lib/interop/.interop";
import DataSource = require("lib/data/DataSource");
import {Violation} from "lib/ui/editor/ObjectEditor";

const DocumentTemplateProps = DocumentTemplate.meta.props;

/**
 * Редактор шаблона исходящего документа.
 */
class OutgoingDocumentTemplateEditor extends RegCardObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = DocumentTemplateEditor.PART_NAME + ":" + OutgoingDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTemplateEditor.Options = {
        pages: [{
            name: "main",
            title: resources["part.dictionary.documenttype.outgoingdocument.pages.main.title"],
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
                {
                    name: "document.documentKind",
                },
                {
                    name: "document.organization",
                    readOnly: true
                },
                {
                    name: "document.author",
                    readOnly: true,
                    nullable: true,
                },
                {
                    name: "document.status",
                    readOnly: true,
                    nullable: true,
                },
                {
                    name: "document.nomenclatureCase",
                },
                {
                    name: "document.permission",
                },
                {
                    name: "document.summary",
                    vt: "text"
                },
            ]
        }],
        preloads: [DocumentTemplateProps.document.name],
        noTitleRef: true,
        titleFormatter: (editor): string => {
            return resources["part.dictionary.documenttype.outgoingdocument.title"];
        },
        resources: {
            attachmentTitle: resources["part.document.pages.attachment"],
            approvalTitle: resources["part.task.pages.approvalPath"],
        },
    };

    /**
     * Опции компонента.
     */
    options: OutgoingDocumentTemplateEditor.Options;

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
    constructor(options?: OutgoingDocumentTemplateEditor.Options) {
        options = OutgoingDocumentTemplateEditor.mixOptions(options, OutgoingDocumentTemplateEditor.DEFAULT_OPTIONS);
        super(options);
    }

    /**
     * @inheritDoc
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        if (args.page.name == "main") {
            const editor = new peViewOnly(core.lang.extend({}, DocumentTemplateProps.parent.entity.props.parent, {
                nullable: true,
                descr: DocumentType.meta.descr,
            }));
            editor.setViewModel(this.viewModel.parent());
            args.page.editors["parent.parent"] = editor;
        } else if (args.page.name == "attributes") {
            const performerEditor = new peEmployeeDropDown(core.lang.extend({}, OutgoingDocument.meta.props.performer, {}) as peEmployeeDropDown.Options);
            performerEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.performer"] = performerEditor;

            const registratorEditor = new peEmployeeDropDown(core.lang.extend({}, OutgoingDocument.meta.props.registrator, {}) as peEmployeeDropDown.Options);
            registratorEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.registrator"] = registratorEditor;

            const adresseesEditor = new peOutgoingAddressee(core.lang.extend({}, OutgoingDocument.meta.props.addressees, {
                useTitledListLayout: true,
            }) as peOutgoingAddressee.Options);
            adresseesEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.addressees"] = adresseesEditor;

            const sheetsAmountEditor = new peNumber(core.lang.extend({}, OutgoingDocument.meta.props.sheetsAmount, {}));
            sheetsAmountEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.sheetsAmount"] = sheetsAmountEditor;

            const annexSheetsAmountEditor = new peNumber(core.lang.extend({}, OutgoingDocument.meta.props.annexSheetsAmount, {}));
            annexSheetsAmountEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.annexSheetsAmount"] = annexSheetsAmountEditor;

            const urgentEditor = new peBoolean(core.lang.extend({}, OutgoingDocument.meta.props.urgent, {
                nullable: false,
                threeStates: false,
            }));
            urgentEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.urgent"] = urgentEditor;

            const paperEditor = new peBoolean(core.lang.extend({}, OutgoingDocument.meta.props.paper, {
                nullable: false,
                threeStates: false,
            }));
            paperEditor.setViewModel(this.viewModel.document());
            args.page.editors["document.paper"] = paperEditor;
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
        if(this.viewModel.isNew()) {
            super.onConfirmDialogNoResult(deferred);
            return;
        }

        //Со страницы нельзя уйти, если не заполнены обязательные поля.
        const violations: Violation[] = this.runValidation();
        if(violations && violations.length) {
            return deferred.reject();
        }

        super.onConfirmDialogNoResult(deferred);
    }

    /**
     * @inheritDoc
     */
    protected onPageSwitching(args: ObjectEditor.PageSwitchingEventArgs): void {
        if(this.viewModel.isNew()) {
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
                viewModel.document(viewModel.uow.createOutgoingDocument());
            }

            if (viewModel.document().isNew()) {
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
                    const document: OutgoingDocument = viewModel.document() as OutgoingDocument;
                    document.creationDate(new Date());
                    document.identifier(core.lang.uuid().toString());
                    document.urgent(false);
                    document.paper(false);
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

namespace OutgoingDocumentTemplateEditor {
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

export = OutgoingDocumentTemplateEditor;

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTemplateEditor.PART_NAME, (options?: OutgoingDocumentTemplateEditor.Options) => {
        return new OutgoingDocumentTemplateEditor(options);
    });
});

