// Стили должны быть первым, чтобы их можно было перекрыть.
import "xcss!lib/ui/styles/root";
import "xcss!app/ui/styles/root";
import "xcss!components-font-awesome/css/font-awesome";

import * as $ from "jquery";
import * as core from "core";
import { Area } from "lib/core.composition";
import { AppEvent, IAppStateManager } from "lib/.core";
import { isHtml, SafeHtml } from "lib/formatters";
import xconfig = require( "xconfig" );
import { hot } from "lib/hot-loader";
import * as DataFacadeSmart from "lib/interop/DataFacadeSmart";
import * as BackendInterop from "lib/interop/BackendInterop";
import * as DataStoreFactory from "lib/data/DataStoreFactory";
import { PDFJS } from "pdfjs-dist/build/pdf";
import "app/iconProvider";
import "lib/interop/DataFacadeSmart";
import "app/default-menus";
import "app/default-parts";
import "app/parts";
import "app/area-default";
import "app/area-journals";
import "app/area-dictionary";
import "app/area-reports";
import "app/modelInfoProviderSettings";
import "cmf/modules/list/DynamicTooltips";
import "cmf/modules/toggleAreaShadow/ToggleAreaShadowListener";
import model = require( "app/domain/model-ext" );
import peObjectList = require( "lib/ui/pe/peObjectList" );
import templateApp = require( "xhtmpl!app/ui/templates/app.hbs" );
import * as AppToolbarWithBookmark from "app/ui/toolbar/AppToolbarWithBookmark";
import MainPagePart = require( "dms/modules/mainPage/MainPagePart" );
import Inbox = require( "cmf/modules/inbox/ui/Inbox" );
import AppNavMenu = require( "lib/ui/menu/AppNavMenu" );
import resources = require( "i18n!app/nls/resources" );
import DocumentProcessMenuCreator = require( "dms/modules/document/process/creation/DocumentProcessMenuCreator" );
import Menu = require( "lib/ui/menu/Menu" );
import View = require( "lib/ui/handlebars/View" );
import titledListLayoutTemplate = require( "xhtmpl!app/ui/templates/titledListLayout.hbs" );
import RelationTargetSelectorResolverService = require( "dms/modules/relation/RelationTargetSelectorResolverService" );
import OutgoingDocumentSelector = require( "app/ui/document/outgoing/journal/OutgoingDocumentSelector" );
import IncomingDocumentSelector = require( "app/ui/document/incoming/journal/IncomingDocumentSelector" );
import { currentUserService } from "dms/modules/security/CurrentUserService";
import { UserSettingsAndBookmarksStore } from "dms/modules/bookmarks/UserSettingsAndBookmarksStore";
import "modules/security/module-security";
import "modules/notifications/module-notifications";

if ( !xconfig ) {
    let err = "No xconfig global object found. Unable to proceed.";
    alert( err );
    throw new Error( err );
}

//Установка порядка в меню
let lastOrderVal: number = 0;
core.lang.forEach( peObjectList.defaultMenus.peObjectListRow.items, function( item: Menu.Item ) {
    if ( !item.order ) {
        lastOrderVal += 10;
        item.order = lastOrderVal;
    }
} );

//TODO убрать, когда перейдем на более новую версию WC, в которой эта функция доступна для импорта.
//см. https://jira.croc.ru/browse/CMF-721
function makeColumnsRatioHelperData( options: View.HelperOptions ): any {
    let data = View.Handlebars.createFrame( options.data ),
        peLayout = data.peLayout ? core.lang.clone( data.peLayout ) : {},
        editorPage = data.context && data.context.editorPage,
        ratio = options.hash.columnsRatio, //e.g. "4:8"
        colonIndex;
    if ( ratio ) {
        colonIndex = ratio.indexOf( ":" );
        if ( colonIndex > 0 ) {
            peLayout.labelColumnRatio = ratio.slice( 0, colonIndex );
            peLayout.peColumnRatio = ratio.slice( colonIndex + 1 );
        }
    }
    if ( options.hash.noLabel !== undefined ) {
        peLayout.noLabel = !!options.hash.noLabel;
    }
    if ( editorPage ) {
        peLayout.labelColumnRatio = peLayout.labelColumnRatio || editorPage.labelColumnRatio;
        peLayout.peColumnRatio = peLayout.peColumnRatio || editorPage.peColumnRatio;
    }
    data.peLayout = peLayout;
    return data;
}

//TODO: выделить helper'ы в demo-dms-core-ui

View.Handlebars.registerPartial( "titledListLayout", titledListLayoutTemplate );

View.Handlebars.registerHelper( "peContainer", function( context, options ) {
    const data = makeColumnsRatioHelperData( options );
    let partialName: string = "peContainer";

    if ( context.options.useTitledListLayout || options.hash.useTitledListLayout ) {
        partialName = "titledListLayout";
    }

    const html: string = View.Handlebars.partials[partialName].call( this, context, { data: data } );
    return new View.Handlebars.SafeString( html );
} );

