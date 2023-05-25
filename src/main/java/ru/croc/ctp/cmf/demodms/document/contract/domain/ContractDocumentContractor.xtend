package ru.croc.ctp.cmf.demodms.document.contract.domain

import java.time.LocalDate
import java.time.ZonedDateTime
import javax.annotation.Nullable
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Index
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.Contractor
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly
import ru.croc.ctp.cmf.security.permission.AclSupported

/**
 * Модель Контрагента для документа Договор.
 */
@XFWObject
@Table(name=ContractDocumentContractor.TABLE_NAME, indexes=#[
    @Index(columnList=ContractDocumentContractor$Property.ACL_ID)])
@XFWElementLabel("Контрагент договора")
@EntityListeners(AuditingEntityListener)
class ContractDocumentContractor implements AclSupported<String> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_contract_document_contractor";

    /**
     * Документ Договор, для которого задается Контрагмент.
     */
    @XFWElementLabel("Документ")
    @XFWManyToOne(fetch=LAZY, optional=false)
    ContractDocument document;

    /**
     * Контрагент.
     */
    @XFWElementLabel("Контрагент")
    @XFWManyToOne(fetch=EAGER, optional=false)
    Contractor contractor;

    /**
     * Номер.
     */
    @XFWElementLabel("Номер")
    @Column(length=128)
    String number

    /**
     * Дата.
     */
    @XFWElementLabel("Дата")
    @Nullable
    LocalDate signingDate;

    /**
     * Подписал.
    */
    @XFWElementLabel("Подписал")
    @Column(length=1024)
    String signerName

    /**
     * Доверенность.
     */
    @XFWElementLabel("Доверенность")
    @Column(length=128)
    String warrantName

    /**
     * Идентификатор ACL.
     */
    @XFWBasic(optional=false)
    String aclId;

    /**
     * Дата создания сущности.
     */
    @XFWElementLabel("Дата создания")
    @XFWReadOnly
    @Column(nullable=false, updatable=false)
    @CreatedDate
    ZonedDateTime creationTime

    /**
     * Время последней модификации сущности.
     */
    @XFWElementLabel("Время последней модификации")
    @XFWReadOnly
    @Column(nullable=false)
    @LastModifiedDate
    ZonedDateTime lastModifiedTime;
}
