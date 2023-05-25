import * as core from "core";
import {Application} from "core";
import {ApprovalDecision, ApprovalDecisionType, ContractDocument} from "app/domain/model-ext";
import {ICommand} from "lib/core.commands";
import * as resources from "i18n!app/nls/resources";
import * as ContractDocumentApprovalDecisionBaseEditor
    from "app/ui/document/contract/ContractDocumentApprovalDecisionBaseEditor";

/**
 * Парт для согласования документа Договор.
 */
class ContractDocumentTaskApproveCommonPart extends ContractDocumentApprovalDecisionBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Approve_Common:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskApproveCommonPart.Options = {
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
                return that._ownUow.load(ApprovalDecision.meta.name, decision.result.id, {
                    preloads: [
                        "approver.queue.iteration.document",
                        "approver.queue.iteration.document.attachment",
                        "approver.queue.iteration.document.contractors.contractor",
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
    options: ContractDocumentTaskApproveCommonPart.Options;

    /**
     * @constructs
     * @param {ContractDocumentTaskApproveCommonPart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskApproveCommonPart.Options) {
        super(ContractDocumentTaskApproveCommonPart.mixOptions(options, ContractDocumentTaskApproveCommonPart.DEFAULT_OPTIONS));
    }


    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.Approve = new core.commands.BoundCommand(this.doApprove, this.canApprove, this);

        return commands;
    }

    /**
     * Утвердить.
     */
    //TODO выделить общую часть из doApprove и doSign
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

namespace ContractDocumentTaskApproveCommonPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentApprovalDecisionBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskApproveCommonPart.PART_NAME, (options?: ContractDocumentTaskApproveCommonPart.Options) => {
        return new ContractDocumentTaskApproveCommonPart(options);
    });
});
