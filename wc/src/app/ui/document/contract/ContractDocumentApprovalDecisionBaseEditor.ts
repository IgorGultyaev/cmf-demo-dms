import * as core from "core";
import {SafeHtml} from "core";
import {
    ApprovalDecision,
    ApprovalDecisionType,
    ContractDocument,
    ContractDocumentContractor,
    Contractor
} from "app/domain/model-classes";
import {ICommand} from "lib/core.commands";
import * as ContractDocumentEditor from "app/ui/document/contract/ContractDocumentEditor";
import * as resources from "i18n!app/nls/resources";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as contractDocumentApproveTask
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentApproveTask.hbs";
import * as formatters from "lib/formatters";
import * as peViewOnly from "lib/ui/pe/peViewOnly";
import * as Icons from "dms/modules/icons/Icons";
import * as EditorPage from "lib/ui/editor/EditorPage";
import * as PropertyEditor from "lib/ui/pe/PropertyEditor";
import * as contractDocumentCommentsTabTemplate
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCommentsTab.hbs";
import * as DocumentCommentsComponent from "dms/modules/document/comment/DocumentCommentsComponent";
import * as CurrentApprovalIterationList from "dms/modules/document/approval/CurrentApprovalIterationList";
import * as documentRelationsTab from "xhtmpl!app/ui/templates/documentRelationsTab.hbs";
import * as DocumentRelationList from "dms/modules/document/relation/DocumentRelationList";
import * as TaskPartMixin from "dms/modules/task/TaskPartMixin";
import * as DocumentAttachmentContentViewer
    from "dms/modules/document/attachment/preview/DocumentAttachmentContentViewer";
import * as documentAttachmentsTab from "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs";
import * as dmsResources from "i18n!dms/modules/document/nls/resources";

/**
 * Базовый класс редактора для партов подписания и утверждения задач по документу Договор.
 */
