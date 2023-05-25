import * as core from "core";
import {Application} from "core";
import {PersonCorrespondent} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для PersonCorrespondent.
 */
class PersonCorrespondentEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:PersonCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: PersonCorrespondentEditor.Options = {
        type: PersonCorrespondent.meta.name,
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
                    "comment",
                    CorrespondentHelpers.contactsPeOptions
                ]
            }
        ]

    };

    /**
     * Опции компонента.
     */
    options: PersonCorrespondentEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: PersonCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: ObjectEditor.Options) {
        super(PersonCorrespondentEditor.mixOptions(options, PersonCorrespondentEditor.DEFAULT_OPTIONS));
    }
}

namespace PersonCorrespondentEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(PersonCorrespondentEditor.PART_NAME, (options?: PersonCorrespondentEditor.Options) => {
        return new PersonCorrespondentEditor(options);
    });
});

export = PersonCorrespondentEditor;