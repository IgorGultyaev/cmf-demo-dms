import * as core from "core";
import {Application} from "core";
import {ContractDocument} from "app/domain/model-ext";
import * as ContractDocumentSharedParams from "app/ui/document/contract/ContractDocumentSharedParams";
import * as ContractDocumentEditor from "app/ui/document/contract/ContractDocumentEditor";
import * as resources from "i18n!app/nls/resources";
import * as contractDocumentCommon from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCommon.hbs";
import * as documentAttachmentsTab from "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs";
import * as documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as documentRelationsTab from "xhtmpl!app/ui/templates/documentRelationsTab.hbs";
import * as ApprovalHistoryList from "dms/modules/document/approval/ApprovalHistoryList";
import * as DocumentAttachmentList from "dms/modules/document/attachment/DocumentAttachmentList";
import * as DocumentRelationList from "dms/modules/document/relation/DocumentRelationList";
import * as DocumentCommentsComponent from "dms/modules/document/comment/DocumentCommentsComponent";


/**
 * Парт для редактирования документа Договор.
 */
class ContractDocumentObjectEditor extends ContractDocumentEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentObjectEditor.Options = {
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
                var changes = that.viewModel.uow.getChanges();
                if (that._hasMeaningfulChanges(changes)) {
                    return that.onQueryUnloadWithChanges(options);
                }
            }

        },
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                template: contractDocumentCommon,
                properties: ContractDocumentSharedParams.CONTRACT_EDITOR_COMMON_PROPERTIES
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

            if (page.page.name === "comments") {
                (page.page as any).documentCommentsComponent = new DocumentCommentsComponent({
                    viewModel: this.viewModel
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
    options: ContractDocumentObjectEditor.Options;

    /**
     * Модель парта.
     */
    viewModel: ContractDocument;

    /**
     * @constructor
     * @param {ContractDocumentObjectEditor.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentObjectEditor.Options) {
        super(ContractDocumentObjectEditor.mixOptions(options, ContractDocumentObjectEditor.DEFAULT_OPTIONS));
    }
}

namespace ContractDocumentObjectEditor {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends ContractDocumentEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentObjectEditor.PART_NAME, (options?: ContractDocumentObjectEditor.Options) => {
        return new ContractDocumentObjectEditor(options);
    });
});

export = ContractDocumentObjectEditor;
