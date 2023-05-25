package ru.croc.ctp.cmf.demodms.document.domain

import java.util.ArrayList
import java.util.List
import javax.persistence.DiscriminatorValue
import javax.persistence.Table
import ru.croc.ctp.cmf.core.regnumber.PlaceholderResolverDefinition
import ru.croc.ctp.cmf.core.regnumber.TemplateResolverDefinition
import ru.croc.ctp.cmf.demodms.document.outgoing.impl.inboxitem.OutgoinDocumentInboxItemHandler
import ru.croc.ctp.cmf.demodms.document.outgoing.impl.process.OutgoingDocumentTaskAssigneeResolver
import ru.croc.ctp.cmf.demodms.document.outgoing.impl.regnumber.OutgoingDocumentPlaceholderResolver
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.approval.ApprovalProcessSupported
import ru.croc.ctp.cmf.dms.document.domain.AbstractDocument
import ru.croc.ctp.cmf.dms.document.TaskAssigneeResolver
import ru.croc.ctp.cmf.dms.regnumber.impl.DocumentTemplateResolver
import ru.croc.ctp.cmf.task.inboxitem.InboxItemProcessor
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWOneToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.generator.meta.XFWToString

import static extension ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentAddressee.FIELD_NAME_DOCUMENT

/**
 * Модель исходящего документа.
 */
@XFWObject
@XFWElementLabel("Исходящий документ")
@XFWToString(callSuper=true)
@Table(name=OutgoingDocument.TABLE_NAME)
@DiscriminatorValue(OutgoingDocument.DOCUMENT_TYPE_DISCRIMINATOR)
@InboxItemProcessor(OutgoinDocumentInboxItemHandler.NAME)
@TemplateResolverDefinition(DocumentTemplateResolver)
@PlaceholderResolverDefinition(OutgoingDocumentPlaceholderResolver)
@TaskAssigneeResolver(resolverClass=OutgoingDocumentTaskAssigneeResolver)
class OutgoingDocument extends AbstractDocument implements ApprovalProcessSupported {

    /**
     * Наименование таблицы хранения.
     * <p/>
     * В таблице хранится только часть, которая не хранится в родителе.
     */
    public static final String TABLE_NAME = "cmf_document_outgoing";

    /**
     * Значение идентификатора, означающего, что хранимое значение - тип документа.
     * @see ColumnName#COLUMN_DOCUMENT_DISCRIMINATOR
     */
    public static final String DOCUMENT_TYPE_DISCRIMINATOR = "outgoing";

    /**
     * Срочно.
     */
    @XFWElementLabel("Срочно")
    @XFWBasic(optional=false)
    Boolean urgent = false;

    /**
     * Бумажный носитель.
     */
    @XFWElementLabel("Бумажный носитель")
    @XFWBasic(optional=false)
    Boolean paper = false;

    /**
     * Исполнитель по документу.
     */
    @XFWManyToOne(fetch=EAGER, optional=true)
    @XFWElementLabel("Исполнитель")
    EmployeePosition performer;

    /**
     * Регистратор.
     */
    @XFWManyToOne(fetch=EAGER, optional=true)
    @XFWElementLabel("Регистратор")
    EmployeePosition registrator;

    /**
     * Подписант.
     */
    @XFWManyToOne(fetch=EAGER, optional=true)
    @XFWElementLabel("Подписант")
    EmployeePosition signatory;

    /**
     * Количество листов документа с признаком "Основной".
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Количество листов документа")
    Integer sheetsAmount;

    /**
     * Количество листов дополнительных файлов к документу.
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Количество листов приложения")
    Integer annexSheetsAmount;

    /**
     * Адресаты.
     */
    @XFWElementLabel("Адресаты")
    @XFWOneToMany(mappedBy=OutgoingDocumentAddressee.
        FIELD_NAME_DOCUMENT, targetEntity=OutgoingDocumentAddressee, fetch=LAZY, orphanRemoval=true)
    List<OutgoingDocumentAddressee> addressees = new ArrayList;
}
