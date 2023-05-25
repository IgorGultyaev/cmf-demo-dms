import * as core from "core";
import * as EditorPageEx from "app/ui/editor/EditorPageEx";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";
import * as DocumentObjectEditor from "app/ui/editor/DocumentObjectEditor";
import * as resources from "i18n!app/nls/resources";
import {ContractDocument} from "app/domain/model-classes";

/**
 * Базовый класс для партов по процессу документа Договор.
 * </p>
 * Содержит функционал команд для работы с вкладками и настройки презентера.
 */
class ContractDocumentEditor extends DocumentObjectEditor {
    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentEditor.Options = {
        titleFormatter: function (args: any): string {
            return ContractDocumentEditor.formatTitle(args.viewModel);
        }
    };

    /**
     * Форматирование заголовка карточки документа Договор.
     * @param {ContractDocument} document документ Договор.
     * @returns {string} Заголовок.
     */
    static formatTitle(document: ContractDocument): string {
        const isRegistered = document.regNumber() != null;
        const nr = isRegistered ?
            document.regNumber().toString() : document.identifier().toString();
        const date = document.regDate() != null ?
            document.regDate().toLocaleDateString() : document.creationDate().toLocaleDateString();
        const title = isRegistered ?
            resources["part.task.contractDocument"] : resources["part.task.contractDocumentProject"];

        return core.lang.stringFormat(resources["part.document.title"], nr, date, title);
    }

    /**
     * Переопределение типа опций компонента.
     */
    options: ContractDocumentEditor.Options;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: ContractDocumentEditor.Options) {
        const _options: ContractDocumentEditor.Options = ContractDocumentEditor.mixOptions(options, ContractDocumentEditor.DEFAULT_OPTIONS);
        super(_options);
    }
}

namespace ContractDocumentEditor {
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

export = ContractDocumentEditor;