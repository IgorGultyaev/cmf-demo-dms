import * as core from "core";
import {Application} from "core";
import {CompanyCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для сущности CompanyCorrespondent.
 */
class CompanyCorrespondentEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:CompanyCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CompanyCorrespondentEditor.Options = {
        type: CompanyCorrespondent.meta.name,
        pages: [{
            properties: [
                "name",
                "shortName",
                "comment",
                CorrespondentHelpers.contactsPeOptions
            ]
        }]
    };

    /**
     * Опции компонента.
     */
    options: CompanyCorrespondentEditor.Options;

    /**
     * Модель компонента.
     */
    viewModel: CompanyCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции редактора.
     */
    constructor(options?: CompanyCorrespondentEditor.Options) {
        super(CompanyCorrespondentEditor.mixOptions(options, CompanyCorrespondentEditor.DEFAULT_OPTIONS));
    }
}

namespace CompanyCorrespondentEditor {
    /**
     * Интерфейс опций редактора.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = CompanyCorrespondentEditor;

core.createModule((app: Application) => {
    app.registerPart(CompanyCorrespondentEditor.PART_NAME, (options?: CompanyCorrespondentEditor.Options) => {
        return new CompanyCorrespondentEditor(options);
    });
});

