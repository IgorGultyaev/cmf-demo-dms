import ObjectSelector = require("lib/ui/list/ObjectSelector");
import core = require("core");
import {IncomingDocument} from "app/domain/model-ext";
import {Application} from "core";
import {columns} from "app/ui/document/incoming/journal/IncomingDocumentJournalColumns";

/**
 * Селектор для выбора входящего документа из журнала.
 */
class IncomingDocumentSelector extends ObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:IncomingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: IncomingDocumentSelector.Options = {
        filter: "ObjectFilter:IncomingDocumentJournalFilter",
        entityType: IncomingDocument.meta.name,
        autoLoad: true,
        columns,
    };

    /**
     * @constructs
     * @param {Application} app Текущий экземпляр приложения.
     * @param {IncomingDocumentSelector.Options} options Опции компонента.
     */
    constructor(app: Application, options?: IncomingDocumentSelector.Options) {
        options = options || {};
        options.dataSource = options.dataSource || new core.data.DataSource(app, {
            name: "document/incoming/journal",
            supportQuery: false,
            preloads: ["status", "attachment", "addressees"]
        });

        super(app, IncomingDocumentSelector.mixOptions(options, IncomingDocumentSelector.DEFAULT_OPTIONS));
    }
}

namespace IncomingDocumentSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectSelector.Options {

    }

}

core.createModule((app: Application) => {
    app.registerPart(IncomingDocumentSelector.PART_NAME, (options?: IncomingDocumentSelector.Options) => {
        return new IncomingDocumentSelector(app, options);
    });
});

export = IncomingDocumentSelector;
