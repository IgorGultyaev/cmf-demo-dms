import core = require( "core" );
import Part = require( "lib/ui/Part" );
import * as EditorPage from "lib/ui/editor/EditorPage";
import DocumentObjectEditor = require("app/ui/editor/DocumentObjectEditor");
import resources = require( "i18n!app/nls/resources" );
import mainTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/ReviewTask.hbs");
import commentsTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/CommentsTab.hbs");
import DocumentCommentsComponent = require("dms/modules/document/comment/DocumentCommentsComponent");
import IncomingDocumentObjectEditor = require("app/ui/document/incoming/IncomingDocumentObjectEditor");
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import TaskPartMixin = require( "dms/modules/task/TaskPartMixin" );
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import DocumentAttachmentContentViewer = require("dms/modules/document/attachment/preview/DocumentAttachmentContentViewer");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import dmsResources = require("i18n!dms/modules/document/nls/resources");
import IncomingDocumentCommissionsList = require("app/ui/document/incoming/commission/IncomingDocumentCommissionsList");
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import {IncomingDocument} from "app/domain/model-classes";
import {AffixItem, AffixItemImpl, StuckBehavior} from "modules/affix/affix";
import {ICommand} from "lib/core.commands";
import {taskService} from "dms/modules/task/service/TaskService";
import {heightCalculator} from "cmf/modules/affix/HeightCalculator";

/**
 * Карточка задачи на рассмотрение входящего.
 * <p/>
 * TODO: сменить родителя на IncomingDocumentTaskEditor
 */
class IncomingDocumentTaskReviewPart extends IncomingDocumentObjectEditor implements TaskPartMixin {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_On_Review:IncomingDocument";

    /**
     *  Наименование дочернего part'а, содержащего список поручений.
     */
    protected static COMMISSIONS_LIST_CHILD_NAME = "CommissionsList";

