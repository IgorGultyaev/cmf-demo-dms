import * as core from "core";
import {ICommand} from "lib/core.commands";
import {ContractDocument} from "app/domain/model-ext";
import {ApprovalIteration, ApprovalIterationState} from "app/domain/model-classes";
import {LoadResponse} from "lib/interop/.interop";
import * as  ContractDocumentEditor from "app/ui/document/contract/ContractDocumentEditor";
import * as  EditorPageEx from "app/ui/editor/EditorPageEx";
import * as  ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as  resources from "i18n!app/nls/resources";
import * as  EditorPage from "lib/ui/editor/EditorPage";
import * as  PropertyEditor from "lib/ui/pe/PropertyEditor";
import * as  documentAttachmentTab from "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs";
import * as  documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as  DocumentAttachmentSharedParams from "dms/modules/document/attachment/DocumentAttachmentSharedParams";
import * as  ApprovalIterationEditor from "dms/modules/document/approval/ApprovalIterationEditor";
import * as  contractDocumentCommentsTabTemplate
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCommentsTab.hbs";
import * as  DocumentCommentsComponent from "dms/modules/document/comment/DocumentCommentsComponent";
import * as  DocumentRelationList from "dms/modules/document/relation/DocumentRelationList";
import * as  TaskPartMixin from "dms/modules/task/TaskPartMixin";
import * as  documentRelationsTab from "xhtmpl!app/ui/templates/documentRelationsTab.hbs";
import * as  DataSource from "lib/data/DataSource";


/**
 * Базовый класс редактора партов для создания, доработки, подписания и прикрепления подлиника документа Договор.
 */
class ContractDocumentTaskBaseEditor extends ContractDocumentEditor implements TaskPartMixin {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentTaskBaseEditor.Options = {
        type: ContractDocument.meta.name,
        editable: true,
        blockingSave: true,
        // mainPageOptions должна задаваться в наследниках
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
            template: contractDocumentCommentsTabTemplate,
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
        onSetViewModel: function (this: ContractDocumentTaskBaseEditor) {
            return (this as any)._ownUow.load(ContractDocument.meta.name, this.getTaskEntityId(), {
                preloads: [
                    ContractDocument.meta.props.documentKind.name,
                    ContractDocument.meta.props.documentType.name,
                    ContractDocument.meta.props.createdBasedOn.name,
                    ContractDocument.meta.props.organization.name,
                    ContractDocument.meta.props.author.name,
                    ContractDocument.meta.props.status.name,
                    ContractDocument.meta.props.nomenclatureCase.name,
                    ContractDocument.meta.props.performer.name,
                    ContractDocument.meta.props.registrator.name,
                    ContractDocument.meta.props.signatory.name,
                    ContractDocument.meta.props.currency.name,
                    ContractDocument.meta.props.terminationReason.name,
                    ContractDocument.meta.props.curator.name
                ]
            });
        },
    };

    /**
     * Переопределение типа опций компонента.
     */
    options: ContractDocumentTaskBaseEditor.Options;

    /**
     * Переопределение типа viewModel.
     */
    viewModel: ContractDocument;

    /**
     * Итерация согласования в состоянии "планирования".
     */
    private plannedApprovalIteration: ApprovalIteration;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: ContractDocumentTaskBaseEditor.Options) {
        const _options: ContractDocumentTaskBaseEditor.Options = ContractDocumentTaskBaseEditor.mixOptions(options, ContractDocumentTaskBaseEditor.DEFAULT_OPTIONS);
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

        commands.RevokeDocument = new core.commands.BoundCommand(this.doRevokeDocument, this.canRevokeDocument, this);

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
     * Логика выполнения команды аннулирования документа.
     *
     * @return {core.lang.Promise<void>} промис выполнения аннулирования документа на сервере.
     */
    protected doRevokeDocument(): core.lang.Promise<void> {
        return core.Application.current.dataFacade.ajax({
            url: "/api/document/contract/revoke",
            type: "GET",
            processData: true,
            async: true,
            data: {
                documentId: this.viewModel.id
            }
        }).done(() => {
            return this.navigationService.close({success: true});
        });
    }

    /**
     * Метод для определения возможности выполнения команды аннулирования документа.
     *
     * @return {boolean} <code>true</code> - пользователь может аннулировать документ, иначе - <code>false</code>.
     */
    protected canRevokeDocument(): boolean {
        return this.canCompleteTaskInternal();
    }

    /**
     * Осуществляет загрузку итерации согласования, со статусом "планирование".
     * @param {ContractDocument} document документ, для которого нужно загрузить итерацию.
     * @return {core.lang.Promise<ApprovalIteration>} промис, который разрешается с загруженной итерацией согласования, в случае успеха.
     */
    protected loadPlannedApprovalIteration(document: ContractDocument): core.lang.Promise<ApprovalIteration> {
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
    protected onSetViewModel(viewModel: ContractDocument): core.lang.Promisable<ContractDocument> {
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

interface ContractDocumentTaskBaseEditor extends TaskPartMixin {

}

TaskPartMixin.mixinTo(ContractDocumentTaskBaseEditor, "inherited");

namespace ContractDocumentTaskBaseEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentEditor.Options, TaskPartMixin.Options {
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

export = ContractDocumentTaskBaseEditor;