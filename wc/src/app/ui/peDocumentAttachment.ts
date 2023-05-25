import * as core from "core";
import { DomainObject } from "lib/domain/.domain";
import * as UnitOfWork from "lib/domain/UnitOfWork";
import { SavedEventArgs } from "lib/ui/editor/ObjectEditor";
import peObjectList = require( "lib/ui/pe/peObjectList" );

import * as DocumentAttachmentListMixin from "dms/modules/document/attachment/DocumentAttachmentListMixin";

import { DocumentAttachment } from "app/domain/model-ext";

import Promise = core.lang.Promise;

/**
 * Редактор вложений документа.
 */
class peDocumentAttachment extends peObjectList {

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: peDocumentAttachment.Options = {
        flavor: "aggregation",
        where: function( item: any ): boolean {
            const documentAttachment: DocumentAttachment = item as DocumentAttachment;
            if ( ( !documentAttachment.document() ) || ( !documentAttachment.versionKey() ) ) {
                // Только-что созданный или несохранённый item.
                return true;
            }

            return core.lang.every( documentAttachment.document().attachment().all(), function( attachment ) {
                return ( attachment.id === documentAttachment.id ) || ( attachment.versionKey() != documentAttachment.versionKey() )
                    || ( attachment.versionLabel() < documentAttachment.versionLabel() );
            } );
        }
    };

    /**
     * Опции компонента.
     */
    options: peDocumentAttachment.Options;

    /**
     * Переопределение свойства для его типизации.
     */
    activeItem: core.lang.ObservableProperty<DocumentAttachment>;

    /**
     * @constructor
     * @param options Опции компонента.
     */
    constructor( options?: peDocumentAttachment.Options ) {
        super( peDocumentAttachment.mixOptions( peDocumentAttachment.mixOptions( options,
            peDocumentAttachment.DEFAULT_OPTIONS ), DocumentAttachmentListMixin.DEFAULT_OPTIONS() ) );
    }

    /**
     * @inheritDoc
     */
    protected onNewAttachmentVersionProvided( newVersion: DocumentAttachment, oldVersion: DocumentAttachment,
        args: SavedEventArgs ): Promise<DocumentAttachment> {
        return this.onNewAttachmentVersionProvidedInternal( newVersion, oldVersion, args ).done( item => {
            this.selection.clear();
            this.activeItem(newVersion);
            const callback = ( sender: UnitOfWork, args: UnitOfWork.SaveResult ) => {
                if ( args.created && args.created.some( object => object === newVersion ) ) {
                    this.onNewAttachmentSaved( newVersion, oldVersion);
                    sender.unbind("saved", callback, this);
                }
            };
            item.uow.bind( "saved", callback,  this );
            return item;
        } );
    }

    /**
     * @inheritDoc
     */
    protected _deleteObjects( objects?: DomainObject[] ): void {
        super._deleteObjects( objects );
    }

    /**
     * @inheritDoc 
     */
    protected listUow(): UnitOfWork {
        return this.viewModel.uow;
    }

    /**
     * @inheritDoc 
     */
    protected documentId(): string {
        return this.viewModel.id;
    }
}

interface peDocumentAttachment extends DocumentAttachmentListMixin { };

DocumentAttachmentListMixin.mixinTo( peDocumentAttachment, "inherited" );

namespace peDocumentAttachment {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends peObjectList.Options, DocumentAttachmentListMixin.Options {

    }
}

export = peDocumentAttachment;

