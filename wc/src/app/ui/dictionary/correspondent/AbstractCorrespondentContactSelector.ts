import core = require( "core" );
import { AbstractCorrespondentContact } from "app/domain/model-classes";
import DictionaryObjectSelector = require( "dms/modules/dictionary/common/DictionaryObjectSelector" );
import { ActionIcon } from "dms/modules/icons/Icons";

/**
 * Парт для выбора AbstractCorrespondentContact.
 */
class AbstractCorrespondentContactSelector extends DictionaryObjectSelector {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectSelector:AbstractCorrespondentContact";

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: AbstractCorrespondentContactSelector.Options = {
        correspondentId: undefined,
        columns: [{
            name: AbstractCorrespondentContact.meta.props.deleted.name,
            role: "icon",
            title: core.ui.iconProvider.getIcon( ActionIcon.DELETE ),
            toolTip: AbstractCorrespondentContact.meta.props.deleted.descr,
            getter: function( this: AbstractCorrespondentContact ) {
                return this.deleted() ? ActionIcon.DELETE : null;
            }
        }, {
            name: AbstractCorrespondentContact.meta.props.name.name,
        }, {
            name: AbstractCorrespondentContact.meta.props.comment.name
        }, {
            name: AbstractCorrespondentContact.meta.props.primary.name
        }]
    };

    /**
     * Опции компонента.
     */
    options: AbstractCorrespondentContactSelector.Options;

    /**
     * Тип модели.
     */
    viewModel: AbstractCorrespondentContact;

    /**
     * @constructor
     * 
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor( app: core.Application, options?: AbstractCorrespondentContactSelector.Options ) {
        super( app, AbstractCorrespondentContactSelector.mixOptions( options, 
                AbstractCorrespondentContactSelector.DEFAULT_OPTIONS ) );
    }
    
    /**
     * @inheritDoc 
     */
    protected extendFilter( filter: core.lang.Map<Object> ): void {
        super.extendFilter( filter );
        core.lang.append( filter, {
            correspondent: this.options.correspondentId,
            "contactType.systemName": this.options.contactTypeSystemName
        } );
    }
}

namespace AbstractCorrespondentContactSelector {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectSelector.Options {
        
        /**
         *  Идентификатор корреспондента, для которого производится выбор.
         */
        correspondentId: string;

        /**
         * Системное наименование типа контакта, для которого производится выбор. 
         */
        contactTypeSystemName?: string;
    }
}

core.createModule( ( app: core.Application ) => {
    app.registerPart( AbstractCorrespondentContactSelector.PART_NAME,
        ( options?: AbstractCorrespondentContactSelector.Options ) => {
            return new AbstractCorrespondentContactSelector( app, options );
        } );
} );

export = AbstractCorrespondentContactSelector;