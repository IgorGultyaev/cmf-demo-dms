import ObjectEditorPresenter = require("lib/ui/editor/ObjectEditorPresenter");
import resources = require("i18n!app/nls/resources");
import {Map} from "lib/core.lang";


/**
 * Общий презентер редактора задач по документу.
 */
class DocumentRegCardPresenter extends ObjectEditorPresenter {

    static DEFAULT_OPTIONS: DocumentRegCardPresenter.Options = {
        resources: {
            titleShowDocument: resources['part.document.title.showDocument'],
        }
    };

    constructor(options?: ObjectEditorPresenter.Options) {
        const _options = DocumentRegCardPresenter.mixOptions(options, DocumentRegCardPresenter.DEFAULT_OPTIONS);
        super(_options);
    }

    protected _getTabByName(name): JQuery {
        return super._getTabByName(name)
            .add(this.container.find(".dropdown-menu.regcard-tabs  li[data-page='" + name + "']"));
    }

    protected _renderTabs(): void {
        super._renderTabs();
        const tabs: JQuery = this.container.find(".regcard-tabs");
        const that: DocumentRegCardPresenter = this;
        tabs.on("click", "a", function (e) {
            e.preventDefault();
            const pageName: string = $(this).closest("li").attr("data-page");
            that.viewModel.switchToPage(pageName);
        });
    }

    /**
     * @inheritDoc
     */
    protected onReady(): void {
        super.onReady();
        this.$domElement.find('[data-toggle="tooltip"]').tooltip();
    }
}

namespace DocumentRegCardPresenter {
    export interface Options extends ObjectEditorPresenter.Options {
        /**
         * Ресурсы для локализации. Используются для отображения локализованных строк в шаблоне.
         */
        resources?: Map<string>;
    }
}

export = DocumentRegCardPresenter