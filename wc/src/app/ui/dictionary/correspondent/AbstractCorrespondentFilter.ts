import * as core from "core";
import {Application} from "core";
import * as ObjectFilter from "lib/ui/editor/ObjectFilter";
import {CorrespondentFilter} from "app/domain/model-classes";

/**
 * Фильтр для AbstractCorrespondent.
 */
class AbstractCorrespondentFilter extends ObjectFilter {

    /**
     * Имя парта.
     * @type {string}
     */
    static PART_NAME: string = "ObjectFilter:AbstractCorrespondent";

    /**
     * Опции по умолчанию.
     * @type {AbstractCorrespondentList.Options}
     */
    static DEFAULT_OPTIONS: AbstractCorrespondentFilter.Options = {
        type: CorrespondentFilter.meta.name
    };

    /**
     * Опции компонента.
     */
    options: AbstractCorrespondentFilter.Options;

    /**
     * @constructs
     * @param {AbstractCorrespondentFilter.Options} options опции фильтра.
     */
    constructor(options?: AbstractCorrespondentFilter.Options) {
        super(AbstractCorrespondentFilter.mixOptions(options, AbstractCorrespondentFilter.DEFAULT_OPTIONS));
    }
}

namespace AbstractCorrespondentFilter {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectFilter.Options {

    }
}

export = AbstractCorrespondentFilter;

core.createModule((app: Application) => {
    app.registerPart(AbstractCorrespondentFilter.PART_NAME, (options?: AbstractCorrespondentFilter.Options) => {
        return new AbstractCorrespondentFilter(options);
    });
});
