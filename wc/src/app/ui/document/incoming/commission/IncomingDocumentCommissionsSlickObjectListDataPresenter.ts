import SlickObjectListDataPresenter = require("lib/ui/slick/SlickObjectListDataPresenter");

/**
 * Презентер данных для списка поручений входящего документа
 */
export class IncomingDocumentCommissionsSlickObjectListDataPresenter extends SlickObjectListDataPresenter{

    /**
     * Перерисовать сетку таблицы из-за изменения размеров.
     */
    public rerenderGrid(): void {
        this.renderGrid({ resize: true });
    }

}

