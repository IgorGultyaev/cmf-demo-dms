package ru.croc.ctp.cmf.demodms.document.domain

import java.time.LocalDate
import javax.annotation.Nullable
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent
import ru.croc.ctp.cmf.dms.dictionary.nomenclature.domain.NomenclatureCase
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.domain.DocumentStatus
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Фильтр журнала исходящих документов.
 */
@XFWObject(persistence = TRANSIENT)
class OutgoingDocumentJournalFilter {

    /**
     * Рег. номер.
     */
    @XFWElementLabel("Рег. номер")
    @Nullable
    String regNumber;

    /**
     * Идентификатор.
     */
    @XFWElementLabel("Идентификатор")
    @Nullable
    String identifier;

    /**
     * Краткое содержание.
     */
    @XFWElementLabel("Краткое содержание")
    @Nullable
    String summary;

    /**
     * Статус.
     */
    @XFWElementLabel("Статус")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    DocumentStatus status;

    /**
     * Исполнитель.
     */
    @XFWElementLabel("Исполнитель")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    EmployeePosition performer;

    /**
     * Дата регистрации "с".
     */
    @XFWElementLabel("Дата регистрации")
    @Nullable
    LocalDate regDateFrom;

    /**
     * Дата регистрации "по".
     */
    @XFWElementLabel("по")
    @Nullable
    LocalDate regDateTo;

    /**
     * Дата создания "с".
     */
    @XFWElementLabel("Дата создания")
    @Nullable
    LocalDate createdFrom;

    /**
     * Дата создания "по".
     */
    @XFWElementLabel("по")
    @Nullable
    LocalDate createdTo;

    /**
     * Адресат (внешний).
     */
    @XFWElementLabel("Адресат (внешний)")
    @XFWManyToOne(fetch=EAGER)
    @Nullable
    AbstractCorrespondent correspondent;
    
    /**
     * Номенклатурное дело.
     */
    @XFWElementLabel("Номенклатурное дело")
    @XFWManyToOne(fetch = EAGER)
    NomenclatureCase nomenclatureCase;
}
