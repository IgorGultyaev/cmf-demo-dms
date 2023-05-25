package ru.croc.ctp.cmf.demodms.document.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Index
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.CorrespondentAddress
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.CorrespondentContactDefault
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.DeliveryOption
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly
import ru.croc.ctp.cmf.security.permission.AclSupported

/**
 * Модель адресата исходящего документа для компонента "Адресаты исходящего".
 */
@XFWObject
@Table(name=OutgoingDocumentAddressee.TABLE_NAME, indexes=#[@Index(columnList=ColumnName.ODACN_ACL_ID)])
@XFWElementLabel("Адресат исходящего документа")
@EntityListeners(AuditingEntityListener)
class OutgoingDocumentAddressee implements AclSupported<String> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_outgoing_document_addressee";

    /**
     * Наименование поля класса {@link OutgoingDocumentAddressee#document}.
     */
    public final static String FIELD_NAME_DOCUMENT = "document";

    /**
     * Класс констант, содержащих наименования колонок {@link OutgoingDocumentAddressee#TABLE_NAME}.
     */
    static class ColumnName {

        /**
         * {@link OutgoingDocumentAddressee#aclId}.
         */
        public static final String ODACN_ACL_ID = "acl_id";
    }

    /**
     * Исходящий документ, для которого задается адресат.
     */
    @XFWElementLabel("Документ")
    @XFWManyToOne(fetch=LAZY, optional=false)
    OutgoingDocument document;

    /**
     * Способ доставки.
     */
    @XFWElementLabel("Способ доставки")
    @XFWManyToOne(fetch=EAGER, optional=false)
    DeliveryOption deliveryOption;

    /**
     * Адресат.
     */
    @XFWElementLabel("Адресат")
    @XFWManyToOne(fetch=EAGER, optional=false)
    AbstractCorrespondent correspondent;

    /**
     * Адрес.
     */
    @XFWElementLabel("Адрес")
    @XFWManyToOne(fetch=EAGER, optional=true)
    CorrespondentAddress address;

    /**
     * Факс.
     */
    @XFWElementLabel("Факс")
    @XFWManyToOne(fetch=EAGER, optional=true)
    CorrespondentContactDefault fax;

    /**
     * E-mail.
     */
    @XFWElementLabel("E-mail")
    @XFWManyToOne(fetch=EAGER, optional=true)
    CorrespondentContactDefault email;

    /**
     * Статус отправки.
     */
    @XFWElementLabel("Статус отправки")
    @XFWBasic(optional=false)
    OutgoingDocumentDeliveryStatus deliveryStatus = OutgoingDocumentDeliveryStatus.EMPTY;

    /**
     * Идентификатор ACL.
     */
    @Column(name=ColumnName.ODACN_ACL_ID)
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
