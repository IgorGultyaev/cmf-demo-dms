/**
 * Общий редактор задач по входящему документу.
 */
import core = require( "core" );
import DocumentObjectEditor = require( "app/ui/editor/DocumentObjectEditor" );
import resources = require( "i18n!app/nls/resources" );
import binding = require( "lib/binding" );
import Icons = require( "dms/modules/icons/Icons" );
import domainResources = require( "i18n!app/domain/nls/resources" );
import * as documentApprovalResources from "i18n!dms/modules/document/approval/nls/resources";
import {PageCreatedEventArgs} from "lib/ui/editor/ObjectEditor";
import {IncomingDocument} from "app/domain/model-ext";

class IncomingDocumentObjectEditor extends DocumentObjectEditor {
    /**
     * Опции по умолчанию.
     * @type {{}}
     */
    static DEFAULT_OPTIONS: IncomingDocumentObjectEditor.Options = {
        type: "IncomingDocument",
        presenterOptions: {
            resources: {
                titleShowDocument: resources['part.document.title.showDocument'],
            }
        },
        titleFormatter: function( editor: IncomingDocumentObjectEditor ) {
            const isRegistered = editor.viewModel.regNumber() != null;
            const nr = isRegistered ?
                editor.viewModel.regNumber().toString() : editor.viewModel.identifier().toString();
            const date = editor.viewModel.regDate() != null ?
                editor.viewModel.regDate().toLocaleDateString() : editor.viewModel.creationDate().toLocaleDateString();
            const title = domainResources["model.IncomingDocument"];

            return core.lang.stringFormat(resources["part.document.title"], nr, date, title);
        },
    };

    /**
     * Опции компонента.
     */
    options: IncomingDocumentObjectEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: IncomingDocument;

    constructor( options?: IncomingDocumentObjectEditor.Options ) {
        const _options = IncomingDocumentObjectEditor.mixOptions( options, IncomingDocumentObjectEditor.DEFAULT_OPTIONS );
        super( _options );
    }

    protected onPageStarted( args ): void {
        $( ".top-menu" ).first().css( "display", "table" );
        //TODO возможно, этому здесь не место.
        $( ".show-info" ).each( function() {
            var peElement = $( this ).find( ".x-pe" );
            var fieldName = $( this ).attr( "field" );

            var icon = $( "<a></a>" ).html( core.ui.iconProvider.getIcon( Icons.CommonIcon.INFO, {
                title: documentApprovalResources["part.document.pages.approval.infoIconTitle"]
            } ) );

            if ( $( peElement ).find( ".x-pe-viewonly" ).length > 0 ) {
                if ( args.page.editors[fieldName].value() ) {
                    icon.css( "margin-left", "5px" );
                    $( peElement.children( ":first" ) ).css( "float", "left" );
                    icon.appendTo( peElement );
                    binding.commandBind( icon, this.commands.ShowInfo, {
                        context: args.page,
                        field: fieldName
                    } );
                }
            } else {
                icon.css( "position", "absolute" );
                icon.css( "top", "10px" );
                icon.css( "right", "-15px" );
                icon.appendTo( peElement );

                binding.commandBind( icon, this.commands.ShowInfo, {
                    context: args.page,
                    field: fieldName
                } );
            }
        } );
        super.onPageStarted( args );
    }

    protected onPageCreated( args: PageCreatedEventArgs ): void {
        var page = args.page;
        for ( var key in page.editors ) {
            if ( Object.prototype.hasOwnProperty.call( page.editors, key ) ) {
                if ( this.viewModel.meta.props[key].nullable == true ) {
                    page.editors[key].set( "autoValidate", false );
                    page.editors[key].options.autoValidate = false;
                }
            }
        }
        super.onPageCreated( args );
    }
}

namespace IncomingDocumentObjectEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DocumentObjectEditor.Options {

    }
}

export = IncomingDocumentObjectEditor;
