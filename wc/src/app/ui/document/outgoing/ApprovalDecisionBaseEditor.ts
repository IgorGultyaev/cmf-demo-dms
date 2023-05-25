import * as core from "core";
import {SafeHtml} from "core";
import {AbstractDocument, ApprovalDecision, ApprovalDecisionType} from "app/domain/model-classes";
import {ICommand} from "lib/core.commands";
import OutgoingDocumentEditor = require( "app/ui/document/outgoing/OutgoingDocumentEditor" );
import resources = require( "i18n!app/nls/resources" );
import ObjectEditor = require( "lib/ui/editor/ObjectEditor" );
import approveTask = require( "xhtmpl!app/ui/document/outgoing/templates/approveTask.hbs" );
import formatters = require( "lib/formatters" );
import peViewOnly = require( "lib/ui/pe/peViewOnly" );
import Icons = require( "dms/modules/icons/Icons" );
import EditorPage = require( "lib/ui/editor/EditorPage" );
import PropertyEditor = require( "lib/ui/pe/PropertyEditor" );
import commentsTabTemplate = require( "xhtmpl!app/ui/document/outgoing/templates/CommentsTab.hbs" );
import DocumentCommentsComponent = require( "dms/modules/document/comment/DocumentCommentsComponent" );
import CurrentApprovalIterationList = require( "dms/modules/document/approval/CurrentApprovalIterationList" );
import documentRelationsTab = require( "xhtmpl!app/ui/templates/documentRelationsTab.hbs" );
import DocumentRelationList = require( "dms/modules/document/relation/DocumentRelationList" );
import TaskPartMixin = require( "dms/modules/task/TaskPartMixin" );
import DocumentAttachmentContentViewer = require("dms/modules/document/attachment/preview/DocumentAttachmentContentViewer");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import * as documentApprovalResources from "i18n!dms/modules/document/approval/nls/resources";

/**
 * Базовый класс редактора для партов подписания и утверждения задач по исходящему документу.
 */
class ApprovalDecisionBaseEditor extends OutgoingDocumentEditor implements TaskPartMixin {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ApprovalDecisionBaseEditor.Options = {
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                cssColumnPrefix: "col-sm-",
                cssClass: "has-bs-grid no-padding",
                template: approveTask
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
                template: commentsTabTemplate,
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
                title: documentApprovalResources["part.document.pages.approval.infoIconTitle"]
            }));
        },
        onPageCreated: function (sender: ApprovalDecisionBaseEditor, args) {
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
            return OutgoingDocumentEditor.formatTitle(args.viewModel.approver().queue().iteration().document());
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
     * Тип модели  редактора.
     */
    viewModel: ApprovalDecision;

    /**
     * Тип опций компонента.
     */
    options: OutgoingDocumentEditor.Options;

    /**
     * @constructs
     * @param {OutgoingDocumentEditor.Options} options Опции парта.
     */
    constructor(options?: ApprovalDecisionBaseEditor.Options) {
        super(ApprovalDecisionBaseEditor.mixOptions(options, ApprovalDecisionBaseEditor.DEFAULT_OPTIONS));
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

        //TODO проверить, возможно это и не нужно вовсе, т.к. работает так же, по умолчанию, в wc.
        if (meta.name === "addressees") {
            meta.PropertyEditor = peViewOnly;
            (meta as peViewOnly.Options).itemFormatter = function () {
                return this.correspondent().name();
            };
            var that = this;
            (meta as peViewOnly.Options).commands = {
                View: core.createCommand({
                    execute: function (args) {
                        var obj = args.object.correspondent();

                        return that.navigationService.navigate({
                            part: "ObjectViewer:" + obj.meta.name,
                            partOptions: {
                                viewModel: obj
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

    /**
     * @override
     */
    protected getDocumentViewModel(): AbstractDocument{
        return this.viewModel.approver().queue().iteration().document();
    }

}

interface ApprovalDecisionBaseEditor extends TaskPartMixin {
};

TaskPartMixin.mixinTo(ApprovalDecisionBaseEditor, "inherited");

namespace ApprovalDecisionBaseEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentEditor.Options {
        //TODO убрать вызов форматтера, либо сделать его во всех редакторах.
        /**
         * Форматтер ресурсов, для вызоав из шаблона страницы редактора.
         */
        resourcesFormatter?: (value) => string

        iconFormatter?: () => SafeHtml | string;
    }
}

export = ApprovalDecisionBaseEditor;