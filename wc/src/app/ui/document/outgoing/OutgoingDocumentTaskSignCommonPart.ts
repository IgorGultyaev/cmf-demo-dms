import * as core from "core";
import {Application} from "core";
import {ApprovalDecision, ApprovalDecisionType} from "app/domain/model-ext";
import {ICommand} from "lib/core.commands";
import resources = require( "i18n!app/nls/resources" );
import ApprovalDecisionBaseEditor = require( "app/ui/document/outgoing/ApprovalDecisionBaseEditor" );

/**
 * Парт для подписания исходящего документа.
 */
class OutgoingDocumentTaskSignCommonPart extends ApprovalDecisionBaseEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Sign_Common:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskSignCommonPart.Options = {
        title: resources["part.task.subtitle.sign"],
        subtitle: resources["part.task.subtitle.sign"],
        leftMenu: {
            update: [{
                name: "Sign",
                title: resources["part.task.sign"],
                icon: "ok"
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
                    taskId: that.getTaskId()
                }
            }, {}).then(function (decision) {
                return that._ownUow.load("ApprovalDecision", decision.result.id, {
                    preloads: [
                        "approver.queue.iteration.document",
                        "approver.queue.iteration.document.attachment",
                        "approver.queue.iteration.document.addressees.correspondent"
                    ]
                });
            }).then(function (result) {
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
    options: OutgoingDocumentTaskSignCommonPart.Options;

    /**
     * @constructs
     * @param {OutgoingDocumentTaskSignCommonPart.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentTaskSignCommonPart.Options) {
        super(OutgoingDocumentTaskSignCommonPart.mixOptions(options, OutgoingDocumentTaskSignCommonPart.DEFAULT_OPTIONS));
    }


    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.Sign = new core.commands.BoundCommand(this.doSign, this.canSign, this);

        return commands;
    }

    /**
     * Подписать.
     */
    //TODO выделить общую часть из doApprove и doSign
    protected doSign(): void {
        const that = this;
        this.viewModel.decisionType(ApprovalDecisionType.SIGNED);

        this.doCompleteTaskInternal().fail(() => this.viewModel.decisionType(ApprovalDecisionType.WAIT));
    }

    /**
     * Определяет возможность выполнения команды Sign.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canSign(): boolean {
        return this.canCompleteTaskInternal();
    }
}

namespace OutgoingDocumentTaskSignCommonPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ApprovalDecisionBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentTaskSignCommonPart.PART_NAME, (options?: OutgoingDocumentTaskSignCommonPart.Options) => {
        return new OutgoingDocumentTaskSignCommonPart(options);
    });
});
