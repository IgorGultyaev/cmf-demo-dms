/**
 * Журнал входящих документов
 */
import core = require( "core" );
import ObjectList = require("lib/ui/list/ObjectList");
import resources = require("i18n!app/nls/resources");
import domainResources = require("i18n!app/domain/nls/resources");
import BookmarkablePartMixin = require("dms/modules/bookmarks/BookmarkablePartMixin");
import ObjectFilter = require("lib/ui/editor/ObjectFilter");
import CounterWidgetDataSourceRegistry = require("cmf/modules/dashboard/counter/CounterWidgetDataSourceRegistry");
import GroupedVerticalBarWidgetDataSourceRegistry = require("cmf/modules/dashboard/groupedverticalbar/GroupedVerticalBarWidgetDataSourceRegistry");
import {columns} from "app/ui/document/incoming/journal/IncomingDocumentJournalColumns";
import {AbstractDocument, IncomingDocument} from "app/domain/model-ext";

core.createModule(function (app) {

    var files = (<any>core.Application.current).files;

    app.registerPart("IncomingDocumentJournal", function (options) {
        options = BookmarkablePartMixin.mixJournalOptions(options);
        const result: any = new ObjectList(app, core.lang.extend({
            dataSource: new core.data.DataSource(app, {
                name: "document/incoming/journal",
                supportQuery: false,
                preloads: ["status", "attachment", "addressees"]
            }),
            title: resources["part.incomingDocumentJournal"],
            filter: "ObjectFilter:IncomingDocumentJournalFilter",
            entityType: "IncomingDocument",
            autoLoad: true,
            columns,
            commands: {
                ShowAttachment: core.createCommand({
                    execute: function (params) {
                        var primaryItem = params.object.attachment().all().find(function (item) {
                            return item.primary();
                        });
                        if (primaryItem) {
                            var url = files.getBinaryPropLoadUrl(primaryItem, "content", {});
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
            },
        }, options));

        result.getRestrictions = function () {
            return this.getFilterRestrictions();
        };

        result.setRestrictions = function (restriction?: any) {
            (this.filter as ObjectFilter).applyRestrictions(restriction);
        };

        return result;

    });

    CounterWidgetDataSourceRegistry.counterWidgetDataSourceRegistry.register({
        dataSource: "document/incoming/journal",
        partName: "IncomingDocumentJournal",
        displayedName: resources["part.incomingDocumentJournal"],
    });

    GroupedVerticalBarWidgetDataSourceRegistry.groupedVerticalBarWidgetDataSourceRegistry.register({
        dataSource: "document/incoming/journal_grouping_by",
        partName: "IncomingDocumentJournal",
        displayedName: resources["part.incomingDocumentJournal"],
        groupBy: [{
            property: IncomingDocument.NAMES.incomingDate,
            formattedName: domainResources[`model.${IncomingDocument.meta.name}.${IncomingDocument.NAMES.incomingDate}`],
            vt: "date",
        }, {
            property: IncomingDocument.NAMES.correspondentExternal,
            formattedName: domainResources[`model.${IncomingDocument.meta.name}.${IncomingDocument.NAMES.correspondentExternal}`],
        }, {
            property: IncomingDocument.NAMES.registrator,
            formattedName: domainResources[`model.${IncomingDocument.meta.name}.${IncomingDocument.NAMES.registrator}`],
        }, {
            property: IncomingDocument.NAMES.reviewDeadlineDate,
            formattedName: domainResources[`model.${IncomingDocument.meta.name}.${IncomingDocument.NAMES.reviewDeadlineDate}`],
            vt: "date",
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
});

