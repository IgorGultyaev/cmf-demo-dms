import {Application} from "core";
import core = require("core");
import resources = require("i18n!app/nls/resources");
import documentApprovalTabWithHistory = require("xhtmpl!app/ui/templates/documentApprovalTabWithHistory.hbs");
import EditorPage = require("lib/ui/editor/EditorPage");
import OutgoingDocumentTaskBaseEditor = require("app/ui/document/outgoing/OutgoingDocumentTaskBaseEditor");
import ApprovalHistoryList = require("dms/modules/document/approval/ApprovalHistoryList");

/**
 * Парт для доработки исходящего документа.
 */
class OutgoingDocumentTaskRefinePart extends OutgoingDocumentTaskBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Refine:OutgoingDocument";
    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskRefinePart.Options = {
        subtitle: resources["part.task.refineDocument"],
        approvalPageOptions: {
            name: "approval",
            title: resources["part.task.pages.approvalPath"],
            template: documentApprovalTabWithHistory,
            resources: {
                queueTitle: resources["part.task.pages.approvalPath"]
            }
        },
    };

    /**
     * @constructs
     * @param {OutgoingDocumentTaskRefinePart.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentTaskRefinePart.Options) {
        super(OutgoingDocumentTaskRefinePart.mixOptions(options, OutgoingDocumentTaskRefinePart.DEFAULT_OPTIONS));
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
}

namespace OutgoingDocumentTaskRefinePart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentTaskBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskRefinePart.PART_NAME, (options?: OutgoingDocumentTaskRefinePart.Options) => {
        return new OutgoingDocumentTaskRefinePart(options);
    });
});
