import * as core from "core";
import {ICommand} from "lib/core.commands";
import {AbstractDocument} from "app/domain/model-ext";
import PartCommandMixin = require("lib/ui/PartCommandMixin");
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import RegCardObjectEditor = require("dms/modules/document/regCard/RegCardObjectEditor");
import EditorCommandResult = PartCommandMixin.EditorCommandResult;
import EditorCommandOptions = PartCommandMixin.EditorCommandOptions;

/**
 * Класс для редактора документа по задаче.
 * <p/>
 * При загрузке и сохранении состояния, загружает и сохраняет идентификатор задачи, для которой был открыт редактор документа.
 */
class DocumentObjectEditor extends RegCardObjectEditor {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DocumentObjectEditor.Options = {};

    /**
     * Опции парта.
     */
    options: DocumentObjectEditor.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: DocumentObjectEditor.Options) {
        super(DocumentObjectEditor.mixOptions(options, DocumentObjectEditor.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    protected createCommands(): core.lang.Map<ICommand> {
        return core.lang.extend(super.createCommands(), {
            ViewDocument: core.commands.createBoundCommand(this.doViewDocument, this.canViewDocument, this),
        });

    }

    /**
     * Команда просмотра документа.
     */
    protected doViewDocument(args: EditorCommandOptions): core.lang.Promise<EditorCommandResult> {
        const viewModel = this.getDocumentViewModel();
        return this.executePartCommand({
            part: "ObjectViewer:" + viewModel.meta.name,
            partOptions: {
                viewModel: viewModel
            }
        }, args, "View").closed;
    }


    /**
     * Проверяет возможность вызова команды просмотра документа.
     *
     * @returns true - команду можно вызвать, иначе - false
     */
    protected canViewDocument(): boolean {
        return !!this.getDocumentViewModel();
    }


    /**
     * Возвращает модель документа, соответствующего текущему редактору.
     */
    protected getDocumentViewModel(): AbstractDocument {
        return (this.viewModel instanceof AbstractDocument) ? this.viewModel : (<any>this.viewModel).document();

    }


}

namespace DocumentObjectEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends RegCardObjectEditor.Options {
        pages?: EditorPageEx.Options[];
    }

}


export = DocumentObjectEditor;