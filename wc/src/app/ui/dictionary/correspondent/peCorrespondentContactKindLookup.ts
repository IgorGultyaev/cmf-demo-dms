import core = require( "core" );
import { IDataProvider } from "lib/ui/pe/peDropDownLookup";
import { DomainObject } from "lib/domain/.domain";
import PropertyEditor = require( "lib/ui/pe/PropertyEditor" );
import * as peDropDownWithInfo from "dms/modules/info/pe/peDropDownWithInfo";
import CorrespondentContactKindSelectorDataSource = require( "app/ui/dictionary/correspondent/CorrespondentContactKindSelectorDataSource" );

import Options = peCorrespondentContactKindLookup.Options;

/**
 * Редактор свойств, ссылающихся на вид контакта.
 * 
 * @author Dmitry Malenok
 */
class peCorrespondentContactKindLookup extends peDropDownWithInfo {

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
                return new peCorrespondentContactKindLookup( core.lang.extendEx( _options, { selectorName: selectorName }, { deep: true } ) );
            }
        };
    }

    /**
     * Конструктор.
     * 
     * @param options параметры редактора свойств
     */
    constructor( options?: Options ) {
        super( peCorrespondentContactKindLookup.mixOptions( options,
            peCorrespondentContactKindLookup.DEFAULT_OPTIONS ) );
    }

    /**
     * @inheritDoc
     */
    protected createDataProvider(): IDataProvider<DomainObject, any> {
        if ( !this.options.dataSource ) {
            this.options.selectorOptions = this.options.selectorOptions || {};
            this.options.dataSource = this.options.selectorOptions.dataSource ||
                new CorrespondentContactKindSelectorDataSource( this.app, {
                    contactTypeId: this.options.contactTypeId
                } );
            this.options.selectorOptions.dataSource = this.options.selectorOptions.dataSource ||
                this.options.dataSource;
        }
        return super.createDataProvider();
    }
}

namespace peCorrespondentContactKindLookup {

    /**
     * Параметры редактора свойств по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        showInfoButton: false
    }

    /**
     * Интерфейс параметров редактора свойств. 
     */
    export interface Options extends peDropDownWithInfo.Options {

        /**
         * Идентификатор типа контакта, для которого выбирается вид. 
         */
        contactTypeId?: string;
    }
}

export = peCorrespondentContactKindLookup;