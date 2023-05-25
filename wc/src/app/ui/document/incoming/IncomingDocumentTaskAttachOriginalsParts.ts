/**
 * Карточка задачи на прикрепление подлинника.
 */
import core = require( "core" );
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import * as taskResources from "i18n!dms/modules/task/nls/resources";
import IncomingDocumentTaskEditor = require( "app/ui/document/incoming/IncomingDocumentTaskEditor" );
import commentsTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/CommentsTab.hbs");
import mainTabTemplate = require("xhtmpl!app/ui/document/incoming/templates/AttachOriginalsTask.hbs");
import resources = require( "i18n!app/nls/resources" );
import peDocumentAttachment = require("app/ui/peDocumentAttachment");
import DocumentCommentsComponent = require("dms/modules/document/comment/DocumentCommentsComponent");
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");

core.createModule(function (app) {

    app.registerPart("TaskPart:TaskType_Document_Attach_Original:IncomingDocument", function (options) {
        const result = new IncomingDocumentTaskEditor(core.lang.extend({
            subtitle: resources["part.task.attachOriginals"],
            leftMenu: {
                update: [{
                    name: "CompleteTask",
                    title: taskResources["part.task.complete"],
                    icon: "redo"
                }]
            },
            pages: [{
                name: "main",
                title: resources["part.document.pages.main"],
                cssColumnPrefix: "col-sm-",
                template: mainTabTemplate,
                properties: [
                    {name: "referenceNumber", readOnly: true},
                    {name: "incomingDate", readOnly: true},
                    {name: "identifier", readOnly: true},
                    {name: "organization", readOnly: true},
                    {name: "sheetsAmount"},
                    {name: "annexSheetsAmount"},
                    {name: "permission", readOnly: true},
                    {name: "summary", useNotNullStyle: true},
                    {name: "nomenclatureCase"},
                    {
                        name: "attachment",
                        PropertyEditor: peDocumentAttachment,
                        checkout: true,
                        useTitledListLayout: true
                    }
                ]
            }, {
                name: "comments",
                title: resources["part.document.pages.comments"],
                properties: [],
                template: commentsTabTemplate,
                hideTopMenu: true
            }, {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab,
                resources: {
                    title: resources["part.document.pages.relatedDocuments"],
                },
                hideTopMenu: true
            }],
            onPageCreated: function (this: IncomingDocumentTaskEditor, editor: IncomingDocumentTaskEditor,
                                     args: ObjectEditor.PageCreatedEventArgs) {
                switch (args.page.name) {
                    case "comments":
                        (args.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                            viewModel: this.viewModel
                        });

                        args.page.registerChild((args.page as any).documentCommentsComponent, {
                            keepOnUnload: true,
                            trackStatus: true
                        });
                        break;

                    case "relations":
                        (args.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                            uow: this.viewModel.uow,
                            source: this.viewModel,
                            presenterOptions: {
                                menuRowCssClass: "x-menu-bar",
                            },
                        });
                        args.page.registerChild((args.page as any).documentRelationsPart, {
                            keepOnUnload: true,
                            trackStatus: true
                        });
                        break;
                }
            }

        }, options));

        return result;
    });

});