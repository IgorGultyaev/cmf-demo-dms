import * as core from "core";
import {Application} from "core";
import * as taskResources from "i18n!dms/modules/task/nls/resources";
import {OutgoingDocument} from "app/domain/model-ext";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import resources = require("i18n!app/nls/resources");
import manualSendTask = require("xhtmpl!app/ui/document/outgoing/templates/manualSendTask.hbs");
import peDocumentAttachment = require("app/ui/peDocumentAttachment");
import peOutgoingAddressee = require("app/ui/document/outgoing/peOutgoingAddressee");
import EditorPage = require("lib/ui/editor/EditorPage");
import Icons = require("dms/modules/icons/Icons");
import formatters = require( "lib/formatters" );
import OutgoingDocumentTaskBaseEditor = require("app/ui/document/outgoing/OutgoingDocumentTaskBaseEditor");
import * as documentApprovalResources from "i18n!dms/modules/document/approval/nls/resources";

/**
 * Парт для процесса отправки исходящего документа.
 */
class OutgoingDocumentTaskSendPart extends OutgoingDocumentTaskBaseEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Send:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskSendPart.Options = {
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-xs-",
            template: manualSendTask,
            properties: [
                {name: "attachment", PropertyEditor: peDocumentAttachment},
                {name: "organization", nullable: true, readOnly: true, navigable: false},
                {name: "documentKind", nullable: true, readOnly: true, navigable: false},
                {name: "identifier", nullable: true, readOnly: true},
                {name: "status", nullable: true, readOnly: true},
                {name: "summary", nullable: true, vt: "text", readOnly: true},
                {name: "sheetsAmount", nullable: true, readOnly: true},
                {name: "annexSheetsAmount", nullable: true, readOnly: true},
                {name: "urgent", nullable: true, readOnly: true},
                {name: "paper", nullable: true, readOnly: true},
                {name: "permission", nullable: true, readOnly: true},
                {name: "performer", nullable: true, readOnly: true, navigable: false},
                {name: "signatory", nullable: true, readOnly: true, navigable: false},
                {
                    name: "addressees",
                    PropertyEditor: peOutgoingAddressee,
                    send: true,
                    readOnly: false,
                    useTitledListLayout: true
                }
            ],
            resources: {
                title: resources["part.document.pages.attachment"]
            }
        },
        approvalPageOptions: null,
        attachmentPageOptions: null,
        //TODO выяснить параметр
        //editable: true,
        type: OutgoingDocument.meta.name,
        iconFormatter: function (args) {
            return formatters.safeHtml(core.ui.iconProvider.getIcon(Icons.CommonIcon.INFO, {
                title: documentApprovalResources["part.document.pages.approval.infoIconTitle"]
            }));
        },
        subtitle: resources["part.task.subtitle.send"],
        leftMenu: {
            update: [
                {
                    name: "CompleteTask",
                    title: taskResources["part.task.complete"],
                    icon: "redo"
                }
            ]
        },
        onSetViewModel: function () {
            return this._ownUow.load("OutgoingDocument", this.getTaskEntityId(), {preloads: ["performer", "signatory"]});
        }
    };

    /**
     * Тип опций парта.
     */
    options: OutgoingDocumentTaskSendPart.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: OutgoingDocumentTaskSendPart.Options) {
        super(OutgoingDocumentTaskSendPart.mixOptions(options, OutgoingDocumentTaskSendPart.DEFAULT_OPTIONS));
    }

    protected onMainPageCreated(page: EditorPage): void {
        super.onMainPageCreated(page);

        (page as any).attachmentComponent = core.createPart("ObjectList:DocumentAttachment", {
            documentId: this.viewModel.id,
            uow: this.viewModel.uow,
            checkout: false,
            autoLoad: true,
            readOnly: true,
            presenterOptions: {
                menuRowCssClass: "x-menu-bar"
            }
        });
    }
}

namespace OutgoingDocumentTaskSendPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentTaskBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskSendPart.PART_NAME, (options?: OutgoingDocumentTaskSendPart.Options) => {
        return new OutgoingDocumentTaskSendPart(options);
    });
});

export = OutgoingDocumentTaskSendPart;