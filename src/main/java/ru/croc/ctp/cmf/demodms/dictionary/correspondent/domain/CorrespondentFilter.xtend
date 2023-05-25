package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import javax.persistence.Column;

/**
 * Фильтр для справочника "Корреспонденты"
 *
 * @author Mikhail Kondratev
 */
@XFWObject(persistence = TRANSIENT)
class CorrespondentFilter {
    /**
    * Наименование корреспондента.
    */
    @XFWElementLabel("Наименование")
    String name

    /**
     * Отображать ли удаленные записи
     */
    @XFWElementLabel("Отображать удаленные записи")
    @Column(nullable=false)
    @XFWDefaultValue(value="false")
    Boolean deleted
}