    /**
     * Имя первого парта на странице(Основные реквизиты).
     */
    static MAIN_PART_NAME: string = "main";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: IncomingDocumentTaskReviewPart.Options = {
        presenterOptions: {
            resources: {
                titleShowDocument: resources['part.document.title.showDocument'],
            }
        },
        pages: [
            {
                name: IncomingDocumentTaskReviewPart.MAIN_PART_NAME,
                title: resources["part.document.pages.main"],
                cssColumnPrefix: "col-sm-",
                cssClass: "has-bs-grid no-padding",
                template: mainTabTemplate,
                resources: {
                    commissions: resources["part.task.review.commissionsList"]
                }
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
        preloads: ["attachment"],
        onPageUnloading: function (editor, page) {
            core.Application.current.affixManager.removeElement($(editor.domElement)
                .find(IncomingDocumentTaskReviewPart.TASK_AFFIX_SELECTOR));
            core.Application.current.affixManager.removeElement($(editor.domElement)
                .find(IncomingDocumentTaskReviewPart.TASK_AFFIX_BOTTOM_SELECTOR));
        },
        type: IncomingDocument.meta.name,
        title: resources["part.task.subtitle.review"],
        menuButtonFormatter: function () {
            return dmsResources["menu.collapsed.title"];
        },
        resourcesFormatter: function (value) {
            return resources[value];
        },
        subtitle: resources["part.task.subtitle.review"],
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
        leftMenu: {
            update: [
                {
                    name: "CompleteTask",
                    title: resources["part.task.finishReview"],
                    icon: "ok"
                }
            ]
        }
    };

    /**
     * Опции компонента.
     */
    options: IncomingDocumentTaskReviewPart.Options;

    /**
     * Тип модели.
     */
    viewModel: IncomingDocument;

    /**
     * Идентификатор сотрудника в должности, назначенного рассматривающим.
     */
    reviewerEmployeePositionId: string;

    /**
     * Селектор для DOM-элемента, объединяющего основные реквизиты и поручения.
     */
    static TASK_AFFIX_SELECTOR: string = "#task-affix";

    /**
     * Селектор для вспомогательного элемента, управляющего taskAffix'ом, когда тот откреплен.
     */
    static TASK_AFFIX_BOTTOM_SELECTOR: string = "#task-affix-bottom";

    /**
     * Селектор DOM-родителя taskAffix'а.
     */
    protected taskAffixParentSelector: string;

    /**
     * Селектор pdf-документа.
     */
    static CMF_DOCUMENT_HIDE_SELECTOR: string = ".cmf-document.command-hide";

    /**
     * Селектор компонента с задачами.
     */
    static CMF_TASK_HIDE_SELECTOR: string = ".cmf-task.command-hide";

    /**
     * @constructor
     * @param {IncomingDocumentTaskReviewPart.Options} options Опции парта.
     */
    constructor(options?: IncomingDocumentTaskReviewPart.Options) {
        super(IncomingDocumentTaskReviewPart.mixOptions(options, IncomingDocumentTaskReviewPart.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected onReady(): void {
        super.onReady();
        this.$domElement.find('[data-toggle="tooltip"]').tooltip();
    }

    /**
     * @inheritDoc
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        super.onPageCreated(args);
        switch (args.page.name) {
            case IncomingDocumentTaskReviewPart.MAIN_PART_NAME:
                const viewer = new DocumentAttachmentContentViewer();
                viewer.document(this.viewModel as IncomingDocument);
                (args.page as any).previewComponent = viewer;
                this.registerChild(viewer, {trackStatus: true, keepOnUnload: true});

                this.initializeTaskAffixParentSelector(args.page);
                break;

            case "comments":
                (args.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: this.viewModel
                });

                args.page.registerChild((args.page as any).documentCommentsComponent, {
                    keepOnUnload: true,
                    trackStatus: true
                });
                break;

            case "relations":
                (args.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.viewModel.uow,
                    source: this.viewModel,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                });

                args.page.registerChild((args.page as any).documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
                break;
            case "attachment": {
                this.onAttachmentPageCreated(args.page);
                break;
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.ShowTask = core.commands.createBoundCommand(this.doShowTask, this);
        commands.ShowDocument = core.commands.createBoundCommand(this.doShowDocument, this);

        return commands;
    }

    /**
     * Обработчик события создания страницы редактора с вложениями.
     *
     * @param {EditorPage} page Созданная страница редактора для работы с вложениями
     */
    protected onAttachmentPageCreated(page: EditorPageEx): void {
        //TODO сделать attachmentsComponent по другому, возможно через дочерний парт.
        (page as any).attachmentsComponent = core.createPart("ObjectList:DocumentAttachment", {
            documentId: this.viewModel.id,
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

    /**
     * Команда для отображения основных реквизитов, при низких разрешениях.
     */
    protected doShowTask() {
        $(".cmf-task").removeClass("command-hide");
        $(".cmf-document").addClass("command-hide");
        $(".cmf-hideable-menu").removeClass("command-hide");
    }

    /**
     * Команда для отображения компонента предпросмотра контента, при низких разрешениях.
     */
    protected doShowDocument() {
        $(".cmf-task").addClass("command-hide");
        $(".cmf-document").removeClass("command-hide");
        $(".cmf-hideable-menu").addClass("command-hide");
    }

    /**
     * @inheritDoc
     */
    protected onSetViewModel(viewModel: IncomingDocument): core.lang.Promisable<IncomingDocument> {
        return taskService.requestForAdditionalInfo({
            taskId: this.options.taskId,
            infoType: "DOCUMENT_REVIEWER"
        }).then(response => {
            const reviewer = viewModel.uow.fromServerResponse(response)[0];
            this.reviewerEmployeePositionId = reviewer.id;
            this.registerCommissionsList();
            return super.onSetViewModel(viewModel) as any;
        });
    }

    /**
     * @inheritDoc
     */
    protected _setViewModelComplete(viewModel: IncomingDocument): void {
        this.commissionsList().setViewModel(viewModel);
        super._setViewModelComplete(viewModel);
    }

    /**
     * Возвращает part списка поручений.
     */
    public commissionsList(): Part {
        return this.getChild(IncomingDocumentTaskReviewPart.COMMISSIONS_LIST_CHILD_NAME) as Part;
    }

    /**
     * Регистрирует part списка поручений.
     */
    protected registerCommissionsList(): void {
        if (this.commissionsList()) {
            return;
        }
        const part = this.app.createPart("IncomingDocumentCommissionsList", {
            title: "",
            authorId: this.reviewerEmployeePositionId
        });
        this.registerChild(part, {
            name: IncomingDocumentTaskReviewPart.COMMISSIONS_LIST_CHILD_NAME,
            keepOnUnload: true,
            trackStatus: true
        });
    }

    protected onPageStarted(args): void {
        this.addTaskAffix();
        this.addTaskAffixBottom();
        super.onPageStarted(args);
    }

    /**
     * Задаём поведение и добавляем в affixManager элемент #task-affix - основные реквизиты и поручения.
     */
    private addTaskAffix(): void {
        const taskAffixBehavior: StuckBehavior = {
            shouldAttach: (item, viewport) => {
                if ($(IncomingDocumentTaskReviewPart.CMF_DOCUMENT_HIDE_SELECTOR).css("display") == "none"
                    || $(IncomingDocumentTaskReviewPart.CMF_TASK_HIDE_SELECTOR).css("display") == "none") {
                    return false;
                }
            },
            reflow: (item) => {
                let targetHeight = this.fitTaskAffixToViewport(item);
                if (item.$placeholder) {
                    item.$placeholder.height(targetHeight);
                }
            },
            detach: (item) => {
                item.$element.css("overflow-y", "");
                item.$element.css("height", "");
                item.$element.css("width", "");
                item.$element.css("padding", "");
                item.$element.css("margin", "");
            }
        };
        this.app.affixManager.addElement({
            element: $(this.domElement).find(IncomingDocumentTaskReviewPart.TASK_AFFIX_SELECTOR),
            affixTo: "top",
            resizable: true,
            stuckBehaviors: ["default", taskAffixBehavior, "preserveWidth"]
        });
    }

    /**
     * Задаём поведение и добавляем в affixManager элемент #task-affix-bottom,
     * он нужен для управления scrollbar'ом task-affix'а в случае, если #task-affix откреплен.
     */
    private addTaskAffixBottom(): void {
        let affixitem: AffixItemImpl = (this.app.affixManager as any)._items.top.items.find(function (obj) {
            return obj.$element.selector == IncomingDocumentTaskReviewPart.TASK_AFFIX_SELECTOR;
        }) as AffixItemImpl;
        const taskAffixBottomBehavior: StuckBehavior = {
            shouldAttach: (item, viewport) => {
                if ($(IncomingDocumentTaskReviewPart.CMF_DOCUMENT_HIDE_SELECTOR).css("display") == "none"
                    || $(IncomingDocumentTaskReviewPart.CMF_TASK_HIDE_SELECTOR).css("display") == "none") {
                    return false;
                }
            },
            reflow: (item) => {
                this.fitTaskAffixToViewport(affixitem);
            },
            detach: (item) => {
                affixitem.$element.css("height", "");
                affixitem.$element.css("padding", "");
                affixitem.$element.css("overflow-y", "");
            }
        };
        this.app.affixManager.addElement({
            element: $(this.domElement).find(IncomingDocumentTaskReviewPart.TASK_AFFIX_BOTTOM_SELECTOR),
            affixTo: "bottom",
            stuckBehaviors: ["default", "preserveWidth", taskAffixBottomBehavior]
        });
    }

    /**
     * Устанавливает высоту компонента #task-affix, чтобы он занимал
     * все свободное пространоство окна, между, прикрепленными через affix, элементами.
     * Добавляет или убирает scrollbar в зависимости от новой высоты и вызывает пересчет ширины таблицы с поручениями.
     */
    private fitTaskAffixToViewport(affixitem: AffixItem): number {
        let targetHeight = heightCalculator.recalcHeight(affixitem.$element, $(this.taskAffixParentSelector), []);
        if (heightCalculator.getRealHeight(affixitem.$element) > targetHeight) {
            this.addScrollIfNotPresent(affixitem);
        } else {
            if (affixitem.$element.css("overflow-y") == "scroll") {
                affixitem.$element.css("overflow-y", "visible");
                affixitem.$element.css("padding", "");
                this.rerenderChildren();
            }
        }
        return targetHeight;
    };

    /**
     * Добавляет scrollbar, учитывает изменения в ширине элемента и вызывает пересчет ширины таблицы с поручениями.
     */
    private addScrollIfNotPresent(item: AffixItem): void {
        if (item.$element.css("overflow-y") != "scroll") {
            //измерим ширину элемента до добавления скролла, затем после добавления, чтобы
            //знать на сколько скомпенсировать сдвиг
            let widthBeforeScroll = item.$element.get(0).scrollWidth;
            item.$element.css("overflow-y", "scroll");
            let scrollbarWidth = widthBeforeScroll - item.$element.get(0).scrollWidth;
            item.$element.css("padding", "0px " + scrollbarWidth + "px");
            this.rerenderChildren();
        }
    };

    /**
     * При необходимости, перерисуем дочерние компоненты.
     */
    protected rerenderChildren(): void {
        (this as any)._children.forEach((child) => {
            if (child.part.rerenderChild) {
                child.part.rerenderChild();
            }
        });
    }

    /**
     * Инициализация селектора dom-элемента, который определяет границы task-affix'а.
     * @param {EditorPage} mainTabPage Страница редактора с основными реквизитами.
     */
    protected initializeTaskAffixParentSelector(mainTabPage: EditorPage): void {
        this.taskAffixParentSelector = "[data-part-name='" + (this.presenter.constructor || this.name)
            + "'] [data-page='" + mainTabPage.name + "'][data-part-name='" +
            (mainTabPage.presenter.constructor || mainTabPage.name) + "']";
    }
}

interface IncomingDocumentTaskReviewPart extends TaskPartMixin {
};

TaskPartMixin.mixinTo(IncomingDocumentTaskReviewPart, "inherited");

namespace IncomingDocumentTaskReviewPart {

    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DocumentObjectEditor.Options, TaskPartMixin.Options {
        /**
         * Форматтер для вывода ресурсов в шаблоне.
         */
        resourcesFormatter?: (value: any) => string;

        /**
         * Параметры страниц редактора.
         */
        pages?: EditorPageEx.Options[];
    }
}

export = IncomingDocumentTaskReviewPart;

core.createModule(function (app) {
    app.registerPart(IncomingDocumentTaskReviewPart.PART_NAME, function (options) {
        return new IncomingDocumentTaskReviewPart(options);
    })
});




