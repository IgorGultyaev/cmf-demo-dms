import * as core from "core";
import {Application} from "core";
import {CompanyCorrespondent} from "app/domain/model-classes";
import "dms/modules/icons/AppIconProvider";
import * as DictionaryObjectSelector from "dms/modules/dictionary/common/DictionaryObjectSelector";
import {DELETED_COLUMN} from "dms/modules/dictionary/common/DictionaryObjectList";
import * as ObjectEditor from "lib/ui/editor/ObjectEditor";

/**
 * Парт для выбора элементов CompanyCorrespondent.
 */
class CompanyCorrespondentSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:" + CompanyCorrespondent.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CompanyCorrespondentSelector.Options = {
        columns: [
            DELETED_COLUMN,
            {name: CompanyCorrespondent.meta.props.name.name},
            {name: CompanyCorrespondent.meta.props.shortName.name},
            {name: CompanyCorrespondent.meta.props.comment.name}
        ]
    };

    /**
     * Опции компонента.
     */
    options: CompanyCorrespondentSelector.Options;

    /**
     * @constructor
     * @param {Application} app Текущий экземпляр приложения.
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(app: Application, options?: CompanyCorrespondentSelector.Options) {
        super(app, CompanyCorrespondentSelector.mixOptions(options, CompanyCorrespondentSelector.DEFAULT_OPTIONS));
    }
}

namespace CompanyCorrespondentSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(CompanyCorrespondentSelector.PART_NAME, (options?: CompanyCorrespondentSelector.Options) => {
        return new CompanyCorrespondentSelector(app, options);
    });
});

export = CompanyCorrespondentSelector;