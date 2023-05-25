import * as EditorPage from "lib/ui/editor/EditorPage";
import * as core from "core";

/**
 * Класс редактора страниц с дополнительной опцией для сокрытия верхнего меню.
 * </p>
 * Содержит поля для вывода локализованных строк в шаблонах страниц редакторов.
 */
class EditorPageEx extends EditorPage {

}

namespace EditorPageEx {
    export interface Options extends EditorPage.Options {
        /**
         * Объект, содержит поля для вывода локализованных строк в шаблонах страниц редакторов.
         */
        resources?: core.lang.Map<string>;
        /**
         * Опция сокрытия верхнего меню
         */
        hideTopMenu?: boolean;
    }
}

export = EditorPageEx;