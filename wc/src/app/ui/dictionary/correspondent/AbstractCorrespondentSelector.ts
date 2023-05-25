import * as core from "core";
import {Application} from "core";
import {AbstractCorrespondent} from "app/domain/model-classes";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");
import DictionaryObjectSelector = require( "dms/modules/dictionary/common/DictionaryObjectSelector" );
import { ActionIcon } from "dms/modules/icons/Icons";
import "dms/modules/icons/AppIconProvider";

/**
 * Парт для выбора элементов AbstractCorrespondent.
 */
class AbstractCorrespondentSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:AbstractCorrespondent";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: AbstractCorrespondentSelector.Options = {
        columns: [{
            name: AbstractCorrespondent.meta.props.deleted.name,
            role: "icon",
            title: core.ui.iconProvider.getIcon( ActionIcon.DELETE ),
            toolTip: AbstractCorrespondent.meta.props.deleted.descr,
            getter: function( this: AbstractCorrespondent ) {
                return this.deleted() ? ActionIcon.DELETE : null;
            }
        }, {
            name: AbstractCorrespondent.meta.props.name.name,
        }, {
            name: AbstractCorrespondent.meta.props.comment.name
        }]
    };

    /**
     * Опции компонента.
     */
    options: AbstractCorrespondentSelector.Options;

    /**
     * Тип модели.
     */
    viewModel: AbstractCorrespondent;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(app: Application, options?: AbstractCorrespondentSelector.Options) {
        super(app, AbstractCorrespondentSelector.mixOptions(options, AbstractCorrespondentSelector.DEFAULT_OPTIONS));
    }
}

namespace AbstractCorrespondentSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {

    }
}

core.createModule((app: Application) => {
    app.registerPart(AbstractCorrespondentSelector.PART_NAME, (options?: AbstractCorrespondentSelector.Options) => {
        return new AbstractCorrespondentSelector(app, options);
    });
});

export = AbstractCorrespondentSelector;