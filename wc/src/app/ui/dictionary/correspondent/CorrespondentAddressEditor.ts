import * as core from "core";
import {Application} from "core";
import {CorrespondentAddress} from "app/domain/model-classes";
import * as CorrespondentHelpers from "app/ui/dictionary/correspondent/CorrespondentHelpers";
import ObjectEditor = require("lib/ui/editor/ObjectEditor");

/**
 * Редактор для сущности CorrespondentAddress.
 */
class CorrespondentAddressEditor extends ObjectEditor {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectEditor:CorrespondentAddress";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: CorrespondentAddressEditor.Options = {
        type: CorrespondentAddress.meta.name,

    };

    /**
     * Опции компонента.
     */
    options: CorrespondentAddressEditor.Options;

    /**
     * Тип модели.
     */
    viewModel: CorrespondentAddress;

    /**
     * @constructor
     * @param {ObjectEditor.Options} options Опции компонента.
     */
    constructor(options?: CorrespondentAddressEditor.Options) {
        const defaultOptions: CorrespondentAddressEditor.Options = CorrespondentAddressEditor.mixOptions(
            CorrespondentHelpers.contactEditorOptions,
            CorrespondentAddressEditor.DEFAULT_OPTIONS
        );

        defaultOptions.pages = [
            {
                properties: [
                    {name: "contactType", readOnly: true},
                    {
                        name: CorrespondentAddress.meta.props.contactKind.name, 
                        contactTypeId: options.contactTypeId
                    },
                    "primary",
                    "street",
                    "building",
                    "appartment",
                    "city",
                    "subregion",
                    "region",
                    "country",
                    "postalCode",
                    "comment"]
            }
        ];

        super(CorrespondentAddressEditor.mixOptions(options, defaultOptions));
    }
    
    /**
     * @inheritDoc 
     */
    protected doSaveAndClose( args: ObjectEditor.FinishCommandArgs ): core.lang.Promisable<void> {
        if ( this.viewModel.isModified() || this.viewModel.isNew() ) {
            this.viewModel.name( this.viewModel.street() +
                ", " + this.viewModel.building() +
                ( this.viewModel.appartment() != null ? ( ", " + this.viewModel.appartment() ) : "" ) +
                ", " + this.viewModel.city() +
                ( this.viewModel.subregion() != null ? ( ", " + this.viewModel.subregion() ) : "" ) +
                ( this.viewModel.region() != null ? ( ", " + this.viewModel.region() ) : "" ) +
                ", " + this.viewModel.country() +
                ( this.viewModel.postalCode() != null ? ( ", " + this.viewModel.postalCode() ) : "" ) );
        }
        return super.doSaveAndClose( args );
    }
}

namespace CorrespondentAddressEditor {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends ObjectEditor.Options {
        contactTypeId?: string;
    }
}

core.createModule((app: Application) => {
    app.registerPart(CorrespondentAddressEditor.PART_NAME, (options?: CorrespondentAddressEditor.Options) => {
        return new CorrespondentAddressEditor(options);
    });
});

export = CorrespondentAddressEditor;