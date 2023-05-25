package ru.croc.ctp.cmf.demodms.document.contract.journal.domain

import java.math.BigDecimal
import java.time.LocalDate
import javax.annotation.Nullable
import ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.Contractor
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractState
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.domain.DocumentStatus
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Фильтр журнала документов Договор.
 */
@XFWObject(persistence = TRANSIENT)
class ContractDocumentJournalFilter {

    /**
     * Организация.
     */
    @XFWElementLabel("Организация")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    Company organization;

    /**
     * Контрагент.
     */
    @XFWElementLabel("Контрагент")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    Contractor contractor;

    /**
     * Статус.
     */
    @XFWElementLabel("Статус")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    DocumentStatus status;

    /**
     * Состояние договора.
     */
    @XFWElementLabel("Состояние договора")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    ContractState contractState;

    /**
     * Предмет договора.
     */
    @XFWElementLabel("Предмет договора")
    @Nullable
    String summary;

    /**
     * Сумма договора "от".
     */
    @XFWElementLabel("Сумма договора от")
    @Nullable
    BigDecimal costFrom;

    /**
     * Сумма договора "до".
     */
    @XFWElementLabel("до")
    @Nullable
    BigDecimal costTo;

    /**
     * Дата создания "с".
     */
    @XFWElementLabel("Дата создания с")
    @Nullable
    LocalDate creationDateFrom;

    /**
     * Дата создания "по".
     */
    @XFWElementLabel("по")
    @Nullable
    LocalDate creationDateTo;

    /**
     * Дата подписания "с".
     */
    @XFWElementLabel("Дата подписания с")
    @Nullable
    LocalDate signingDateFrom;

    /**
     * Дата подписания "по".
     */
    @XFWElementLabel("по")
    @Nullable
    LocalDate signingDateTo;

    /**
     * Исполнитель проекта.
     */
    @XFWElementLabel("Исполнитель проекта")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    EmployeePosition performer;

    /**
     * Куратор.
     */
    @XFWElementLabel("Куратор")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    EmployeePosition curator;

    /**
     * Подписант.
     */
    @XFWElementLabel("Подписант")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    EmployeePosition signatory;

    /**
     * Сделка с заинтересованностью.
     */
    @XFWElementLabel("Сделка с заинтересованностью")
    @Nullable
    Boolean dealWithInterest;

    /**
     * Крупная сделка.
     */
    @XFWElementLabel("Крупная сделка")
    @Nullable
    Boolean bigDeal;

    /**
     * Существенная сделка.
     */
    @XFWElementLabel("Существенная сделка")
    @Nullable
    Boolean greatlyDeal;

}
