import core = require( "core" );
import resources = require( "i18n!app/nls/resources" );
import warrantTaskCreateMainTab = require("xhtmpl!app/ui/document/warrant/templates/warrantTaskCreateMainTab.hbs");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import documentApprovalTab = require("xhtmpl!app/ui/document/warrant/templates/warrantApprovalTab.hbs");
import warrantTaskApproveTemplate = require("xhtmpl!app/ui/document/warrant/templates/warrantTaskApprove.hbs");
import WarrantTaskEditor = require("./WarrantTaskEditor");
import peDocumentAttachment = require("app/ui/peDocumentAttachment");
import {Map} from "lib/core.lang";
import {ICommand} from "lib/core.commands";
import {ApprovalDecision, ApprovalDecisionType} from "app/domain/model-classes";
import {PageCreatedEventArgs} from "lib/ui/editor/ObjectEditor";
import {renditionService, RenditionService} from "cmf/modules/cmfrendition/RenditionService";
import * as ContentViewer from "cmf/modules/contentviewer/ui/ContentViewer";

import RenditionParameters = RenditionService.RenditionParameters;

/**
 * Класс карточки задачи по доверенности на подписание и согласование.
 */
class WarrantTaskApprovalEditor extends WarrantTaskEditor {
    previewComponent: ContentViewer;
    viewModel: ApprovalDecision;

    /**
     * Конструктор.
     *
     * @param options параметры.
     */
    constructor( options?: WarrantTaskApprovalEditor.Options ) {
        super( WarrantTaskEditor.mixOptions( options, WarrantTaskApprovalEditor.DEFAULT_OPTIONS ) );
    }

    /**
     * Установка viewModel редактора.
     * Так как в случае согласования и подписание интересна не сущность документа, а
     * сущность решения по согласованию ApprovalDecision, она подгружается по идентификатору задачи и
     * возвращается в качестве viewModel.
     *
     * @param viewModel viewModel.
     */
    public setViewModel(viewModel): void {
        var that = this;
        //TODO: здесь что-то не так
        var vm = core.Application.current.dataFacade.ajax({
            url: "/api/approval/document/decision/bytask",
            type: "GET",
            processData: true,
            async: true,
            data: {
                taskId: that.getTaskId()
            }
        }, {}).then(function (decision) {
            //также подгружается поле вложения - оно понадобится для отображения в content viewer'e
            return viewModel.uow.load(ApprovalDecision.meta.name, decision.result.id, {preloads: ["document.attachment"]});
        }) as any;
        super.setViewModel(vm);
    }

    /**
     * Создание объекта страницы.
     * Тут создается компонент просмотра вложений.
     *
     * @param args аргументы завершения
     */
    protected onPageCreated(args: PageCreatedEventArgs): void {
        super.onPageCreated(args);
        const page = args.page;

        //фильтруем вложения по признакому "первичный"
        const obj = this.viewModel.approver().queue().iteration().document().attachment().all().filter(function(document) {
            return document.primary();
        })[0];

        //получаем url готового pdf
        const url = obj != null ? renditionService.createRenditionRequestLinkForDomainObject(obj, "application/pdf") : "";

        //создаем компонент просмотра вложения
        this.previewComponent = new ContentViewer({url, sidebarState: "hidden"});

        //регистрируем компонент просмотра вложения как дочерний парт, для корректной очистки ресурсов, при закрытии этого парта.
        this.registerChild(this.previewComponent, {keepOnUnload: true});

        //уставливаем компонент просмотра как поле в объект страницы для того, чтобы отрендерить его в шаблоне
        (<any>page).previewComponent = this.previewComponent;

        if (obj == undefined) {
            //если нет первичного вложения - ошибка
            this.previewComponent.generatorView.generatorPhase(RenditionService.AsyncOperationStatus.FAILED);
        } else {
            //посылаем команду подготовки представления
            renditionService.prepareRenditionForDomainObject(obj, "application/pdf").then((message) => {
                this.previewComponent.renditionReady(true)
            }).fail((message) => {
                this.previewComponent.generatorView.generatorPhase(RenditionService.AsyncOperationStatus.FAILED);
            });
        }
    }

    /**
     * Добавляет общие команды работы с карточкой задачи.
     *
     * @param commands набор команд, куда производится добавление
     */
    protected appendTaskPartCommands( commands: Map<ICommand> ): void {
        ( commands as any ).Approve = ( commands as any ).Approve ||
            new core.commands.BoundCommand( this.doApprove, this.canCompleteTask, this );
        ( commands as any ).Revoke = ( commands as any ).Revoke ||
            new core.commands.BoundCommand( this.doRevoke, this.canCompleteTask, this );
        ( commands as any ).Sign = ( commands as any ).Sign ||
            new core.commands.BoundCommand( this.doSign, this.canCompleteTask, this );
    }

    /**
     * Исполняет команду согласования.
     *
     * @param args аргументы команды
     */
    protected doApprove( args: any ): void {
        this.viewModel.decisionType(ApprovalDecisionType.APPROVED);
        this.doCompleteTaskInternal( args );
    }

    /**
     * Исполняет команду подписания.
     *
     * @param args аргументы команды
     */
    protected doSign( args: any ): void {
        this.viewModel.decisionType(ApprovalDecisionType.SIGNED);
        this.doCompleteTaskInternal( args );
    }

    /**
     * Исполняет команду отклонения.
     *
     * @param args аргументы команды
     */
    protected doRevoke( args: any ): void {
        this.viewModel.decisionType(ApprovalDecisionType.REJECTED);
        this.doCompleteTaskInternal( args );
    }
}

namespace WarrantTaskApprovalEditor {

    /**
     * Набор параметров по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        editable: false,
        task: undefined,
        type: "ApprovalDecision",
        pages: [
            {
                name: "main",
                template: warrantTaskApproveTemplate
            }],
    };

    /**
     * Интерфейс параметров компонента.
     */
    export interface Options extends WarrantTaskEditor.Options {
    }

}

core.createModule(function (app) {
    app.registerPart("TaskPart:TaskType_Document_Approve_Common:WarrantDocument", function (options) {
        const result = new WarrantTaskApprovalEditor(core.lang.extend({
            leftMenu: {
                update: [{
                    name: "Approve",
                    title: resources["part.task.approve"]

                }, {
                    name: "Revoke",
                    title: resources["part.task.decline"]
                }]
            },
        }, options));
        return result;
    });

    app.registerPart("TaskPart:TaskType_Document_Sign_Common:WarrantDocument", function (options) {
        const result = new WarrantTaskApprovalEditor(core.lang.extend({
            leftMenu: {
                update: [{
                    name: "Sign",
                    title: resources["part.task.sign"]
                }, {
                    name: "Revoke",
                    title: resources["part.task.decline"]
                }]
            },
        }, options));
        return result;
    })
});