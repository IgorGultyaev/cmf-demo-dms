import TaskPartMixin = require( "dms/modules/task/TaskPartMixin" );
import ObjectEditor = require( "lib/ui/editor/ObjectEditor" );
import core = require( "core" );
import Menu = require( "lib/ui/menu/Menu" );
import resources = require( "i18n!app/nls/resources" );
import ObjectList = require( "lib/ui/list/ObjectList" );
import warrantTaskEditorTemplate = require( "xhtmpl!app/ui/document/warrant/templates/warrantTaskEditor.hbs" );
import warrantTaskCreateMainTab = require( "xhtmpl!app/ui/document/warrant/templates/warrantTaskCreateMainTab.hbs" );
import peDocumentAttachment = require( "app/ui/peDocumentAttachment" );
import documentApprovalTab = require( "xhtmpl!app/ui/document/warrant/templates/warrantApprovalTab.hbs" );
import ApprovalITerationEditor = require( "dms/modules/document/approval/ApprovalIterationEditor" );
import lang = core.lang;
import Promisable = lang.Promisable;
import { Map } from "lib/core.lang";
import { IDomainObject } from "lib/domain/.domain";
import { ICommand } from "lib/core.commands";
import { FinishCommandArgs, PageCreatedEventArgs } from "lib/ui/editor/ObjectEditor";
import { IPart } from "lib/ui/.ui";

import Model = ObjectEditor.Model;
import {LoadResponse} from "lib/interop/.interop";
import {AbstractDocument, ApprovalIteration, ApprovalIterationState, WarrantDocument} from "app/domain/model-ext";
import DataSource = require("lib/data/DataSource");

/**
 * Класс карточки задачи по доаверенности.
 */
class WarrantTaskEditor extends ObjectEditor implements TaskPartMixin {
    viewModel: IDomainObject;
    options: WarrantTaskEditor.Options;
    leftMenu: Menu;
    queueComponent: IPart;

    /**
     * Итерация согласования в состоянии "планирования".
     */
    private plannedApprovalIteration: ApprovalIteration;

    /**
     * Конструктор.
     *
     * @param options параметры карточки
     */
    constructor( options: WarrantTaskEditor.Options ) {
        WarrantTaskEditor.mixOptions( options, WarrantTaskEditor.DEFAULT_OPTIONS );
        super( options );
    }

    /**
     * @inheritDoc
     */
    protected onSetViewModel( viewModel: Model ): Promisable<Model> {
        return this.assignTaskViewItem( viewModel.uow )
            .then( () => super.onSetViewModel( viewModel ) )
            .then((viewModel: WarrantDocument) => {
                    return this.loadPlannedApprovalIteration(viewModel).then((iteration) => {
                        this.plannedApprovalIteration = iteration;
                        return viewModel;
                    });
            });
    }

    /**
     * @inheritDoc
     */
    getState( partOptions?: WarrantTaskEditor.Options ): ObjectEditor.PartState {
        return core.lang.appendEx( super.getState( partOptions ), {
            taskEntityId: ( partOptions && partOptions.task.taskEntityId() ) || this.getTaskEntityId(),
            taskId: ( partOptions && partOptions.task.id ) || this.getTaskId(),
        }, { deep: true } );
    }

    /**
     * Добавляет общие команды работы с карточкой задачи.
     */
    protected createCommands(): Map<ICommand> {
        const result = super.createCommands();
        this.appendTaskPartCommands( result );
        return result;
    }

    /**
     * Сохраняет изменения в редакторе и во вложенном компоненте согласования и закрывает форму.
     *
     * @param args аргументы завершения
     */
    protected doSaveAndClose( args: FinishCommandArgs ): Promisable<void> {
        return this.queueComponent ? ( this.queueComponent as ObjectList ).uow.save().then( () => {
            return super.doSaveAndClose( args );
        } ) : super.doSaveAndClose( args );
    }

    /**
     * Создание объекта страницы.
     * Во сремя создания вкладки "согласование" создает объект компонента согласования и подписания.
     *
     * @param args аргументы завершения
     */
    protected onPageCreated( args: PageCreatedEventArgs ): void {
        var page = args.page;
        if ( page.name == "approval" ) {
            this.queueComponent = core.createPart( ApprovalITerationEditor.PART_NAME, {
                approvalIteration: this.plannedApprovalIteration,
                uow: this.viewModel.uow,
                presenterOptions: {
                    menuRowCssClass: "x-menu-bar",
                    showTitle: false,
                    hideMenu: true,
                }
            });
            ( <any>page ).queueComponent = this.queueComponent;
            this.registerChild( ( <any>page ).queueComponent, { keepOnUnload: true, trackStatus: true } );
        }
    }

    /**
     * Осуществляет загрузку итерации согласования, со статусом "планирование".
     * @param {AbstractDocument} document документ, для которого нужно загрузить итерацию.
     * @return {core.lang.Promise<ApprovalIteration>} промис, который разрешается с загруженной итерацией согласования, в случае успеха.
     */
    protected loadPlannedApprovalIteration(document: AbstractDocument): core.lang.Promise<ApprovalIteration> {
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
}

interface WarrantTaskEditor extends TaskPartMixin {
}

/**
 * "Примешиваение" методов TaskPartMixin в созданный WarrantTaskEditor.
 */
TaskPartMixin.mixinTo( WarrantTaskEditor, "inherited" );

namespace WarrantTaskEditor {

    /**
     * Набор параметров по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        editable: true,
        presenterOptions: {
            template: warrantTaskEditorTemplate,
            tabsPosition: "left"
        },
        type: "WarrantDocument",
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                template: warrantTaskCreateMainTab,
                properties: ["performer", "principal", "registrator", "confidant",
                    "notarizationRequired", "startDate", "period", "sheetsAmount"]
            },
            {
                name: "attachment",
                title: resources["part.document.pages.attachment"],
                properties: [
                    { name: "attachment", PropertyEditor: peDocumentAttachment, checkout: true }
                ]
            }, {
                name: "approval",
                title: resources["part.task.pages.approvalPath"],
                template: documentApprovalTab
            }
        ],
        leftMenu: {
            update: [{
                name: "CompleteTask",
                title: resources["part.task.sendForApproval"]
            }]
        }
    };

    /**
     * Параметры карточки.
     */
    export interface Options extends ObjectEditor.Options, TaskPartMixin.Options {
        editable: boolean;
    }

}

export = WarrantTaskEditor;