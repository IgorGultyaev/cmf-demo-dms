import core = require("core");
import resources = require("i18n!app/nls/resources");
import documentApprovalTab = require("xhtmpl!app/ui/templates/documentApprovalTab.hbs");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import outgoingDocumentCommon = require("xhtmpl!app/ui/templates/outgoingDocumentCommon.hbs");
import peOutgoingAddressee = require("app/ui/document/outgoing/peOutgoingAddressee");
import ApprovalHistoryList = require("dms/modules/document/approval/ApprovalHistoryList");
import commentsTabTemplate = require("xhtmpl!app/ui/document/outgoing/templates/CommentsTab.hbs");
import DocumentCommentsComponent = require("dms/modules/document/comment/DocumentCommentsComponent");
import RegCardObjectViewer = require("dms/modules/document/regCard/RegCardObjectViewer");
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");
import OutgoingDocumentEditor = require("app/ui/document/outgoing/OutgoingDocumentEditor");
import dmsResources = require("i18n!dms/modules/document/nls/resources");
import {Application} from "core";
import {OutgoingDocument} from "app/domain/model-ext";

/**
 * Парт для просмотра сущностей OutgoingDocument.
 */
class OutgoingDocumentObjectViewer extends RegCardObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentObjectViewer.Options = {
        noTitleRef: true,
        editable: false,
        menuButtonFormatter: function (): string {
            return dmsResources["menu.collapsed.title"];
        },
        titleFormatter: OutgoingDocumentEditor.DEFAULT_OPTIONS.titleFormatter,
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                template: outgoingDocumentCommon,
                properties: [
                    {name: "identifier", readOnly: true},
                    {name: "creationDate", readOnly: true},
                    {name: "documentKind", navigable: false},
                    {name: "regNumber", hideLetterCounter: true},
                    {name: "regDate", descr: resources["common.date.from"]},
                    {name: "organization", navigable: false},
                    "summary",
                    {name: "author", navigable: false, readOnly: true},
                    {name: "performer", navigable: false},
                    {name: "registrator", navigable: false},
                    {name: "paper", presentation: "checkbox"},
                    "permission",
                    {name: "status", navigable: false, readOnly: true},
                    "sheetsAmount",
                    "annexSheetsAmount",
                    {name: "signatory", navigable: false},
                    {name: "urgent", presentation: "checkbox"},
                    {name: "addressees", PropertyEditor: peOutgoingAddressee},
                    {name: "nomenclatureCase"},
                ]
            }, {
                name: "attachment",
                title: resources["part.document.pages.attachment"],
                template: documentAttachmentsTab
            }, {
                name: "approval",
                title: resources["part.document.pages.approval"],
                template: documentApprovalTab
            }, {
                name: "comments",
                title: resources["part.document.pages.comments"],
                template: commentsTabTemplate
            }, {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab
            }],
        onSetViewModel: function (viewModel) {
            return viewModel.load({preloads: ["organization", "author", "performer", "signatory", "registrator"]});
        },
        onPageCreated: function (this: OutgoingDocumentObjectViewer, editor, args) {
            if (args.page.name == "attachment") {
                (args.page as any).attachmentsComponent = core.createPart("ObjectList:DocumentAttachment", {
                    documentId: this.viewModel.id,
                    uow: this.viewModel.uow,
                    checkout: true,
                    autoLoad: true,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar" // по умолчанию "x-menu-bar x-menu–contrast", нам не нужен contrast
                    }
                });
            }
            if (args.page.name == "approval") {
                (args.page as any).queueComponent = core.createPart(ApprovalHistoryList.PART_NAME, {
                    documentId: this.viewModel.id,
                    uow: core.Application.current.createUnitOfWork(),
                    pageContext: args.page
                });
                this.registerChild((args.page as any).queueComponent, {keepOnUnload: true, trackStatus: true});
            }

            if (args.page.name === "comments") {
                (args.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: this.viewModel
                });
            }

            if (args.page.name == "relations") {
                (args.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.viewModel.uow,
                    source: this.viewModel,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                    readOnly: true
                });
                
                args.page.registerChild((args.page as any).documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
            }

            for (let key in args.page.editors) {
                if (Object.prototype.hasOwnProperty.call(args.page.editors, key)) {
                    if (editor.viewModel.meta.props[key].nullable == true) {
                        args.page.editors[key]["_autoValidate"] = false;
                        args.page.editors[key].options.autoValidate = false;
                    }
                }
            }
        },
        onPageStarted: function (part, page) {
            if (page.page.name == "attachment" || page.page.name == "approval") {
                $(".top-menu").first().css("display", "none");
            } else {
                $(".top-menu").first().css("display", "table");
            }
        },
        onPageSwitching: function (editor, args) {
            if (args.pageTo && args.pageTo.name == "approval") {
                $(".top-menu").first().css("display", "none");
            } else {
                $(".top-menu").first().css("display", "table");
            }
        }
    };

    /**
     * Опции парта.
     */
    options: OutgoingDocumentObjectViewer.Options;

    /**
     * Модель парта.
     */
    viewModel: OutgoingDocument;

    /**
     * @constructor
     * @param {OutgoingDocumentObjectViewer.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentObjectViewer.Options) {
        super(OutgoingDocumentObjectViewer.mixOptions(options, OutgoingDocumentObjectViewer.DEFAULT_OPTIONS));
    }
}

namespace OutgoingDocumentObjectViewer {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends RegCardObjectViewer.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentObjectViewer.PART_NAME, (options?: OutgoingDocumentObjectViewer.Options) => {
        return new OutgoingDocumentObjectViewer(options);
    });
});

export = OutgoingDocumentObjectViewer;