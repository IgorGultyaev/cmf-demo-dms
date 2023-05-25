import ObjectList = require("lib/ui/list/ObjectList");
import BookmarkablePartMixin = require("dms/modules/bookmarks/BookmarkablePartMixin");
import resources = require("i18n!app/nls/resources");
import OutgoingDocumentJournalObjectFilter = require("app/ui/document/outgoing/journal/OutgoingDocumentJournalObjectFilter");
import CounterWidgetDataSourceRegistry = require("cmf/modules/dashboard/counter/CounterWidgetDataSourceRegistry");
import ObjectFilter = require("lib/ui/editor/ObjectFilter");
import domainResources = require("i18n!app/domain/nls/resources");
import GroupedVerticalBarWidgetDataSourceRegistry = require("cmf/modules/dashboard/groupedverticalbar/GroupedVerticalBarWidgetDataSourceRegistry");
import * as core from "core";
import {Application} from "core";
import {columns} from "app/ui/document/outgoing/journal/OutgoingDocumentJournalColumns";
import {ListWithRestrictions} from "cmf/modules/dashboard/ListWithRestrictions";
import {AbstractDocument, IncomingDocument, OutgoingDocument} from "app/domain/model-ext";

/**
 * Парт - журнал исходящий документов.
 */
class OutgoingDocumentJournal extends ObjectList implements ListWithRestrictions {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "OutgoingDocumentJournal";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentJournal.Options = {
        title: resources["part.outgoingDocumentJournal"],
        entityType: "OutgoingDocument",
        autoLoad: true,
        columns,
        filter: OutgoingDocumentJournalObjectFilter.PART_NAME,
        commands: {
            ShowAttachment: core.createCommand({
                execute: function (params) {
                    var primaryItem = params.object.attachment().all().find(function (item) {
                        return item.primary();
                    });
                    if (primaryItem) {
                        var url = (core.Application.current as any).files.getBinaryPropLoadUrl(primaryItem, "content", {});
                        window.open(url);
                    } else {
                        // TODO: просто открыть вкладку вложений на карточке
                    }
                }
            })
        },
        menuRow: {
            items: [{
                name: "View",
                title: resources["part.document.list.command.View"],
                icon: "view",
                isDefaultAction: true,
                order: 100
            }]
        }
    };

    /**
     * @constructs
     * @param {Application} app Текущий экземпляр приложения.
     * @param {OutgoingDocumentJournal.Options} options Опции компонента.
     */
    constructor(app: Application, options?: OutgoingDocumentJournal.Options) {
        const _options: OutgoingDocumentJournal.Options = BookmarkablePartMixin.mixJournalOptions(options);
        _options.dataSource = _options.dataSource || new core.data.DataSource(app, {
            name: "document/outgoing/journal",
            supportQuery: false,
            preloads: ["status", "attachment", "performer", "signatory", "addressees"]
        });

        super(app, OutgoingDocumentJournal.mixOptions(_options, OutgoingDocumentJournal.DEFAULT_OPTIONS));
    }

    /**
     * @inheritDoc
     */
    getRestrictions() {
        return this.getFilterRestrictions();
    }

    /**
     * @inheritDoc
     */
    setRestrictions(restriction?: any) {
        (this.filter as ObjectFilter).applyRestrictions(restriction);
    }
}

namespace OutgoingDocumentJournal {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectList.Options, BookmarkablePartMixin.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentJournal.PART_NAME, (options?: OutgoingDocumentJournal.Options) => {
        return new OutgoingDocumentJournal(app, options);
    });
});

export = OutgoingDocumentJournal;

CounterWidgetDataSourceRegistry.counterWidgetDataSourceRegistry.register({
    dataSource: "document/outgoing/journal",
    partName: OutgoingDocumentJournal.PART_NAME,
    displayedName: resources["part.outgoingDocumentJournal"],
});

GroupedVerticalBarWidgetDataSourceRegistry.groupedVerticalBarWidgetDataSourceRegistry.register({
    dataSource: "document/outgoing/journal_grouping_by",
    partName: OutgoingDocumentJournal.PART_NAME,
    displayedName: resources["part.outgoingDocumentJournal"],
    groupBy: [{
        property: OutgoingDocument.NAMES.urgent,
        formattedName: domainResources[`model.${OutgoingDocument.meta.name}.${OutgoingDocument.NAMES.urgent}`],
        vt: "boolean",
    }, {
        property: OutgoingDocument.NAMES.performer,
        formattedName: domainResources[`model.${OutgoingDocument.meta.name}.${OutgoingDocument.NAMES.performer}`],
    }, {
        property: OutgoingDocument.NAMES.registrator,
        formattedName: domainResources[`model.${OutgoingDocument.meta.name}.${OutgoingDocument.NAMES.registrator}`],
    }, {
        property: OutgoingDocument.NAMES.signatory,
        formattedName: domainResources[`model.${OutgoingDocument.meta.name}.${OutgoingDocument.NAMES.signatory}`],
    }, {
        property: AbstractDocument.NAMES.documentKind,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.NAMES.documentKind}`],
    }, {
        property: AbstractDocument.NAMES.regDate,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.NAMES.regDate}`],
        vt: "date",
    }, {
        property: AbstractDocument.NAMES.status,
        formattedName: domainResources[`model.${AbstractDocument.meta.name}.${AbstractDocument.NAMES.status}`],
    }],
});