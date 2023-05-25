package ru.croc.ctp.cmf.demodms.dictionary.contractor.domain

import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.CompanyCorrespondent
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Параметры создания контрагента.
 */
@XFWObject(persistence = TRANSIENT)
@XFWElementLabel("Создание контрагента")
class ContractorCreationParams {

    /**
     * Корреспондент.
     * <p/>
     * Только "Юридическое лицо".
     */
    @XFWManyToOne
    @XFWElementLabel("Корреспондент")
    CompanyCorrespondent correspondent;

}
