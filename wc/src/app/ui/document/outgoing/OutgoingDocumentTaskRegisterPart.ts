import * as core from "core";
import {Application} from "core";
import {OutgoingDocument} from "app/domain/model-ext";
import OutgoingDocumentTaskBaseEditor = require("app/ui/document/outgoing/OutgoingDocumentTaskBaseEditor");
import createDocumentTask = require( "xhtmpl!app/ui/document/outgoing/templates/registerDocumentTask.hbs" );
import peOutgoingAddressee = require("app/ui/document/outgoing/peOutgoingAddressee");
import documentApprovalTab = require("xhtmpl!app/ui/templates/documentApprovalTab.hbs");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import EditorPage = require("lib/ui/editor/EditorPage");
import ApprovalHistoryList = require("dms/modules/document/approval/ApprovalHistoryList");
import resources = require("i18n!app/nls/resources");
import DocumentActionNotifier = require("dms/modules/document/process/notification/DocumentActionNotifier");

/**
 * Парт для регистрации исходящего документа.
 */
class OutgoingDocumentTaskRegisterPart extends OutgoingDocumentTaskBaseEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Register:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskRegisterPart.Options = {
        subtitle: resources["part.task.registerDocument"],
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-sm-",
            template: createDocumentTask,
            properties: [
                { name: "documentKind"},
                { name: "organization", nullable: true, readOnly: true },
                { name: "author", nullable: true, readOnly: true },
                { name: "performer", readOnly: true, },
                { name: "status", readOnly: true, nullable: true },
                { name: "nomenclatureCase", },
                { name: "urgent", presentation: "checkbox", nullable: false, threeStates: false },
                { name: "paper", presentation: "checkbox", nullable: false, threeStates: false },
                { name: "permission", nullable: false },
                { name: "summary", nullable: true, useNotNullStyle: true, vt: "text" },
                { name: "sheetsAmount" },
                { name: "annexSheetsAmount" },
                { name: "addressees", PropertyEditor: peOutgoingAddressee, useTitledListLayout: true }
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
    viewModel: OutgoingDocument;

    /**
     * Тип опций компонента.
     */
    options: OutgoingDocumentTaskRegisterPart.Options;

    /**
     * @constructs
     * @param {OutgoingDocumentTaskRegisterPart.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentTaskRegisterPart.Options) {
        super(OutgoingDocumentTaskRegisterPart.mixOptions(options, OutgoingDocumentTaskRegisterPart.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected doCompleteTask(args: any): core.lang.Promise<void> {
        return super.doCompleteTask(args).done(() => {
            DocumentActionNotifier.documentActionNotifier.publishDocumentRegistrationEvent(OutgoingDocumentTaskRegisterPart.OUTGOING_DOCUMENT_REGISTRATION_SUCCESS, {
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

namespace OutgoingDocumentTaskRegisterPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentTaskBaseEditor.Options {

    }

    /**
     * Идентификатор события успешной регистрации документа.
     * @type {string}
     */
    export const OUTGOING_DOCUMENT_REGISTRATION_SUCCESS: string = "document.outgoing.registration.success";

}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskRegisterPart.PART_NAME, (options?: OutgoingDocumentTaskRegisterPart.Options) => {
        return new OutgoingDocumentTaskRegisterPart(options);
    });
});
