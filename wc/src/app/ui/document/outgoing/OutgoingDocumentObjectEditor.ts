import * as core from "core";
import {Application} from "core";
import {OutgoingDocument} from "app/domain/model-classes";
import OutgoingDocumentEditor = require("app/ui/document/outgoing/OutgoingDocumentEditor");
import resources = require("i18n!app/nls/resources");
import outgoingDocumentCommon = require("xhtmpl!app/ui/templates/outgoingDocumentCommon.hbs");
import peOutgoingAddressee = require("app/ui/document/outgoing/peOutgoingAddressee");
import documentAttachmentsTab = require("xhtmpl!app/ui/templates/documentAttachmentsTab.hbs");
import documentApprovalTab = require("xhtmpl!app/ui/templates/documentApprovalTab.hbs");
import documentRelationsTab = require("xhtmpl!app/ui/templates/documentRelationsTab.hbs");
import ApprovalHistoryList = require("dms/modules/document/approval/ApprovalHistoryList");
import DocumentAttachmentList = require("dms/modules/document/attachment/DocumentAttachmentList");
import DocumentRelationList = require("dms/modules/document/relation/DocumentRelationList");

/**
 * Редактор для сущности OutgoingDocument.
 */
class OutgoingDocumentObjectEditor extends OutgoingDocumentEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentObjectEditor.Options = {
        isIsolated: true,
        onQueryUnload: function (options) {
            var that = this, args = {
                editor: that,
                preventingReason: undefined
            };
            that.trigger(that.events.QUERY_UNLOAD, that, args);
            if (args.preventingReason) {
                return args.preventingReason;
            }
            if (that.viewModel && that.viewModel.uow && !that.saving()) {
                var changes = that.viewModel.uow.getChanges()
                if (that._hasMeaningfulChanges(changes)) {
                    return that.onQueryUnloadWithChanges(options);
                }
            }

        },
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                template: outgoingDocumentCommon,
                properties: [
                    {
                        name: "identifier",
                        readOnly: true
                    },
                    {
                        name: "creationDate",
                        readOnly: true
                    },
                    {
                        name: "documentKind",
                        navigable: false
                    },
                    {
                        name: "regNumber",
                        hideLetterCounter: true
                    },
                    {
                        name: "regDate",
                        descr: resources["common.date.from"]
                    },
                    {
                        name: "organization",
                        navigable: false
                    },
                    "summary",
                    {
                        name: "author",
                        navigable: false,
                        readOnly: true
                    },
                    {
                        name: "performer",
                        navigable: false
                    },
                    {
                        name: "registrator",
                        navigable: false
                    },
                    {
                        name: "nomenclatureCase",
                    },
                    {
                        name: "paper",
                        presentation: "checkbox"
                    },
                    "permission",
                    {
                        name: "status",
                        navigable: false,
                        readOnly: true
                    },
                    "sheetsAmount",
                    "annexSheetsAmount",
                    {
                        name: "signatory",
                        navigable: false
                    },
                    {
                        name: "urgent",
                        presentation: "checkbox"
                    },
                    {
                        name: "addressees",
                        PropertyEditor: peOutgoingAddressee
                    }
                ]
            },
            {
                name: "attachment",
                title: resources["part.document.pages.attachment"],
                template: documentAttachmentsTab
            },
            {
                name: "approval",
                title: resources["part.document.pages.approval"],
                template: documentApprovalTab
            },
            {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab,
                hideTopMenu: true
            },
        ],
        onPageCreated: function (editor, page) {
            if (page.page.name == "attachment") {
                //TODO нужно организовывать дочерние парты по другому.
                (page.page as any).attachmentsComponent = core.createPart(DocumentAttachmentList.PART_NAME, {
                    documentId: this.viewModel.id,
                    uow: this.viewModel.uow,
                    checkout: true,
                    autoLoad: true
                });
            }
            if (page.page.name == "approval") {
                (page.page as any).queueComponent = core.createPart(ApprovalHistoryList.PART_NAME, {
                    documentId: this.viewModel.id,
                    uow: this.viewModel.uow,
                    pageContext: page.page
                });
                this.registerChild((page.page as any).queueComponent, {
                    keepOnUnload: true,
                    trackStatus: true
                });
            }

            if (page.page.name == "relations") {
                (page.page as any).documentRelationsPart = new DocumentRelationList(this.app, {
                    uow: this.uow,
                    source: this.viewModel,
                    presenterOptions: {
                        menuRowCssClass: "x-menu-bar",
                    },
                });

                page.page.registerChild((page.page as any).documentRelationsPart, {
                    keepOnUnload: true,
                    trackStatus: true
                });
            }
            for (var key in page.page.editors) {
                if (Object.prototype.hasOwnProperty.call(page.page.editors, key)) {
                    if (editor.viewModel.meta.props[key].nullable == true) {
                        //TODO понять, что не так со свойтсом _autoValidate
                        page.page.editors[key]["_autoValidate"] = false;
                        page.page.editors[key].options.autoValidate = false;
                    }
                }
            }
        },
        noTitleRef: true
    };

    /**
     * Опции парта.
     */
    options: OutgoingDocumentObjectEditor.Options;

    /**
     * Модель парта.
     */
    viewModel: OutgoingDocument;

    /**
     * @constructor
     * @param {OutgoingDocumentObjectEditor.Options} options Опции парта.
     */
    constructor(options?: OutgoingDocumentObjectEditor.Options) {
        super(OutgoingDocumentObjectEditor.mixOptions(options, OutgoingDocumentObjectEditor.DEFAULT_OPTIONS));
    }
}

namespace OutgoingDocumentObjectEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(OutgoingDocumentObjectEditor.PART_NAME, (options?: OutgoingDocumentObjectEditor.Options) => {
        return new OutgoingDocumentObjectEditor(options);
    });
});

export = OutgoingDocumentObjectEditor;