import core = require( "core" );
import EditorPageEx = require("app/ui/editor/EditorPageEx");
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import DocumentObjectEditor = require("app/ui/editor/DocumentObjectEditor");
import resources = require("i18n!app/nls/resources");
import {OutgoingDocument} from "app/domain/model-classes";

/**
 * Базовый класс для партов по процессу исходящего документа.
 * </p>
 * Содержит функционал команд для работы с вкладками и настройки презентера.
 */
class OutgoingDocumentEditor extends DocumentObjectEditor{
    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentEditor.Options = {
        titleFormatter: function (args: any): string {
            return OutgoingDocumentEditor.formatTitle(args.viewModel);
        }
    };

    /**
     * Форматирование заголовка карточки исходящего документа.
     * @param {OutgoingDocument} document Исходящий документ.
     * @returns {string} Заголовок.
     */
    static formatTitle(document: OutgoingDocument): string {
        const isRegistered = document.regNumber() != null;
        const nr = isRegistered ?
            document.regNumber().toString() : document.identifier().toString();
        const date = document.regDate() != null ?
            document.regDate().toLocaleDateString() : document.creationDate().toLocaleDateString();
        const title = isRegistered ?
            resources["part.task.outgoingDocument"] : resources["part.task.outgoingDocumentProject"];

        return core.lang.stringFormat(resources["part.document.title"], nr, date, title);
    }

    /**
     * Переопределение типа опций компонента.
     */
    options: OutgoingDocumentEditor.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: OutgoingDocumentEditor.Options) {
        const _options: OutgoingDocumentEditor.Options = OutgoingDocumentEditor.mixOptions(options, OutgoingDocumentEditor.DEFAULT_OPTIONS);
        super(_options);
    }
}

namespace OutgoingDocumentEditor {
    /**
     * Интерфейс опций редактора.
     */
    export interface Options extends DocumentObjectEditor.Options {
        /**
         * Опции основной страницы редактора.
         */
        mainPageOptions?: EditorPageEx.Options;

        /**
         * Опции страницы редактора вложений.
         */
        attachmentPageOptions?: EditorPageEx.Options;

        /**
         * Опрции страницы редактора маршрута согласования.
         */
        approvalPageOptions?: EditorPageEx.Options;

        /**
         * Опрции страницы с комментариями.
         */
        commentsPageOptions?: EditorPageEx.Options;

        /**
         * Опрции страницы со связями документа.
         */
        relationsPageOptions?: EditorPageEx.Options;

        /**
         * @inheritDoc
         */
        titleFormatter?: (editor: any) => string;
    }
}

export = OutgoingDocumentEditor;