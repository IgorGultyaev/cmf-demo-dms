import core = require( "core" );
import ObjectList = require("lib/ui/list/ObjectList");
import modelResources = require("i18n!app/domain/nls/resources");
import Icons = require("dms/modules/icons/Icons");
import resources = require("i18n!app/nls/resources");
import BookmarkablePartMixin = require("dms/modules/bookmarks/BookmarkablePartMixin");

core.createModule(function (app) {

    var files = (<any>core.Application.current).files;

    app.registerPart("WarrantJournal", function (options) {
        options = BookmarkablePartMixin.mixJournalOptions(options);
        const result = new ObjectList(app, core.lang.extend({
            dataSource : new core.data.DataSource(app, {
                name : "document/warrant/journal",
                supportQuery : false,
                preloads : [ "status", "attachment" ]
            }),
            filter : "ObjectFilter:WarrantJournalFilter",
            entityType : "WarrantDocument",
            autoLoad : true,
            columns : [
                {
                    name : "hasAttachment",
                    role : "icon",
                    width : 30,
                    title : core.ui.iconProvider.getIcon(Icons.JournalIcon.ATTACHMENT),
                    toolTip : modelResources["model.AbstractDocument.attachment"],
                    getter : function() {
                        return this.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : null;
                    },
                    formatterHtml : function(colId, col) {
                        var result = "";
                        var icon = core.ui.iconProvider.getIcon(
                            this.attachment().all().length > 0 ? Icons.JournalIcon.ATTACHMENT : "", {});
                        if (icon) {
                            result += "<a href='#' class='x-cmd-link'"
                                + " data-cmd-name='ShowAttachment' tabIndex='-1'>" + icon + "</a>";
                        }
                        return result;
                    }
                }, {
                    name : "regNumber",
                    width : 90,
                    resizable : false
                },{
                    name : "startDate",
                    width : 117,
                    resizable : false
                }, {
                    name : "identifier",
                    width : 105,
                    resizable : false
                }, {
                    name : "status",
                    width : 200,
                    resizable : false
                }
            ],
            commands : {
                ShowAttachment : core.createCommand({
                    execute : function(params) {
                        var primaryItem = params.object.attachment().all().find(function(item) {
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
            menuRow : {
                items : [ {
                    name : "View",
                    title : resources["part.document.list.command.View"],
                    icon : "view",
                    isDefaultAction : true,
                    order : 100
                } ]
            },
        }, options));
        return result;

    });
});

