import * as core from "core";
import { Application } from "core";
import { DeliveryOption } from "app/domain/model-classes";
import { DictionarySecurityOperationsMixin } from "dms/modules/dictionary/security/DictionarySecurityOperationsMixin";
import * as DictionaryObjectList from "dms/modules/dictionary/common/DictionaryObjectList";

/**
 * Список объектов DeliveryOption.
 */
class DeliveryOptionList extends DictionaryObjectList implements DictionarySecurityOperationsMixin {

    /**
     * Имя парта.
     */
    static PART_NAME: string = "ObjectList:"+DeliveryOption.meta.name;

    /**
     * Опции по умолчанию.
     */
    static DEFAULT_OPTIONS: DeliveryOptionList.Options = {
        entityType: DeliveryOption.meta.name,
        filter: "ObjectFilter:"+DeliveryOption.meta.name,
        columns: [ DictionaryObjectList.DELETED_COLUMN,
            { name: DeliveryOption.meta.props.name.name },
            { name: DeliveryOption.meta.props.deliveryType.name }
        ]
    };

    /**
     * Опции компонента.
     */
    options: DeliveryOptionList.Options;

    /**
     * Тип модели.
     */
    viewModel: DeliveryOption;

    /**
     * Текущий выбранный элемент. 
     */
    @core.lang.decorators.observableAccessor()
    activeItem: core.lang.ObservableProperty<DeliveryOption>;

    /**
     * @constructor
     * @param app текущий экземпляр приложения.
     * @param options Опции компонента.
     */
    constructor( app: Application, options?: DeliveryOptionList.Options ) {
        super( app, DeliveryOptionList.mixOptions( options, DeliveryOptionList.DEFAULT_OPTIONS) );
    }


    /**
     * @inheritDoc
     */
    protected getFilterRestrictions(): any {
        let result = super.getFilterRestrictions();
        if ( result && result.deleted && result.deleted.eq ) {
            delete result.deleted;
        } else {
            result = result || {};
            result.deleted = result.deleted || {}
            result.deleted.eq = false;
        }
        return result;
    }

    /**
     * @inheritDoc
     */
    protected createCommands(): core.commands.ICommandLazyMap {
        const result = super.createCommands();
        return result;
    }

    /**
     * @inheritDoc
     */
    protected canEdit(): boolean {
        return super.canEdit() && !this.activeItem().systemName();
    }
    
    /**
     * @inheritDoc
     */
    protected canMarkDeleted() {
        return super.canMarkDeleted() && !this.activeItem().systemName();
    }

    /**
     * @inheritDoc
     */
    protected canRestore() {
        return super.canRestore() && !this.activeItem().systemName();
    }
}

interface DeliveryOptionList extends DictionarySecurityOperationsMixin { };

DictionarySecurityOperationsMixin.mixinTo( DeliveryOptionList );

namespace DeliveryOptionList {
    /**
     * Интерфейс опций компонента.
     */
    export interface Options extends DictionaryObjectList.Options {

    }
}

export = DeliveryOptionList;

core.createModule( ( app: Application ) => {
    app.registerPart( DeliveryOptionList.PART_NAME, ( options?: DeliveryOptionList.Options ) => {
        return new DeliveryOptionList( app, options );
    } );
} );

