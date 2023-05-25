package ru.croc.ctp.cmf.demodms.document.incoming.domain;

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.security.permission.AclSupported
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Адресат входящего документа.
 */
@XFWObject
@XFWElementLabel("Адресат входящего документа")
@Table(name=IncomingDocumentAddressee.TABLE_NAME)
@EntityListeners(AuditingEntityListener)
class IncomingDocumentAddressee implements AclSupported<String> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_document_incoming_adressee";

    /**
     * Класс констант, содержащих наименования полей {@link IncomingDocumentAddressee}.
     * <p/>
     * В основном предназначен для организации ссылок. 
     */
    static class FieldName {

        /**
         * {@link IncomingDocumentAddressee#document}. 
         */
        public static final String IDA_FIELD_DOCUMENT = "document";
    }

    /**
     * Документ, адресат которого задан в объекте.
     */
    @XFWElementLabel("Документ")
    @XFWManyToOne(optional=false, fetch=EAGER)
    IncomingDocument document;

    /**
     * Ссылка на сотрудника в должности, которому адресован документ.
     */
    @XFWElementLabel("Адресат")
    @XFWManyToOne(optional=false)
    EmployeePosition addressee;

    /**
     * Состояние рассмотрения по адресату. Поле не выводится.
     */
    @XFWElementLabel("Состояние рассмотрения")
    @Column(nullable=false)
    IncomingDocumentAddresseeStatus incomingDocumentAddresseeStatus = IncomingDocumentAddresseeStatus.IDAS_NEW;

    /**
     * Идентификатор ACL.
     */
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
     * Время последней модификации сущности. Поле не выводится.
     */
    @XFWElementLabel("Время последней модификации")
    @XFWReadOnly
    @Column(nullable=false)
    @LastModifiedDate
    ZonedDateTime lastModifiedTime;
}
