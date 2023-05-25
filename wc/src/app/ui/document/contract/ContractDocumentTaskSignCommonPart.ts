import * as core from "core";
import {Application} from "core";
import {ApprovalDecision, ApprovalDecisionType} from "app/domain/model-ext";
import {ICommand} from "lib/core.commands";
import {ContractDocument} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";
import * as ContractDocumentApprovalDecisionBaseEditor
    from "app/ui/document/contract/ContractDocumentApprovalDecisionBaseEditor";

/**
 * Парт для подписания документа Договор.
 */
class ContractDocumentTaskSignCommonPart extends ContractDocumentApprovalDecisionBaseEditor {

    //TODO добавить resolver или builder для подобных имен
    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Sign_Common:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskSignCommonPart.Options = {
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
                return that._ownUow.load(ApprovalDecision.meta.name, decision.result.id, {
                    preloads: [
                        "approver.queue.iteration.document",
                        "approver.queue.iteration.document.attachment",
                        "approver.queue.iteration.document.contractors.contractor"
                    ]
                });
            }).then(function (result) {
                return result;
            });
        },

    };

    /**
     * Тип модели редактора.
     */
    viewModel: ApprovalDecision;

    /**
     * Тип опций компонента.
     */
    options: ContractDocumentTaskSignCommonPart.Options;

    /**
     * @constructs
     * @param {ContractDocumentTaskSignCommonPart.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentTaskSignCommonPart.Options) {
        super(ContractDocumentTaskSignCommonPart.mixOptions(options, ContractDocumentTaskSignCommonPart.DEFAULT_OPTIONS));
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

namespace ContractDocumentTaskSignCommonPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentApprovalDecisionBaseEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentTaskSignCommonPart.PART_NAME, (options?: ContractDocumentTaskSignCommonPart.Options) => {
        return new ContractDocumentTaskSignCommonPart(options);
    });
});
