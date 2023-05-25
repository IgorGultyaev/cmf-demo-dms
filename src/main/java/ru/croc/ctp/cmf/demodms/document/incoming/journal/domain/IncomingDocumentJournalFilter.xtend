package ru.croc.ctp.cmf.demodms.document.incoming.journal.domain;

import java.time.LocalDate
import javax.annotation.Nullable
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent
import ru.croc.ctp.cmf.dms.dictionary.nomenclature.domain.NomenclatureCase
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.Company
import ru.croc.ctp.cmf.dms.document.domain.DocumentStatus
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Фильтр журнала входящих документов. Объект используется для передачи данных между клиентом и источником данных..
 */
@XFWObject(persistence = TRANSIENT)
class IncomingDocumentJournalFilter {

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
     * Номер поступившего конверта/накладной.
     */
    @XFWElementLabel("Номер конверта/накладной")
    String envelopeNumber;

    /**
     * Исходящий номер корреспонденции.
     */
    @XFWElementLabel("Исходящий номер")
    String referenceNumber;

    /**
     * Корреспондент – либо организация, не подключенное к Системе, либо сторонняя организация.
     */
    @XFWElementLabel("Корреспондент")
    @XFWManyToOne
    AbstractCorrespondent correspondentExternal;

    /**
     * Организация, выпускающая документ.
     */
    @XFWElementLabel("Организация")
    @XFWManyToOne(fetch = EAGER)
    Company organization;

    /**
     * Номенклатурное дело.
     */
    @XFWElementLabel("Номенклатурное дело")
    @XFWManyToOne(fetch = EAGER)
    NomenclatureCase nomenclatureCase;
}