class ContractDocumentApprovalDecisionBaseEditor extends ContractDocumentEditor implements TaskPartMixin {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentApprovalDecisionBaseEditor.Options = {
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                cssColumnPrefix: "col-sm-",
                cssClass: "has-bs-grid no-padding",
                template: contractDocumentApproveTask
            }, {
                name: "attachment",
                title: resources["part.document.pages.attachment"],
                template: documentAttachmentsTab,
                resources: {
                    title: resources["part.document.pages.attachment"]
                },
                hideTopMenu: true
            }, {
                name: "comments",
                title: resources["part.document.pages.comments"],
                template: contractDocumentCommentsTabTemplate,
                hideTopMenu: true
            }, {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab,
                resources: {
                    title: resources["part.document.pages.relatedDocuments"],
                },
                hideTopMenu: true
            }
        ],
        type: ApprovalDecision.meta.name,
        iconFormatter: function () {
            return formatters.safeHtml(core.ui.iconProvider.getIcon(Icons.CommonIcon.INFO, {
                title: dmsResources["part.document.pages.approval.infoIconTitle"]
            }));
        },
        onPageCreated: function (sender: ContractDocumentApprovalDecisionBaseEditor, args) {
            if (args.page.name == "comments") {
                (args.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: sender.viewModel.approver().queue().iteration().document()
                });

                args.page.registerChild((args.page as any).documentCommentsComponent, {
                    keepOnUnload: true,
                    trackStatus: true
                });

            }

            if (args.page.name == "relations") {
                (args.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.viewModel.uow,
                    source: this.viewModel.approver().queue().iteration().document(),
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                });

                args.page.registerChild((args.page as any).documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
            }
        },
        titleFormatter: function (args: any) {
            return ContractDocumentEditor.formatTitle(args.viewModel.approver().queue().iteration().document());
        },
        resourcesFormatter: function (value) {
            return resources[value];
        },
        topMenuSwitch: {
            items: [
                {
                    name: "ShowTask",
                    title: resources["part.document.pages.main"]

                },
                {
                    name: "ShowDocument",
                    title: resources["part.task.document"]

                }
            ],
            radio: true
        },

    };

    /**
     * Тип модели редактора.
     */
    viewModel: ApprovalDecision;

    /**
     * Тип опций компонента.
     */
    options: ContractDocumentEditor.Options;

    /**
     * @constructs
     * @param {ContractDocumentApprovalDecisionBaseEditor.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentApprovalDecisionBaseEditor.Options) {
        super(ContractDocumentApprovalDecisionBaseEditor.mixOptions(options, ContractDocumentApprovalDecisionBaseEditor.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        super.onPageCreated(args);

        switch (args.page.name) {
            case "attachment": {
                this.onAttachmentPageCreated(args.page);
                break;
            }
            case "main":
            case "comments": {
                const viewer = new DocumentAttachmentContentViewer();
                viewer.document(this.viewModel.approver().queue().iteration().document());
                (args.page as any).previewComponent = viewer;
                this.registerChild(viewer, {trackStatus: true, keepOnUnload: true});
                break;
            }
        }
    }

    /**
     * Обработчик события создания страницы редактора с вложениями.
     *
     * @param {EditorPage} page Созданная страница редактора для работы с вложениями
     */
    protected onAttachmentPageCreated(page: EditorPage): void {
        //TODO сделать attachmentsComponent по другому, возможно через дочерний парт.
        (page as any).attachmentsComponent = core.createPart("ObjectList:DocumentAttachment", {
            documentId: this.viewModel.approver().queue().iteration().document().id,
            uow: this.viewModel.uow,
            checkout: true,
            autoLoad: true,
            readOnly: true,
            presenterOptions: {
                menuRowCssClass: "x-menu-bar"
            }
        });

        this.registerChild((page as any).attachmentsComponent, {
            keepOnUnload: true,
            trackStatus: true
        });
    }

    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.ShowTask = new core.commands.BoundCommand(this.doShowTask, this.canShowTask, this);
        commands.ShowDocument = new core.commands.BoundCommand(this.doShowDocument, this.canShowDocument, this);
        commands.ShowCurrentApproval = new core.commands.BoundCommand(this.doShowCurrentApproval, this.canShowCurrentApproval, this);
        commands.Decline = new core.commands.BoundCommand(this.doDecline, this.canDecline, this);

        return commands;
    }

    /**
     * @inheritDoc
     */
    protected onCreatePropEditor(page: EditorPage, propMeta: PropertyEditor.Options, viewModel: ObjectEditor.Model): PropertyEditor.Options {
        const meta: PropertyEditor.Options = super.onCreatePropEditor(page, propMeta, viewModel);

        // TODO: https://jira.croc.ru/browse/A1900895-87 Проверить и при необходимости убрать ручную настройку peViewOnly для списка Контрагентов на РК Договора
        //TODO проверить, возможно это и не нужно вовсе, т.к. работает так же, по умолчанию, в wc.
        if (meta.name === ContractDocument.meta.props.contractors.name) {
            meta.PropertyEditor = peViewOnly;
            (meta as peViewOnly.Options).itemFormatter = function () {
                const contractDocumentContractor: ContractDocumentContractor = this;
                return contractDocumentContractor.contractor().name();
            };
            const that = this;
            (meta as peViewOnly.Options).commands = {
                View: core.createCommand({
                    execute: function (args) {
                        const contractDocumentContractor: ContractDocumentContractor = args.object;
                        const contractor: Contractor = contractDocumentContractor.contractor();

                        return that.navigationService.navigate({
                            part: "ObjectViewer:" + contractor.meta.name,
                            partOptions: {
                                viewModel: contractor
                            }
                        });
                    }
                })
            }
        }

        return meta;
    }

    /**
     * @inheritDoc
     */
    protected onPageStarted(args: ObjectEditor.PageEventArgs): void {
        super.onPageStarted(args);

        core.Application.current.affixManager.addElement(this.$domElement.find("#task-affix"));
    }

    /**
     * Отобразить задачу и скрыть документ.
     */
    protected doShowTask(): void {
        $(".cmf-task").removeClass("command-hide");
        $(".cmf-document").addClass("command-hide");
        $(".cmf-hideable-menu").removeClass("command-hide");
    }

    /**
     * Определяет возможность выполнения команды ShowTask.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canShowTask(): boolean {
        return true;
    }

    /**
     * Отобразить документ и скрыть задачу.
     */
    protected doShowDocument(): void {
        $(".cmf-task").addClass("command-hide");
        $(".cmf-document").removeClass("command-hide");
        $(".cmf-hideable-menu").addClass("command-hide");
    }

    /**
     * Определяет возможность выполнения команды ShowDocument.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canShowDocument(): boolean {
        return true;
    }

    /**
     * Показать текущего согласующего.
     */
    protected doShowCurrentApproval(): void {
        arguments[0].object.editor.executePartCommand({
            part: CurrentApprovalIterationList.PART_NAME,
            openInDialog: true,
            dialogOptions: {
                header: resources["part.task.current.approval"],
                wide: true
            },
            partOptions: {
                uow: arguments[0].object.editor.viewModel.uow,
                documentId: arguments[0].object.editor.viewModel.approver().queue().iteration().document().id
            }
        }, {}, "List");
    }

    /**
     * Определяет возможность выполнения команды ShowCurrentApproval.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canShowCurrentApproval(): boolean {
        return true;
    }

    /**
     * Отклонить.
     */
    protected doDecline(): void {
        var that = this;
        this.viewModel.decisionType(ApprovalDecisionType.REJECTED);

        this.doCompleteTaskInternal().fail(() => this.viewModel.decisionType(ApprovalDecisionType.WAIT));
    }

    /**
     * Определяет возможность выполнения команды Decline.
     * @return {boolean} <code>true</code> - выполнить команду можно, <code>false</code> - выполнить команду нельзя.
     */
    protected canDecline(): boolean {
        return this.canCompleteTaskInternal();
    }
}

interface ContractDocumentApprovalDecisionBaseEditor extends TaskPartMixin {
};

TaskPartMixin.mixinTo(ContractDocumentApprovalDecisionBaseEditor, "inherited");

namespace ContractDocumentApprovalDecisionBaseEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentEditor.Options {
        //TODO убрать вызов форматтера, либо сделать его во всех редакторах.
        /**
         * Форматтер ресурсов, для вызоав из шаблона страницы редактора.
         */
        resourcesFormatter?: (value) => string

        iconFormatter?: () => SafeHtml | string;
    }
}

export = ContractDocumentApprovalDecisionBaseEditor;