package ru.croc.ctp.cmf.demodms.dictionary.contractor.domain

import javax.annotation.Nullable
import javax.persistence.Column;
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Фильтр контрагентов.
 */
@XFWObject(persistence = TRANSIENT)
class ContractorFilter {

    /**
     * Подстрока, по которой производится фильтрация контрагента (по всем полям).
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
