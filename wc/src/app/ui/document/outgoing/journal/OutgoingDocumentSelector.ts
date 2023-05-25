import OutgoingDocumentJournalObjectFilter = require("app/ui/document/outgoing/journal/OutgoingDocumentJournalObjectFilter");
import ObjectSelector = require("lib/ui/list/ObjectSelector");
import core = require("core");
import {Application} from "core";
import {columns} from "app/ui/document/outgoing/journal/OutgoingDocumentJournalColumns";
import {OutgoingDocument} from "app/domain/model-ext";

/**
 * Селектор для выбора исходящего документа из журнала.
 */
class OutgoingDocumentSelector extends ObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentSelector.Options = {
        entityType: OutgoingDocument.meta.name,
        autoLoad: true,
        columns,
        filter: OutgoingDocumentJournalObjectFilter.PART_NAME,
    };

    /**
     * @constructs
     * @param {Application} app Текущий экземпляр приложения.
     * @param {OutgoingDocumentSelector.Options} options Опции компонента.
     */
    constructor(app: Application, options?: OutgoingDocumentSelector.Options) {
        const _options: OutgoingDocumentSelector.Options = options || {};
        _options.dataSource = _options.dataSource || new core.data.DataSource(app, {
            name: "document/outgoing/journal",
            supportQuery: false,
            preloads: ["status", "attachment", "performer", "signatory", "addressees"]
        });

        super(app, OutgoingDocumentSelector.mixOptions(_options, OutgoingDocumentSelector.DEFAULT_OPTIONS));
    }
}

namespace OutgoingDocumentSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectSelector.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentSelector.PART_NAME, (options?: OutgoingDocumentSelector.Options) => {
        return new OutgoingDocumentSelector(app, options);
    });
});

export = OutgoingDocumentSelector;