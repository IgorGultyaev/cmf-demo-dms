import core = require( "core" );
import IncomingDocumentObjectEditor = require( "app/ui/document/incoming/IncomingDocumentObjectEditor" );
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import TaskPartMixin = require( "dms/modules/task/TaskPartMixin" );

import { IncomingDocument } from "app/domain/model-ext";

import Options = IncomingDocumentTaskEditor.Options;

/**
 * Базовый класс карточек задач входящего документа.
 * 
 * @author Dmitry Malenok
 */
class IncomingDocumentTaskEditor extends IncomingDocumentObjectEditor implements TaskPartMixin {

    /**
     * Параметры компонента.
     * 
     * Переопределено для расширения.
     */
    options: Options;

    /**
     * Тип модели.
     */
    viewModel: IncomingDocument;

    /**
     * Конструктор.
     * 
     * @param options параметры компонента
     */
    constructor( options?: Options ) {
        super( IncomingDocumentTaskEditor.mixOptions( options,
            IncomingDocumentTaskEditor.DEFAULT_OPTIONS ) );
    }
}

interface IncomingDocumentTaskEditor extends TaskPartMixin { };

TaskPartMixin.mixinTo( IncomingDocumentObjectEditor, "inherited" );

namespace IncomingDocumentTaskEditor {

    /**
     * Параметры компонента по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {

    }

    /**
     * Интерфейс параметров компонента. 
     */
    export interface Options extends IncomingDocumentObjectEditor.Options, TaskPartMixin.Options {

        /**
         * Параметры страниц редактора. 
         */
        pages?: EditorPageEx.Options[];
    }
}


export = IncomingDocumentTaskEditor;