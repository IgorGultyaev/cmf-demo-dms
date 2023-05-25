import * as core from "core";
import {Application} from "core";
import * as taskResources from "i18n!dms/modules/task/nls/resources";
import resources = require( "i18n!app/nls/resources" );
import OutgoingDocumentTaskBaseEditor = require( "app/ui/document/outgoing/OutgoingDocumentTaskBaseEditor" );
import peDocumentAttachment = require( "app/ui/peDocumentAttachment" );
import attachOriginalTab = require( "xhtmpl!app/ui/document/outgoing/templates/attachOriginalTab.hbs" );

/**
 * Парт для создания проекта исходящего документа.
 */
class OutgoingDocumentTaskAttachOriginalPart extends OutgoingDocumentTaskBaseEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "TaskPart:TaskType_Document_Attach_Original:OutgoingDocument";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: OutgoingDocumentTaskAttachOriginalPart.Options = {
        mainPageOptions: {
            name: "main",
            title: resources["part.document.pages.main"],
            cssColumnPrefix: "col-xs-",
            template: attachOriginalTab,
            properties: [
                { name: "attachment", PropertyEditor: peDocumentAttachment, useTitledListLayout: true },
                { name: "organization", nullable: true, readOnly: true, navigable: true },
                { name: "documentKind", nullable: true, readOnly: true, navigable: true },
                { name: "identifier", nullable: true, readOnly: true },
                { name: "status", nullable: true, readOnly: true },
                { name: "summary", nullable: true, vt: "text", readOnly: true },
                { name: "sheetsAmount", nullable: true },
                { name: "annexSheetsAmount", nullable: true },
                { name: "urgent", nullable: true, readOnly: true },
                { name: "paper", nullable: true, readOnly: true },
                { name: "permission", nullable: true, readOnly: true },
                { name: "performer", nullable: true, readOnly: true, navigable: true },
                { name: "signatory", nullable: true, readOnly: true, navigable: true },
                { name: "nomenclatureCase" },
            ]
        },
        approvalPageOptions: null,
        attachmentPageOptions: null,
        subtitle: resources["part.task.subtitle.attach"],
        leftMenu: {
            update: [{
                name: "CompleteTask",
                title: taskResources["part.task.complete"],
                icon: "redo"
            }]
        },
        onSetViewModel: function( viewModel ) {
            return this._ownUow.load( "OutgoingDocument", this.getTaskEntityId() );
        }
    };

    /**
     * @constructs
     * @param {OutgoingDocumentTaskCreateProjectPart.Options} options Опции парта.
     */
    constructor( options?: OutgoingDocumentTaskAttachOriginalPart.Options ) {
        super( OutgoingDocumentTaskAttachOriginalPart.mixOptions( options, OutgoingDocumentTaskAttachOriginalPart.DEFAULT_OPTIONS ) );
    }
}

namespace OutgoingDocumentTaskAttachOriginalPart {
    /**
     * Интерфейс опций парта.
     */
    export interface Options extends OutgoingDocumentTaskBaseEditor.Options {

    }
}

core.createModule( ( app: Application ) => {
    app.registerPart( OutgoingDocumentTaskAttachOriginalPart.PART_NAME, ( options?: OutgoingDocumentTaskAttachOriginalPart.Options ) => {
        return new OutgoingDocumentTaskAttachOriginalPart( options );
    } );
} );
