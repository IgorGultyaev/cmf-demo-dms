package ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain;

import java.time.Duration
import java.time.LocalDate
import javax.annotation.Nullable
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company
import ru.croc.ctp.cmf.dms.document.domain.DocumentStatus
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Фильтр журнала Доверенностей. Объект используется для передачи данных между клиентом и источником данных..
 */
@XFWObject(persistence = TRANSIENT)
class WarrantJournalFilter {

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
    @XFWManyToOne(fetch = EAGER)
    @Nullable
    DocumentStatus status;

    /**
     * Дата начала действия.
     */
    @XFWElementLabel("Действует с")
    @Nullable
    LocalDate startDate;

    /**
     * Организация, выпускающая документ.
     */
    @XFWElementLabel("Организация")
    @XFWManyToOne(fetch = EAGER)
    Company organization;

    /**
     * Срок действия.
     */
    @XFWElementLabel(value = "Срок действия")
    Duration period;
}