/**
 * Удаляет парты, кроме тех, названия которых указаны в массиве exclusions.
 * @param app текущий экземпляр приложения.
 * @param exclusions массив названий партов, которые удалять не требуется.
 */
const clearRegionCache = function( app: Application, exclusions: Array<string> ) {
    core.lang.forEach( app.areaManager.getAreas(), function( area: Area ) {
        core.lang.forEach( area.regionManager.regions, function( region: any ) {
            core.lang.forEach( region._parts, function( partHelper ) {
                if ( !core.lang.some( exclusions, function( partName ) {
                    return partHelper.part.name === partName;
                } ) ) {
                    region._removePart( partHelper );
                }
            } );
        } );
    } );
};

class Application extends core.Application {
    /**
     * Верхняя панель приложения.
     */
    appToolbar: AppToolbarWithBookmark;

    /**
     * Меню навигации.
     */
    navMenu: core.ui.AppNavMenu;

    /**
     * Модель приложения.
     */
    model: typeof model;

    /**
     * @constructs ApplicationEx
     * @extends Application
     */
    constructor() {
        super( xconfig, {
            template: templateApp,
            UserSettingsStore: UserSettingsAndBookmarksStore
        } );

        this.model = model;
        PDFJS.workerSrc = this.config.root + this.config.clientBase + "/pdf.worker.js";
    }

    /**
     * @inheritDoc 
     */
    createDataFacade() {
        return DataStoreFactory
            .create( xconfig.appName, /*db version:*/ 1, model.meta )
            .then( store => {
                return new DataFacadeSmart(
                    new BackendInterop( xconfig ),
                    this.eventPublisher,
                    store,
                    {
                        // TODO: cacheManager: new CacheManager()
                    }
                );
            } );
    }

    /**
     * @inheritDoc
     */
    preinitialize(): void {
        super.preinitialize();
        this.appToolbar = new AppToolbarWithBookmark( this, {
            //affix: false
            navToolbar: {
                radio: false,
                hideSingle: false,
                itemPresentation: "icon"
            },
            onlineBeacon: false
        } );
    }

    /**
     * @inheritDoc
     */
    initialize(): core.lang.Promise<void> {
        super.initialize();

        return this.forceLoginIfNotLoggedIn().then( user => {
            // Это обходит проблему того, что подписка на событие "security.login" здесь не сработает, т.к. события
            // начинают рассылаться только после старта приложения, а здесь ещё инициализация.
            const event: AppEvent = {
                eventName: "security.login",
                args: {
                    user: user,
                    defer: undefined
                },
                processed: false
            };
            ( currentUserService as any ).onLogin( event );
            return core.lang.when( event.args.defer ).then( () => { this.initialize2(); return; } );
        } );
    }

    /**
     * Производит обязательную аутентификацию пользователя в случае, если он ещё не залогинен.
     *  
     * @param callback вызов производится после того, как пользователь гарантировано аутентифицирован
     * @returns промис, разрешающийся dto пользователя тогда, когда пользователь гарантировано аутентифицирован 
     */
    protected forceLoginIfNotLoggedIn(): core.lang.Promise<any> {
        const loginHandler = () => this.dataFacade.login().then( user => user, loginHandler );

        this.eventPublisher.subscribe( "security.logout", loginHandler );

        return this.dataFacade.getCurrentUser( { refreshStatus: true } ).then(
            user => user ? user : loginHandler(), loginHandler );
    }

    /**
     * Инициализация приложения, гарантированно выполняемая после того, как пользователь залогинился. 
     */
    protected initialize2(): void {
        this.initializeNavMenu();
        this.addDebugToToolbar();

        this.appToolbar.initBookmarkButton( this );

        new DocumentProcessMenuCreator( this ).attachToSystemMenu();

        this.removeDraftsFromMenu();

        this.subscribeSecurityEvents();
        this.subscribeMainPageEvents();
        this.registerRelationTargetSelectorResolvers();
    }

    /**
     * Осуществляет регистрацию резолверов для получения имени парта на основе типа связи документа.
     */
    protected registerRelationTargetSelectorResolvers(): void {
        const service: RelationTargetSelectorResolverService = RelationTargetSelectorResolverService.service;
        service.register( {
            resolve: relationType => {
                if ( relationType.id == "id_RelationType_InResponseTo_straight" ) {
                    return core.lang.resolved( OutgoingDocumentSelector.PART_NAME );
                } else {
                    return core.lang.rejected();
                }
            },
        } );

        service.register( {
            resolve: relationType => {
                if ( relationType.id == "id_RelationType_InResponseTo_reverse" ) {
                    return core.lang.resolved( IncomingDocumentSelector.PART_NAME );
                } else {
                    return core.lang.rejected();
                }
            },
        } )
    }

