import * as core from "core";
import {Application} from "core";
import {Currency} from "app/domain/model-classes";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";

/**
 * Редактор валюты.
 */
class CurrencyObjectEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:" + Currency.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CurrencyObjectEditor.Options = {
        pages: [
            {
                properties: [
                    {name: Currency.meta.props.codeAlfa.name},
                    {name: Currency.meta.props.name.name},
                    {name: Currency.meta.props.codeNumber.name}
                ]
            }
        ]
    };

    /**
     * Опции компонента.
     */
    options: CurrencyObjectEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: Currency;

    /**
     * @constructor
     * @param {CurrencyObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: CurrencyObjectEditor.Options) {
        super(CurrencyObjectEditor.mixOptions(options, CurrencyObjectEditor.DEFAULT_OPTIONS));
    }
}

namespace CurrencyObjectEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = CurrencyObjectEditor;

core.createModule((app: Application) => {
    app.registerPart(CurrencyObjectEditor.PART_NAME, (options?: CurrencyObjectEditor.Options) => {
        return new CurrencyObjectEditor(options);
    });
});

