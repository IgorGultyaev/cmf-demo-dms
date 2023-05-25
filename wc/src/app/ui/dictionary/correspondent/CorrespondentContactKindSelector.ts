import * as core from "core";
import {CorrespondentContactKind} from "app/domain/model-classes";
import ObjectSelector = require("lib/ui/list/ObjectSelector");
import DomainObject = require("lib/domain/DomainObject");
import CorrespondentContactKindSelectorDataSource = require("app/ui/dictionary/correspondent/CorrespondentContactKindSelectorDataSource");

import Application = core.Application;

/**
 * Парт для выбора CorrespondentContactKind.
 */
class CorrespondentContactKindSelector extends ObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:CorrespondentContactKind";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CorrespondentContactKindSelector.Options = {
        autoLoad: true,
        columns: ["name"],

    };

    /**
     * Опции компонента.
     */
    options: CorrespondentContactKindSelector.Options;

    /**
     * Тип модели.
     */
    viewModel: CorrespondentContactKind;

    /**
     * @constructor
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor(app: Application, options?: CorrespondentContactKindSelector.Options) {
        options.dataSource = options.dataSource || new CorrespondentContactKindSelectorDataSource(app, {
            contactTypeId: options.contactType? options.contactType.id: undefined
        }); 
        
        options = CorrespondentContactKindSelector.mixOptions(options, CorrespondentContactKindSelector.DEFAULT_OPTIONS);
        super(app, options);
    }
}

namespace CorrespondentContactKindSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectSelector.Options {
        contactType?: DomainObject;
    }
}

export = CorrespondentContactKindSelector;

core.createModule((app: Application) => {
    app.registerPart(CorrespondentContactKindSelector.PART_NAME, (options?: CorrespondentContactKindSelector.Options) => {
        return new CorrespondentContactKindSelector(app, options);
    });
});

