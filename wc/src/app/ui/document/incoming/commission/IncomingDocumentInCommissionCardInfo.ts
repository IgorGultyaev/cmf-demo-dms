import * as core from "core";
import {JournalIcon} from "dms/modules/icons/Icons";
import {commissionViewCardPartNameResolver} from "dms/modules/commission/cardview/CommissionViewCardPartNameResolver";
import * as AbstractCardInfoViewer from "dms/modules/commission/cardview/AbstractCardInfoViewer";
import * as peDocumentAttachmentControl from "dms/modules/document/pe/peDocumentAttachmentControl";
import * as mainPageInCommissionCardTemplate from "xhtmpl!app/ui/document/incoming/templates/incomingDocumentInCommissionCardInfoViewer.hbs";
import {IncomingDocument} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

import Map = core.lang.Map;
import ICommand = core.commands.ICommand;
import Promisable = core.lang.Promisable;

import Options = IncomingDocumentInCommissionCardInfo.Options;

/**
 * Базовый компонент отображения информации о входящем документе в карточках поручений.
 */
abstract class AbstractIncomingDocumentInCommissionCardInfoViewer extends AbstractCardInfoViewer<IncomingDocument>{

    /**
     * Параметры компонента по умолчанию.
     */
    static DEFAULT_OPTIONS: Options = {
        title: resources["view.commission.document.title"],
        preloads: [IncomingDocument.NAMES.correspondentExternal, "attachment"],
        pages: [{
            name: "main",
            properties: [{
                name: IncomingDocument.NAMES.correspondentExternal,
            }, {
                name: "attachment",
                PropertyEditor: peDocumentAttachmentControl
            }, {
                name: "permission"
            }, {
                name: "summary"
            }]
        }]
    }

    /**
     * Объект, расширяющий viewModel.
     */
    protected viewModelExtender: core.lang.ViewModelExtender;

    /**
     * @inheritDoc
     */
    protected tweakOptions( options: Options ): void {
        const mainPageTemplate = options.mainPageTemplate;
        if ( options.pages && mainPageTemplate ) {
            options.pages.filter(( page ) => "main" === page.name && !page.template )
                .forEach(( page ) => page.template = mainPageTemplate );
        }
        super.tweakOptions( options );
    }

    /**
     * @inheritDoc
     */
    protected disposing( options?: core.ui.PartCloseOptions ): void {
        if ( this.viewModelExtender ) {
            this.viewModelExtender.dispose();
            this.viewModelExtender = null;
        }
        super.dispose( options );
    }
}
namespace AbstractIncomingDocumentInCommissionCardInfoViewer { }

/**
 * Компонент отображения информации о входящем документе в карточках задач по поручению.
 */
class IncomingDocumentInCommissionTaskCardInfoViewer extends AbstractIncomingDocumentInCommissionCardInfoViewer {
    /**
     * Конструктор.
     *
     * @param options параметры компонента
     */
    constructor( options?: Options ) {
        super( IncomingDocumentInCommissionTaskCardInfoViewer.mixOptions( options,
            AbstractIncomingDocumentInCommissionCardInfoViewer.DEFAULT_OPTIONS ) );
    }
}
namespace IncomingDocumentInCommissionTaskCardInfoViewer { }

/**
 * Компонент отображения информации о входящем документе в карточках поручений.
 */
class IncomingDocumentInCommissionCardInfoViewer extends AbstractIncomingDocumentInCommissionCardInfoViewer {

    /**
     * Параметры компонента по умолчанию.
     */
    static DEFAULT_OPTIONS: Options = IncomingDocumentInCommissionCardInfoViewer.mixOptions( {
        mainPageTemplate: mainPageInCommissionCardTemplate
    }, AbstractIncomingDocumentInCommissionCardInfoViewer.DEFAULT_OPTIONS );

    /**
     * Конструктор.
     *
     * @param options параметры компонента
     */
    constructor( options?: Options ) {
        super( IncomingDocumentInCommissionCardInfoViewer.mixOptions( options,
            IncomingDocumentInCommissionCardInfoViewer.DEFAULT_OPTIONS ) );
    }
}
namespace IncomingDocumentInCommissionCardInfoViewer { }

import AbstractIncomingDocumentInCommissionCardInfoViewerExport = AbstractIncomingDocumentInCommissionCardInfoViewer;
import IncomingDocumentInCommissionTaskCardInfoViewerExport = IncomingDocumentInCommissionTaskCardInfoViewer;
import IncomingDocumentInCommissionCardInfoViewerExport = IncomingDocumentInCommissionCardInfoViewer;


namespace IncomingDocumentInCommissionCardInfo {

    export import AbstractIncomingDocumentInCommissionCardInfoViewer = AbstractIncomingDocumentInCommissionCardInfoViewerExport;
    export import IncomingDocumentInCommissionTaskCardInfoViewer = IncomingDocumentInCommissionTaskCardInfoViewerExport;
    export import IncomingDocumentInCommissionCardInfoViewer = IncomingDocumentInCommissionCardInfoViewerExport;


    /**
     * Общие параметры компонентов отображения информации о входящем документе в карточках поручений.
     */
    export interface Options extends AbstractCardInfoViewer.Options {

        /**
         * Шаблон главной страницы.
         */
        mainPageTemplate?: HandlebarsTemplateDelegate;
    }
}

core.createModule( function( app: core.Application ) {
    app.registerPart( commissionViewCardPartNameResolver.resolveTaskCardPartName( IncomingDocument ),
        function( options?: Options ) {
            return new IncomingDocumentInCommissionTaskCardInfoViewer( options );
        });

    app.registerPart( commissionViewCardPartNameResolver.resolveCardPartName( IncomingDocument ),
        function( options?: Options ) {
            return new IncomingDocumentInCommissionCardInfoViewer( options );
        });
});

export = IncomingDocumentInCommissionCardInfo;
