import core = require( "core" );
import PropertyEditor = require( "lib/ui/pe/PropertyEditor" );
import peDictionaryDropDown = require( "dms/modules/dictionary/common/peDictionaryDropDown" );
import AbstractCorrespondentContactSelector = require( "app/ui/dictionary/correspondent/AbstractCorrespondentContactSelector" );

import Options = peCorrespondentContact.Options;

/**
 * Редактор свойства контакта.
 * 
 * @author Dmitry Malenok
 */
class peCorrespondentContact extends peDictionaryDropDown {

    /**
     * Параметры редактора свойств.
     * 
     * Переопределено для расширения.
     */
    options: Options;

    /**
     * Метод для получения PropertyEditorFactory, для создания peDictionaryDropDown, с заданным партом для выбора
     * элемента.
     * @param selectorName наименование парта, который должен быть открыт при выборе элемента с помощью ObjectSelector
     * @param factoryOptions параметры, с которыми должен быть создан редактор
     * @return Фабрика для создания редактора
     */
    static factory( selectorName: string, factoryOptions?: Options ): PropertyEditor.DefaultMapping.PropertyEditorFactory {
        return {
            create: ( options?: Options ) => {
                const _options: Options = core.lang.extendEx( options || {}, factoryOptions, { deep: true } );
                return new peCorrespondentContact( core.lang.extendEx( _options, { selectorName: selectorName }, { deep: true } ) );
            }
        };
    }

    /**
     * Конструктор.
     * 
     * @param options параметры редактора свойств
     */
    constructor( options?: Options ) {
        super( peCorrespondentContact.mixOptions( core.lang.appendEx( options, {
            correspondentId: undefined,
            selectorOptions: {
                correspondentId: options.correspondentId,
                contactTypeSystemName: options.contactTypeSystemName,
                entityType: options.ref && options.ref.name
            } as AbstractCorrespondentContactSelector.Options
        } as Options, { deep: true } ), peCorrespondentContact.DEFAULT_OPTIONS ) );
    }

    /**
     * @inheritDoc 
     */
    protected createFilter( viewModel: any ): core.lang.Map<Object> {
        const result = super.createFilter( viewModel );
        core.lang.append( result, {
            correspondent: this.options.correspondentId,
            "contactType.systemName": this.options.contactTypeSystemName
        } )
        return result;
    }
}

namespace peCorrespondentContact {

    /**
     * Параметры редактора свойств по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        selectorName: AbstractCorrespondentContactSelector.PART_NAME,
        correspondentId: undefined,
        showInfoButton: false
    }

    /**
     * Интерфейс параметров редактора свойств. 
     */
    export interface Options extends peDictionaryDropDown.Options {

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

export = peCorrespondentContact;