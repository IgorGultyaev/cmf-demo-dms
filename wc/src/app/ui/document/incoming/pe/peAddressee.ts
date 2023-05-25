import core = require( "core" );
import {EmployeePosition, IncomingDocumentAddressee} from "app/domain/model-classes";
import * as peObjectListWithDropDownSelector from "dms/modules/info/pe/peObjectListWithDropDownSelector";

/**
 *  Редактор списка адресатов.
 */
class peAddressee extends peObjectListWithDropDownSelector {
    /**
     * Переопределение типа опций редактора.
     */
    options: peAddressee.Options;

    /**
     * Конструктор.
     *
     * @param options параметры списка.
     */
    constructor(options?: peAddressee.Options) {
        const _options = peAddressee.mixOptions(options, peAddressee.DEFAULT_OPTIONS);
        super(_options);
    }

}

namespace peAddressee {

    /**
     * Набор параметров по умолчанию.
     */
    export const DEFAULT_OPTIONS: Options = {
        selectorComponentOptions: {
            entityType: EmployeePosition.meta.name,
            ref: EmployeePosition.meta.name,
            showInfoButton: false
        },
        valueSetter: function (container: IncomingDocumentAddressee, value: EmployeePosition) {
            if (!this.items.all().some((addressee) => addressee.addressee().id == value.id)) {
                container.addressee(value);
                return true
            }
            return false;
        },
        infoValueConverter: function (value: IncomingDocumentAddressee): any {
            return value.addressee();
        }
    };

    /**
     * Интерфейс параметров компонента.
     */
    export interface Options extends peObjectListWithDropDownSelector.Options {

    }
}

core.ui.PropertyEditor.DefaultMapping.register(function (propMd) {
    const refName = IncomingDocumentAddressee.meta.name;
    return propMd.many && (!!propMd.ref && (propMd.ref === refName || propMd.ref.name === refName)) ?
        peAddressee : null;
}, {priority: 30});

export = peAddressee;