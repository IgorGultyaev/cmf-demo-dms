import * as core from "core";
import {ICommand} from "lib/core.commands";
import {OutgoingDocument} from "app/domain/model-ext";
import {ApprovalIteration, ApprovalIterationState} from "app/domain/model-classes";
import {LoadResponse} from "lib/interop/.interop";
import OutgoingDocumentEditor = require( "app/ui/document/outgoing/OutgoingDocumentEditor" );
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import ObjectEditor = require( "lib/ui/editor/ObjectEditor" );
import resources = require( "i18n!app/nls/resources" );
import EditorPage = require( "lib/ui/editor/EditorPage" );
import PropertyEditor = require( "lib/ui/pe/PropertyEditor" );
import peOutgoingAddressee = require( "app/ui/document/outgoing/peOutgoingAddressee" );
import createDocumentTask = require( "xhtmpl!app/ui/document/outgoing/templates/createDocumentTask.hbs" );
import documentAttachmentTab = require( "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs" );
import documentApprovalTab = require( "xhtmpl!app/ui/templates/documentApprovalTab.hbs" );
import DocumentAttachmentSharedParams = require( "dms/modules/document/attachment/DocumentAttachmentSharedParams" );
import ApprovalIterationEditor = require( "dms/modules/document/approval/ApprovalIterationEditor" );
import commentsTabTemplate = require( "xhtmpl!app/ui/document/outgoing/templates/CommentsTab.hbs" );
import DocumentCommentsComponent = require( "dms/modules/document/comment/DocumentCommentsComponent" );
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");
import TaskPartMixin = require( "dms/modules/task/TaskPartMixin" );
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import DataSource = require("lib/data/DataSource");

/**
 * Базовый класс редактора партов для создания, доработки, подписания и прикрепления подлиника исходящего документа.
 */
