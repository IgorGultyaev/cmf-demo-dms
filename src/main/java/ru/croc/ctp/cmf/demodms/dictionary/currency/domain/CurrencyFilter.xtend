package ru.croc.ctp.cmf.demodms.dictionary.currency.domain

import javax.annotation.Nullable
import javax.persistence.Column;
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject


/**
 * Фильтр валют.
 */
@XFWObject(persistence = TRANSIENT)
class CurrencyFilter {

    /**
     * Подстрока, по которой производится фильтрация валюты (по Коду, Наименованию, Обозначению).
     */
    @XFWElementLabel("Строка поиска")
    @Nullable
    String searchString;

    /**
     * Флаг, указывающий необходимость выдачи удалённых сущностей.
     */
    @XFWElementLabel("Отображать удаленные записи")
    @Column(nullable=false)
    @XFWDefaultValue(value="false")
    Boolean allowDeleted;
    
}
