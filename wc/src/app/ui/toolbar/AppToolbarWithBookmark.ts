import * as $ from "jquery";
import {Application, createCommand, lang} from "core";
import {ObservableProperty} from "lib/core.lang";
import {Command} from "lib/core.commands";
import {IPart} from "lib/ui/.ui";
import * as AppToolbar from "lib/ui/AppToolbar";
import * as ClientExtDownloadButton from "cmf/modules/clientext/ui/ClientExtDownloadButton";
import {BookmarkButton} from "dms/modules/bookmarks/menu/BookmarkButton";
import * as MainPagePart from "dms/modules/mainPage/MainPagePart";
import * as SimpleSearchObjectList from "dms/modules/search/SimpleSearchObjectList";
import * as template from "xhtmpl!app/ui/toolbar/templates/appToolbarWithBookmark.hbs";
import "xcss!lib/ui/styles/appToolbar";
import "xcss!app/ui/toolbar/styles/appToolbarWithBookmark";

/**
 * Верхний тулбар, но с кнопкой "Добавить в закладки".
 * 
 * TODO: cтоит выделить, если получится сделать что-то универсальное. Если нет, интегрировать с изменениями из app и ставить из архитипа.
 *
 * @author Mikhail Kondratev
 */
class AppToolbarWithBookmark extends AppToolbar {

    /**
     * Кнопка "Добавить в закладки".
     */
    private bookmarkButton: BookmarkButton;

    /**
     * Кнопка скачивания установщика клиенского расширения CMF. 
     */   
    private clientExtDownloadButton: ClientExtDownloadButton;

    /**
     * Опции по умолчанию.
     * @type {AppToolbar.Options}
     */
    static defaultOptions: AppToolbar.Options = {
        template: template
    };

    /**
     * Комманды, которые можно вызвать из шаблона.
     */
    commands: lang.Map<Command>;

    /**
     * Название арии, которая активируется при нажатии на логотип.
     */
    private readonly HOME_AREA_NAME: string = 'main';

    /**
     * Название элементов в sysMenu, которые нужно скрывать.
     */
    private static readonly SYS_MENU_HIDE_ITEMS: string[] = [];

    /**
     * Парт с поиском.
     */
    private searchPart: IPart;

    /**
     * Флаг, определяет видимость строки поиска.
     * true - видна, false - скрыта.
     */
    @lang.decorators.observableAccessor()
    private searchInputIsVisible: ObservableProperty<boolean>;

    constructor(app: Application, options?: AppToolbar.Options) {
        super(app, AppToolbarWithBookmark.mixOptions(options, AppToolbarWithBookmark.defaultOptions));
        this.bookmarkButton = new BookmarkButton();
        this.clientExtDownloadButton = new ClientExtDownloadButton(app);
        this.searchInputIsVisible(false);
        let that = this;

        app.eventPublisher.subscribe(MainPagePart.EVENTS.RENDERING, function () {
            that.setItemsVisibility(false);
        });

        app.eventPublisher.subscribe(MainPagePart.EVENTS.UNLOADED, function () {
            that.setItemsVisibility(true);
        });

        this.commands = {
            /**
             * Комманда перехода на главную, по клику на логотип.
             */
            NavigateHome: createCommand({
                execute: function () {
                    //Сначала сбасываем состоянии, у арии главной страницы, на deafult.
                    app.areaManager.getArea(that.HOME_AREA_NAME).activateState('');
                    //Затем переходим в default арию.
                    app.areaManager.activateArea('');
                }
            })
        };

        this.searchPart = new SimpleSearchObjectList(app);
    }

    /**
     * Запускает инициализацию кнопки "Добавить в закладки".
     * @param app
     */
    public initBookmarkButton(app) {
        this.bookmarkButton.bindRegionEvent(app);
    }

    /**
     * Показывает или скрывает элементы в верхнем тулбаре.
     * @param visible true - показывать, false - скрывать.
     */
    private setItemsVisibility(visible: boolean) {
        $(this.domElement).find('#areasMenu').toggle(visible);
        this.searchInputIsVisible(!visible);
        this.bookmarkButton.setVisibility(visible);
        this.setSysMenuRootItemsVisibility(visible);
    }

    public setSearchInputVisibility(visible: boolean) {
        let that = this;
        if (visible) {
            this.searchInputIsVisible(visible);
            $(this.domElement).find('#areasMenu').hide(100, () => {
                (that.searchPart as any).$domElement.find("input").focus();
            });
        } else {
            $(this.domElement).find('#areasMenu').show(100, () => {
                this.searchInputIsVisible(visible);
            });
        }

    }

    /**
     * Показывает или скрывает элементы sysMenu, с именами из массива {@link SYS_MENU_HIDE_ITEMS}.
     * @param visible true - показывать, false - скрывать.
     */
    private setSysMenuRootItemsVisibility(visible: boolean) {
        let that = this;
        AppToolbarWithBookmark.SYS_MENU_HIDE_ITEMS.forEach((itemName) => {
            that.sysMenu.getRootItem(itemName).set("hidden", !visible);
        });
    }
}

namespace AppToolbarWithBookmark {
    /**
     * Интерфейс опций верхнего тулбара.
     */
    export interface Options extends AppToolbar.Options {
        /**
         * Текст в поисковой строке.
         */
        searchPlaceholder?: string;
    }
}

export = AppToolbarWithBookmark;