class OutgoingDocumentTaskBaseEditor extends OutgoingDocumentEditor implements TaskPartMixin {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskBaseEditor.Options = {
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-sm-",
            template: createDocumentTask,
            properties: [
                {name: "documentKind"},
                {
                    name: "organization",
                    nullable: true,
                    readOnly: true
                },
                {
                    name: "author",
                    nullable: true,
                    readOnly: true
                },
                "performer",
                {
                    name: "status",
                    readOnly: true,
                    nullable: true
                },
                {
                    name: "registrator",
                    readOnly: true
                },
                {
                    name: "nomenclatureCase",
                },
                {
                    name: "urgent",
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: "paper",
                    presentation: "checkbox",
                    nullable: false,
                    threeStates: false
                },
                {
                    name: "permission",
                    nullable: false
                },
                {
                    name: "summary",
                    nullable: true,
                    useNotNullStyle: true,
                    vt: "text"
                },
                "sheetsAmount",
                "annexSheetsAmount",
                {
                    name: "addressees",
                    PropertyEditor: peOutgoingAddressee,
                    useTitledListLayout: true
                }
            ]
        },
        attachmentPageOptions: {
            name: "attachment",
            title: resources["part.document.pages.attachment"],
            template: documentAttachmentTab,
            resources: {
                title: resources["part.document.pages.attachment"]
            },
            hideTopMenu: true
        },
        approvalPageOptions: {
            name: "approval",
            title: resources["part.task.pages.approvalPath"],
            template: documentApprovalTab,
            resources: {
                title: resources["part.task.pages.approvalPath"]
            }
        },
        commentsPageOptions: {
            name: "comments",
            title: resources["part.document.pages.comments"],
            template: commentsTabTemplate,
            hideTopMenu: true
        },
        relationsPageOptions: {
            name: "relations",
            title: resources["part.document.pages.relatedDocuments"],
            template: documentRelationsTab,
            resources: {
                title: resources["part.document.pages.relatedDocuments"],
            },
            hideTopMenu: true
        },
        editable: true,
        type: OutgoingDocument.meta.name,
        leftMenu: {
            update: [
                {
                    name: "CompleteTask",
                    title: resources["part.task.sendForApproval"],
                    icon: "redo"
                },
                {
                    name: "VoidTask",
                    title: resources["part.task.voidTask"],
                    icon: "stop"
                }
            ]
        },
        onSetViewModel: function (this: OutgoingDocumentTaskBaseEditor) {
            return (this as any)._ownUow.load(OutgoingDocument.meta.name, this.getTaskEntityId(), {
                preloads: [
                    OutgoingDocument.meta.props.author.name,
                    OutgoingDocument.meta.props.performer.name,
                    OutgoingDocument.meta.props.registrator.name,
                    OutgoingDocument.meta.props.documentType.name
                ]
            });
        },
        blockingSave: true
    };

    /**
     * Переопределение типа опций компонента.
     */
    options: OutgoingDocumentTaskBaseEditor.Options;

    /**
     * Переопределение типа viewModel.
     */
    viewModel: OutgoingDocument;

    /**
     * Итерация согласования в состоянии "планирования".
     */
    private plannedApprovalIteration: ApprovalIteration;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: OutgoingDocumentTaskBaseEditor.Options) {
        const _options: OutgoingDocumentTaskBaseEditor.Options = OutgoingDocumentTaskBaseEditor.mixOptions(options, OutgoingDocumentTaskBaseEditor.DEFAULT_OPTIONS);
        //Страницы редактора задаются либо целиком либо могу быть собраны из 3 частей.
        //В дочерних партах можно переопределить одну или несколько этих частей, либо в super передавать полностбю свой
        // массив pages. Это позволяет переопределять опции только некоторых страниц, т.к. mixOptions не сливает
        // массивы.
        _options.pages = _options.pages || [
            _options.mainPageOptions,
            _options.attachmentPageOptions,
            _options.approvalPageOptions,
            _options.commentsPageOptions,
            _options.relationsPageOptions,
        ].filter(opts => !!opts);
        super(_options);
    }

    /**
     * Обработчик события создания основной страницы редактора.
     * @param {EditorPage} page Созданная страница редактора с основыми редакторами полей задачи.
     */
    protected onMainPageCreated(page: EditorPage): void {
        // Ничего не делаем.
    };

    /**
     * Обработчик события создания страницы редактора с вложениями.
     * @param {EditorPage} page Созданная страница редактора для работы с вложениями.
     */
    protected onAttachmentPageCreated(page: EditorPage): void {
        //TODO сделать attachmentsComponent по другому, возможно через дочерний парт.
        (page as any).attachmentsComponent = core.createPart("ObjectList:DocumentAttachment", {
            documentId: this.viewModel.id,
            uow: this.viewModel.uow,
            checkout: true,
            autoLoad: true,
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
     * Обработчик события создания страницы редактора с очередью согласования.
     * @param {EditorPage} page Созданная страница редактора для работы с очередью согласования.
     */
    protected onApprovalPageCreated(page: EditorPage): void {
        //TODO сделать queueComponent по другому, возможно через дочерний парт.
        (page as any).queueComponent = core.createPart(ApprovalIterationEditor.PART_NAME, {
            approvalIteration: this.plannedApprovalIteration,
            uow: this.viewModel.uow,
            presenterOptions: {
                menuRowCssClass: "x-menu-bar",
                showTitle: false,
                hideMenu: true,
            }
        });
        this.registerChild((page as any).queueComponent, {
            keepOnUnload: true,
            trackStatus: true
        });
    }

    /**
     * Обработчик события создания страницы редактора с комментариями.
     * @param {EditorPage} page Созданная страница редактора для работы с очередью согласования.
     */
    protected onCommentsPageCreated(page: EditorPage): void {
        (page as any).documentCommentsComponent = new DocumentCommentsComponent({
            viewModel: page.editor.viewModel
        });
        this.registerChild((page as any).documentCommentsComponent, {
            keepOnUnload: true,
            trackStatus: true
        });
    }

    /**
     * Обработчик события создания страницы редактора со связями документа.
     *
     * @param {EditorPage} page Созданная страница редактора для работы со связями документа.
     */
    protected onRelationsPageCreated(page: EditorPage): void {
        (page as any).documentRelationsPart = new DocumentRelationList(this.app, {
            uow: this.viewModel.uow,
            source: this.viewModel,
            presenterOptions: {
                menuRowCssClass: "x-menu-bar",
            }
        });

        this.registerChild((page as any).documentRelationsPart, {
            keepOnUnload: true,
            trackStatus: true
        });

        if (this.currentPage() === page) {
            this.rerender();
        }
    }

    /**
     * @inheritDoc
     * @param {ObjectEditor.PageCreatedEventArgs} args
     */
    protected onPageCreated(args: ObjectEditor.PageCreatedEventArgs): void {
        super.onPageCreated(args);

        switch (args.page.name) {
            case "main":
                this.onMainPageCreated(args.page);
                break;

            case "attachment":
                this.onAttachmentPageCreated(args.page);
                break;

            case "approval":
                this.onApprovalPageCreated(args.page);
                break;

            case "comments":
                this.onCommentsPageCreated(args.page);
                break;

            case "relations":
                this.onRelationsPageCreated(args.page);
                break;
        }

        for (let key in args.page.editors) {
            if (Object.prototype.hasOwnProperty.call(args.page.editors, key)) {
                if (this.viewModel.meta.props[key].nullable == true) {
                    args.page.editors[key]["_autoValidate"] = false;
                    args.page.editors[key].options.autoValidate = false;
                }
            }
        }
    }

    /**
     * @inheritDoc
     */
    protected createCommands(): core.lang.Map<ICommand> {
        const commands: core.lang.Map<ICommand> = super.createCommands();

        commands.VoidTask = new core.commands.BoundCommand(this.doVoidTask, this.canVoidTask, this);

        return commands;
    }

    /**
     * @inheritDoc
     */
    protected onPageStarted(args: ObjectEditor.PageEventArgs): void {
        //На странице "Файлы документа", верхнее меню, с кнопками "Сохарнить" и "Отменить" скрываются,
        //т.к. изменения, внесенные в парт с файлами документа, сразу сохраняются.
        /*if ( args.page.name == "attachment" ) {
            $(".top-menu").first().css("display", "none");
        } else {
            $(".top-menu").first().css("display", "table");
        }*/

        super.onPageStarted(args);
    }

    /**
     * Аннулирование задачи.
     */
    protected doVoidTask(): void {
        throw new Error("Not Yet Implemented");
    }

    /**
     * Возможность аннулирования задачи.
     * @return {boolean} <code>true</code> можно выполнить команду, <code>false</code> - нельзя.
     */
    protected canVoidTask(): boolean {
        return false;
    }

    /**
     * Осуществляет загрузку итерации согласования, со статусом "планирование".
     * @param {OutgoingDocument} document документ, для которого нужно загрузить итерацию.
     * @return {core.lang.Promise<ApprovalIteration>} промис, который разрешается с загруженной итерацией согласования, в случае успеха.
     */
    protected loadPlannedApprovalIteration(document: OutgoingDocument): core.lang.Promise<ApprovalIteration> {
        return new DataSource(core.Application.current, {
            entityType: ApprovalIteration.meta.name,
            params: {
                $filter: {
                    document: document.id,
                    state: ApprovalIterationState.PLANNED,
                }
            }
        }).load().then((loadResponse: LoadResponse) => {
            const objects = document.uow.fromServerResponse(loadResponse) as ApprovalIteration[];
            if (objects.length == 1) {
                return objects[0]
            } else {
                return null;
            }
        });
    }

    /**
     * @inheritDoc
     */
    protected onSetViewModel(viewModel: OutgoingDocument): core.lang.Promisable<OutgoingDocument> {
        const document: any = super.onSetViewModel(viewModel);
        if (core.lang.isPromise(document)) {
            return document.then((model) => {
                return this.loadPlannedApprovalIteration(model).then((iteration) => {
                    this.plannedApprovalIteration = iteration;
                    return model;
                });
            });
        }

        return core.lang.resolved().then(() => {
            return this.loadPlannedApprovalIteration(document);
        }).then((iteration) => {
            this.plannedApprovalIteration = iteration;
            return document;
        });
    }
}

interface OutgoingDocumentTaskBaseEditor extends TaskPartMixin {

};

TaskPartMixin.mixinTo(OutgoingDocumentTaskBaseEditor, "inherited");

namespace OutgoingDocumentTaskBaseEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentEditor.Options, TaskPartMixin.Options {
        /**
         * Флаг, управляет возможностью редактировать дочерние парты.
         */
        editable?: boolean;

        /**
         * Параметры страниц редактора.
         */
        pages?: EditorPageEx.Options[];
    }
}

export = OutgoingDocumentTaskBaseEditor;