    /**
     * Добавляет кнопку арии "debug" в верхнюю панель.
     */
    private addDebugToToolbar() {
        let that = this;
        const debug: Menu.Item = $.grep( this.navMenu.items, function( item ) {
            return item.name == "debug";
        } )[0];

        debug.html = "<div class='x-icon x-icon-settings' aria-hidden='true' style='margin-top: -6px;font-size: 32px;'></div>";

        const opt: Menu = Menu.create( {
            items: [
                {
                    name: "search",
                    icon: "search",
                    title: resources["hint.search"],
                    html: "<div class='x-icon x-icon-search' aria-hidden='true' style='margin-top: -6px;font-size: 32px;'></div>",
                    command: core.createCommand( {
                        execute: function() {
                            ( that.appToolbar as any ).setSearchInputVisibility( true );
                            arguments[0].$event.stopPropagation();
                            //у пункта меню должна быть команда, иначе пункт меню не будет отрисован
                        }
                    } )
                }
            ]
        } );
        opt.items.push( debug );

        this.appToolbar.navMenuPresenter.setViewModel( opt );
    }

    /**
     * Создает навигационное меню.
     */
    private initializeNavMenu() {
        // top navigation menu (switching areas):
        // NOTE: AppNavToolbar cannot be created in preinitialize and rendered in template as it depends on AreaManager
        // which is initialized after template rendered
        AppNavMenu.createDefaultMenu = function( areaManager ) {
            const stateMan: IAppStateManager = areaManager.app.stateManager;
            return areaManager.getAreas().map( function( area: Area ) {
                const title: string | SafeHtml = area.title;
                const item = {
                    name: area.name || "default",
                    title: title ? title.toString() : undefined,
                    html: isHtml( title ) ? ( title as SafeHtml ).toHTML() : undefined,
                    hideIfDisabled: true,
                    commandName: "NavigateArea",
                    params: {
                        area: area.name
                    },
                    url: stateMan.getAreaUrl( area.name ),
                    items: []
                };
                core.lang.forEach( area.states, function( state, stateName ) {
                    item.items.push( {
                        name: ( item.name + "#" + ( stateName || "defaultState" ) ),
                        title: state.title || stateName,
                        hideIfDisabled: true,
                        commandName: "NavigateState",
                        params: {
                            area: area.name,
                            state: state.name
                        },
                        url: stateMan.getAreaStateUrl( area.name, stateName )
                    } );
                } );

                return item;
            } );
        };

        this.navMenu = new AppNavMenu( this.areaManager );
        this.appToolbar.appNavMenu( this.navMenu );
    }

    /**
     * Удалеят пункт "drafts" из меню.
     */
    private removeDraftsFromMenu() {
        const drafts = this.sysMenu.rootItems.find( function( item ) {
            return item.name === "drafts";
        } );

        this.sysMenu.rootItems.remove( drafts );
    }

    /**
     * Подписывается на события module-security для очистки партов, при логине/логауте.
     */
    private subscribeSecurityEvents() {
        this.eventPublisher.subscribe( "security.login", ( ev: AppEvent ) => {
            const lastUser: string = localStorage.getItem( "lastUser" );
            if ( !!lastUser && lastUser !== ev.args.user.login ) {
                clearRegionCache( this, ["MainPagePart"] );
                this.stateManager.switchState( {} ).always( () => {
                    this.eventPublisher.publish( Inbox.DEFAULT_INBOX_EVENTS.RELOAD );
                } );
            }
            localStorage.setItem( "lastUser", ev.args.user.login );
        } );

        this.eventPublisher.subscribe( "security.logout", () => {
            clearRegionCache( this, ["MainPagePart"] );
            this.stateManager.switchState( {} ).always( () => {
                this.eventPublisher.publish( Inbox.DEFAULT_INBOX_EVENTS.CLEAR );
            } );
            
            // Удаление нотификаций.
            // TODO: выпилить после реализации https://track.rnd.croc.ru/issue/WC-1964.
            const notificationManager: any = core.Application.current.notificationManager;
            notificationManager && notificationManager._eventLog
                && notificationManager._eventLog.clear && notificationManager._eventLog.clear();
            
            localStorage.removeItem( "lastUser" );
        } );
    }

    /**
     * Подписывается на события {@see MainPagePart} для скрытия/показа хлебных крошек.
     */
    private subscribeMainPageEvents(): void {
        this.eventPublisher.subscribe( MainPagePart.EVENTS.RENDERING, () => {
            this.$rootElement.find( '.x-breadcrumb:visible' ).hide();
            this.affixManager.suspend( {
                suspend: true
            } );
        } );

        this.eventPublisher.subscribe( MainPagePart.EVENTS.UNLOADED, () => {
            this.$rootElement.find( '.x-breadcrumb:not(:visible)' ).fadeIn();
            this.affixManager.suspend( {
                suspend: false
            } );
        } );
    }
}

/**
 * Обёртка для hot reload. 
 */
class HotApp extends hot( module )( Application ) {

}

export = HotApp;