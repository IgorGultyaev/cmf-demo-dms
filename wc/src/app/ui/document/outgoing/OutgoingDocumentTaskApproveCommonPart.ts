import * as core from "core";
import {Application} from "core";
import {ApprovalDecision, ApprovalDecisionType} from "app/domain/model-ext";
import {ICommand} from "lib/core.commands";
import resources = require( "i18n!app/nls/resources" );
import ApprovalDecisionBaseEditor = require( "app/ui/document/outgoing/ApprovalDecisionBaseEditor" );

/**
 * Парт для согласования исходящего документа.
 */
class OutgoingDocumentTaskApproveCommonPart extends ApprovalDecisionBaseEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Approve_Common:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskApproveCommonPart.Options = {
        title: resources["part.task.subtitle.approve"],
        subtitle: resources["part.task.subtitle.approve"],
        leftMenu: {
            update: [{
                name: "Approve",
                title: resources["part.task.approve"],
                icon: "ok"
            }, {
                name: "ApproveWithComment",
                title: resources["part.task.approveWithComment"],
                icon: "redo"
            }, {
                name: "Decline",
                title: resources["part.task.decline"],
                icon: "stop"
            }],
            remove: ["CompleteTask"]
        },
        onSetViewModel: function () {
            var that = this;

            return core.Application.current.dataFacade.ajax({
                url: "/api/approval/document/decision/bytask",
                type: "GET",
                processData: true,
                async: true,
                data: {
                    taskId: that.getTaskId(),
                }
            }, {}).then(function (decision) {
                return that._ownUow.load("ApprovalDecision", decision.result.id, {
                    preloads: [
                        "approver.queue.iteration.document",
                        "approver.queue.iteration.document.attachment",
                        "approver.queue.iteration.document.addressees.correspondent",
                    ]
                });
            }).then(function (result) {
                that.document = result.document;
                return result;
            });
        },

    };

    /**
     * Тип модели  редактора.
     */
    viewModel: ApprovalDecision;

    /**
     * Тип опций компонента.
     */
    options: OutgoingDocumentTaskApproveCommonPart.Options;

    /**
     * @constructs
     * @param {OutgoingDocumentTaskApproveCommonPart.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentTaskApproveCommonPart.Options) {
        super(OutgoingDocumentTaskApproveCommonPart.mixOptions(options, OutgoingDocumentTaskApproveCommonPart.DEFAULT_OPTIONS));
    }


    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.ShowTask = new core.commands.BoundCommand(this.doShowTask, this.canShowTask, this);
        commands.ShowDocument = new core.commands.BoundCommand(this.doShowDocument, this.canShowDocument, this);
        commands.ShowCurrentApproval = new core.commands.BoundCommand(this.doShowCurrentApproval, this.canShowCurrentApproval, this);
        commands.Approve = new core.commands.BoundCommand(this.doApprove, this.canApprove, this);
        commands.Decline = new core.commands.BoundCommand(this.doDecline, this.canDecline, this);

        return commands;
    }

    /**
     * Утвердить.
     */
    protected doApprove(): void {
        const that = this;
        this.viewModel.decisionType(ApprovalDecisionType.APPROVED);

        this.doCompleteTaskInternal().fail(() => this.viewModel.decisionType(ApprovalDecisionType.WAIT));
    }

    /**
     * Определяет возможность выполнения команды Approve.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canApprove(): boolean {
        return this.canCompleteTaskInternal();
    }
}

namespace OutgoingDocumentTaskApproveCommonPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ApprovalDecisionBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskApproveCommonPart.PART_NAME, (options?: OutgoingDocumentTaskApproveCommonPart.Options) => {
        return new OutgoingDocumentTaskApproveCommonPart(options);
    });
});
