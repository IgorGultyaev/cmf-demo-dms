package ru.croc.ctp.cmf.demodms.document.incoming.domain;

import java.time.LocalDate
import java.util.ArrayList
import java.util.List
import javax.persistence.Column
import javax.persistence.DiscriminatorValue
import javax.persistence.Table
import ru.croc.ctp.cmf.core.regnumber.PlaceholderResolverDefinition
import ru.croc.ctp.cmf.core.regnumber.TemplateResolverDefinition
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent
import ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.DeliveryOption
import ru.croc.ctp.cmf.demodms.document.incoming.impl.inboxitem.IncomingDocumentInboxItemHandler
import ru.croc.ctp.cmf.demodms.document.incoming.regnumber.IncomingDocumentPlaceholderResolver
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.domain.AbstractDocument
import ru.croc.ctp.cmf.dms.regnumber.impl.DocumentTemplateResolver
import ru.croc.ctp.cmf.task.inboxitem.InboxItemProcessor
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWOneToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.generator.meta.XFWToString

import static ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddressee.FieldName.IDA_FIELD_DOCUMENT

/**
 * Модель входящего документа.
 * <p/> 
 * TODO: разобраться, какие поля updatable, и где какой fetch type
 */
@XFWObject
@XFWElementLabel("Входящий документ")
@XFWToString(callSuper = true)
@Table(name = IncomingDocument.TABLE_NAME)
@DiscriminatorValue(IncomingDocument.DOCUMENT_TYPE_DISCRIMINATOR)
@TemplateResolverDefinition(DocumentTemplateResolver)
@PlaceholderResolverDefinition(IncomingDocumentPlaceholderResolver)
@InboxItemProcessor(IncomingDocumentInboxItemHandler.NAME)
class IncomingDocument extends AbstractDocument {

    /**
     * Наименование таблицы хранения.
     * <p/>
     * В таблице хранится только часть, которая не хранится в родителе.
     */
    public static final String TABLE_NAME = "cmf_document_incoming";

    /**
     * Значение идентификатора, означающего, что хранимое значение - тип документа.
     * 
     * @see ColumnName#COLUMN_DOCUMENT_DISCRIMINATOR
     */
    public static final String DOCUMENT_TYPE_DISCRIMINATOR = "incoming";

    /**
     * Номер поступившего конверта/накладной.
     */
    @XFWElementLabel("Номер конверта/накладной")
    String envelopeNumber;

    /**
     * Дата поступления корреспонденции в организацию.
     */
    @XFWElementLabel("Дата поступления")
    LocalDate incomingDate;

    /**
     * Способ доставки.
     */
    @XFWElementLabel("Способ доставки")
    @XFWManyToOne(optional = true)
    DeliveryOption deliveryOption;

    /**
     * Исходящий номер корреспонденции.
     */
    @XFWElementLabel("Исходящий номер")
    String referenceNumber;

    /**
     * Исходящая дата документа.
     */
    @XFWElementLabel("Исходящая дата")
    LocalDate referenceDate;

    /**
     * Корреспондент – либо организация, не подключенное к Системе, либо сторонняя организация.
     */
    @XFWElementLabel("Корреспондент")
    @XFWManyToOne
    AbstractCorrespondent correspondentExternal;

    /**
     * Лицо, подписавшее документ.
     */
    @XFWElementLabel("Подписал")
    String signedByExternal;

    /**
     * Работник, инициировавший регистрацию документа.
     */
    @XFWElementLabel("Регистратор")
    @XFWManyToOne(optional = false)
    EmployeePosition registrator;

    /**
     * Количество листов документа с признаком "Основной".
     */
    @XFWElementLabel("Количество листов документа")
    Integer sheetsAmount;

    /**
     * Количество листов дополнительных файлов к документу.
     */
    @XFWElementLabel("Количество листов приложения")
    Integer annexSheetsAmount;

    /**
     * Срок исполнения документа.
     */
    @XFWElementLabel("Срок исполнения")
    @Column
    LocalDate reviewDeadlineDate;

    /**
     * Адресат корреспонденции.
     */
    @XFWElementLabel("Адресаты")
    @XFWOneToMany(mappedBy=IDA_FIELD_DOCUMENT, orphanRemoval=true)
    List<IncomingDocumentAddressee> addressees = new ArrayList;
}
