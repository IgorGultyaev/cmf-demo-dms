import * as core from "core";
import {Application} from "core";
import * as resources from "i18n!app/nls/resources";
import * as contractDocumentCommon from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCommon.hbs";
import * as documentApprovalTab from "xhtmpl!app/ui/templates/documentApprovalTab.hbs";
import * as documentAttachmentsTab from "xhtmpl!app/ui/templates/documentAttachmentsTab.hbs";
import * as ApprovalHistoryList from "dms/modules/document/approval/ApprovalHistoryList";
import * as contractDocumentCommentsTabTemplate
    from "xhtmpl!app/ui/document/contract/templates/ContractDocumentCommentsTab.hbs";
import * as RegCardObjectViewer from "dms/modules/document/regCard/RegCardObjectViewer";
import * as documentRelationsTab from "xhtmpl!app/ui/templates/documentRelationsTab.hbs";
import * as DocumentRelationList from "dms/modules/document/relation/DocumentRelationList";
import * as ContractDocumentEditor from "app/ui/document/contract/ContractDocumentEditor";
import * as DocumentAttachmentList from "dms/modules/document/attachment/DocumentAttachmentList";
import * as dmsResources from "i18n!dms/modules/document/nls/resources";
import * as DocumentCommentsComponent from "dms/modules/document/comment/DocumentCommentsComponent";
import {ContractDocument} from "app/domain/model-ext";
import * as ContractDocumentSharedParams from "app/ui/document/contract/ContractDocumentSharedParams";

/**
 * Парт для просмотра документа Договор.
 */
class ContractDocumentObjectViewer extends RegCardObjectViewer {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectViewer:" + ContractDocument.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: ContractDocumentObjectViewer.Options = {
        noTitleRef: true,
        editable: false,
        menuButtonFormatter: function (): string {
            return dmsResources["menu.collapsed.title"];
        },
        titleFormatter: ContractDocumentEditor.DEFAULT_OPTIONS.titleFormatter,
        pages: [
            {
                name: "main",
                title: resources["part.document.pages.main"],
                template: contractDocumentCommon,
                properties: ContractDocumentSharedParams.CONTRACT_EDITOR_COMMON_PROPERTIES
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
                template: contractDocumentCommentsTabTemplate
            }, {
                name: "relations",
                title: resources["part.document.pages.relatedDocuments"],
                template: documentRelationsTab
            }],
        onSetViewModel: function (viewModel) {
            return viewModel.load({
                preloads: [
                    ContractDocument.meta.props.documentKind.name,
                    ContractDocument.meta.props.documentType.name,
                    ContractDocument.meta.props.createdBasedOn.name,
                    ContractDocument.meta.props.organization.name,
                    ContractDocument.meta.props.author.name,
                    ContractDocument.meta.props.status.name,
                    ContractDocument.meta.props.nomenclatureCase.name,
                    ContractDocument.meta.props.performer.name,
                    ContractDocument.meta.props.registrator.name,
                    ContractDocument.meta.props.signatory.name,
                    ContractDocument.meta.props.currency.name,
                    ContractDocument.meta.props.terminationReason.name,
                    ContractDocument.meta.props.curator.name
                ]
            });
        },
        onPageCreated: function (this: ContractDocumentObjectViewer, editor, args) {
            if (args.page.name == "attachment") {
                (args.page as any).attachmentsComponent = core.createPart(DocumentAttachmentList.PART_NAME, {
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
                this.registerChild((args.page as any).queueComponent, {
                    keepOnUnload: true,
                    trackStatus: true
                });
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
    options: ContractDocumentObjectViewer.Options;

    /**
     * Модель парта.
     */
    viewModel: ContractDocument;

    /**
     * @constructor
     * @param {ContractDocumentObjectViewer.Options} options Опции парта.
     */
    constructor(options?: ContractDocumentObjectViewer.Options) {
        super(ContractDocumentObjectViewer.mixOptions(options, ContractDocumentObjectViewer.DEFAULT_OPTIONS));
    }
}

namespace ContractDocumentObjectViewer {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends RegCardObjectViewer.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(ContractDocumentObjectViewer.PART_NAME, (options?: ContractDocumentObjectViewer.Options) => {
        return new ContractDocumentObjectViewer(options);
    });
});

export = ContractDocumentObjectViewer;