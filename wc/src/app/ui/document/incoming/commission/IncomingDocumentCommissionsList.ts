import * as core from "core";
import * as List from "lib/ui/list/List";
import {SlickObjectListPresenterBase} from "lib/ui/slick/SlickObjectListPresenter";
import * as DisableSupportedObjectListMixin from "cmf/modules/disablesupport/DisableSupportedObjectListMixin";
import * as AbstractChildCommissionsList from "dms/modules/commission/AbstractChildCommissionsList";
import {IncomingDocumentCommissionsSlickObjectListDataPresenter} from "app/ui/document/incoming/commission/IncomingDocumentCommissionsSlickObjectListDataPresenter";
import {IncomingDocumentChildPartRerenderer} from "app/ui/document/incoming/IncomingDocumentChildPartRerenderer";
import {AbstractDocument, Commission, IncomingDocument} from "app/domain/model-classes";
import * as resources from "i18n!app/nls/resources";

import Options = AbstractChildCommissionsList.Options;

/**
 * Компонент списка поручений входящего документа с возможностью создания.
 */
class IncomingDocumentCommissionsList extends AbstractChildCommissionsList<IncomingDocument> 
    implements DisableSupportedObjectListMixin, IncomingDocumentChildPartRerenderer {

    /**
     * Конструктор.
     *
     * @param app приложение, для которого создаётся список
     * @param options параметры списка
     */
    constructor( app: core.Application, options?: Options ) {
        super( app, IncomingDocumentCommissionsList.mixOptions( options,
            IncomingDocumentCommissionsList.DEFAULT_OPTIONS ) );

    }

    /**
     * @inheridDoc
     */
    protected resolveContainer(): AbstractDocument {
        return this.viewModel;
    }

    /**
     * @inheridDoc
     */
    protected canCreateCommission(): boolean {
        return !this.disabled();
    }

    /**
     * @inheridDoc
     */
    protected appendFilter( args: List.DataLoadEventArgs<Commission> ): void {
        args.params = args.params || {};
        args.params.$filter = {
            "parent": null,
            container: {
                eq: this.viewModel.id
            }
        };
        args.params.$expand = ["performers", "performers.performer"].join( "," );
    }

    /**
     * @inheridDoc
     */
    public rerenderChild():void{
        let presenter = this.presenter as SlickObjectListPresenterBase;
        (presenter.dataPresenter as IncomingDocumentCommissionsSlickObjectListDataPresenter).rerenderGrid()
    }
}

interface IncomingDocumentCommissionsList extends DisableSupportedObjectListMixin { };

DisableSupportedObjectListMixin.mixinTo( IncomingDocumentCommissionsList, "inherited" );

namespace IncomingDocumentCommissionsList {

    /**
     * Параметры списка по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        title: resources["part.task.review.commissionsList"],
        createCommandTitle: resources["part.commission.command.create"],
        presenterOptions: {DataPresenter: IncomingDocumentCommissionsSlickObjectListDataPresenter}
    }
}

core.createModule( function( app: core.Application ) {
    app.registerPart( "IncomingDocumentCommissionsList", function( options?: Options ) {
        return new IncomingDocumentCommissionsList( app, options );
    });
});

export = IncomingDocumentCommissionsList;

