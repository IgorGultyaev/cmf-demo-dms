import * as core from "core";
import {Application} from "core";
import {CompanyPersonCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для CompanyPersonCorrespondent.
 */
class CompanyPersonCorrespondentEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:CompanyPersonCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CompanyPersonCorrespondentEditor.Options = {
        type: CompanyPersonCorrespondent.meta.name,
        pages: [
            {
                properties: [
                    "secondName",
                    "firstName",
                    "patronymic",
                    {
                        name: "name",
                        readOnly: true,
                    },
                    "position",
                    "department",
                    "primary",
                    "comment",
                    CorrespondentHelpers.contactsPeOptions
                ]
            }
        ]

    };

    /**
     * Опции компонента.
     */
    options: CompanyPersonCorrespondentEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: CompanyPersonCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: CompanyPersonCorrespondentEditor.Options) {
        super(CompanyPersonCorrespondentEditor.mixOptions(options, CompanyPersonCorrespondentEditor.DEFAULT_OPTIONS));
    }
}

namespace CompanyPersonCorrespondentEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

export = CompanyPersonCorrespondentEditor;

core.createModule((app: Application) => {
    app.registerPart(CompanyPersonCorrespondentEditor.PART_NAME, (options?: CompanyPersonCorrespondentEditor.Options) => {
        return new CompanyPersonCorrespondentEditor(options);
    });
});
