import core = require( "core" );
import DataSource = require( "lib/data/DataSource" );
import { LoadQuerySpec, LoadOptions, LoadResponse } from "lib/interop/.interop";
import { CorrespondentContactKind } from "app/domain/model-classes";

import Options = CorrespondentContactKindSelectorDataSource.Options;

/**
 * Источник данных для выбора вида контакта.
 * 
 * @author Dmitry Malenok
 */
class CorrespondentContactKindSelectorDataSource extends DataSource {

    /**
     * Параметры компонента.
     * 
     * Переопределено для расширения.
     */
    options: Options;

    /**
     * Идентификатор типа контакта, для которого выбирается вид. 
     */
    protected contactTypeId?: string;

    /**
     * Конструктор.
     * 
     * @param app приложение
     * @param options параметры источника данных
     */
    constructor( app: core.IApplication, options?: Options ) {
        const _options = core.lang.appendEx( options || {},
            CorrespondentContactKindSelectorDataSource.DEFAULT_OPTIONS, { deep: true } );
        super( app, _options );
        this.contactTypeId = _options.contactTypeId;
    };

    /**
     * @inheritDoc
     * Стандартый контроллер не умеет фильтровать по массивному навигируемому полю, потому сделали так, т.к. значений
     * мало. 
     */
    load( query?: LoadQuerySpec, options?: LoadOptions ): core.lang.Promise<LoadResponse> {
        return super._load( query, options ).then( result => {
            if ( this.contactTypeId ) {
                result.result = result.result.filter( ( item ) =>
                    item.contactTypes.some( ( typeId ) => this.contactTypeId == typeId ) );
            }
            return result;
        } );
    }
}

namespace CorrespondentContactKindSelectorDataSource {

    /**
     * Параметры источника данных по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        name: CorrespondentContactKind.meta.name,
        entityType: CorrespondentContactKind.meta.name,
        supportQuery: false,
        preloads: [CorrespondentContactKind.meta.props.contactTypes.name]
    }

    /**
     * Интерфейс параметров источника данных. 
     */
    export interface Options extends DataSource.Options {

        /**
         * Идентификатор типа контакта, для которого выбирается вид. 
         */
        contactTypeId?: string;
    }
}

export = CorrespondentContactKindSelectorDataSource;