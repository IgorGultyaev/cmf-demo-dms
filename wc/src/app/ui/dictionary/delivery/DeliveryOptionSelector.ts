import * as core from "core";
import {DELETED_COLUMN} from "dms/modules/dictionary/common/DictionaryObjectList";
import * as DictionaryObjectSelector from "dms/modules/dictionary/common/DictionaryObjectSelector";
import {DeliveryOption} from "app/domain/model-classes";

import Application = core.Application;

/**
 * Парт для выбора сущностей DeliveryOption.
 */
class DeliveryOptionSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:DeliveryOption";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryOptionSelector.Options = {
        entityType: DeliveryOption.meta.name,
        columns: [DELETED_COLUMN,
            {name: DeliveryOption.meta.props.name.name},
            {name: DeliveryOption.meta.props.deliveryType.name}
        ]
    };

    /**
     * Опции компонента.
     */
    options: DeliveryOptionSelector.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryOption;

    /**
     * @constructor
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor(app: Application, options?: DeliveryOptionSelector.Options) {
        super(app, DeliveryOptionSelector.mixOptions(options, DeliveryOptionSelector.DEFAULT_OPTIONS));
    }
}

namespace DeliveryOptionSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {

    }
}

export = DeliveryOptionSelector;

core.createModule((app: Application) => {
    app.registerPart(DeliveryOptionSelector.PART_NAME, (options?: DeliveryOptionSelector.Options) => {
        return new DeliveryOptionSelector(app, options);
    });
});

