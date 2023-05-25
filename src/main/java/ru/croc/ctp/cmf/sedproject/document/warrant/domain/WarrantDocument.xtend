package ru.croc.ctp.cmf.sedproject.document.warrant.domain;

import java.time.Duration
import java.time.LocalDate
import javax.persistence.DiscriminatorValue
import javax.persistence.Table
import ru.croc.ctp.cmf.core.regnumber.PlaceholderResolverDefinition
import ru.croc.ctp.cmf.core.regnumber.TemplateResolverDefinition
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.approval.ApprovalProcessSupported
import ru.croc.ctp.cmf.dms.document.domain.AbstractDocument
import ru.croc.ctp.cmf.dms.document.TaskAssigneeResolver
import ru.croc.ctp.cmf.dms.regnumber.impl.DocumentTemplateResolver
import ru.croc.ctp.cmf.sedproject.document.warrant.impl.inboxitem.WarrantInboxItemHandler
import ru.croc.ctp.cmf.sedproject.document.warrant.impl.process.WarrantTaskAssigneeResolver
import ru.croc.ctp.cmf.sedproject.document.warrant.regnumber.WarrantPlaceholderResolver
import ru.croc.ctp.cmf.task.inboxitem.InboxItemProcessor
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.generator.meta.XFWToString

/**
 * Модель доверенности.
 */
@XFWObject
@XFWElementLabel("Доверенность")
@XFWToString(callSuper = true)
@Table(name = WarrantDocument.TABLE_NAME)
@DiscriminatorValue(WarrantDocument.DOCUMENT_TYPE_DISCRIMINATOR)
@TaskAssigneeResolver(resolverClass = WarrantTaskAssigneeResolver)
@InboxItemProcessor(WarrantInboxItemHandler.NAME)
@PlaceholderResolverDefinition(WarrantPlaceholderResolver)
@TemplateResolverDefinition(DocumentTemplateResolver)
class WarrantDocument extends AbstractDocument implements ApprovalProcessSupported {

    /**
     * Наименование таблицы хранения.
     * <p/>
     * В таблице хранится только часть, которая не хранится в родителе.
     */
    public static final String TABLE_NAME = "cmf_document_warrant";

    /**
     * Значение идентификатора, означающего, что хранимое значение - тип документа.
     * 
     * @see ColumnName#COLUMN_DOCUMENT_DISCRIMINATOR
     */
    public static final String DOCUMENT_TYPE_DISCRIMINATOR = "warrant";

    /**
     * Требуется нотиральное заверение.
     */
    @XFWElementLabel("Требуется нотиральное заверение")
    @XFWBasic(optional = false)
    Boolean notarizationRequired = false;

    /**
     * Исполнитель по документу.
     */
    @XFWManyToOne(fetch = EAGER, optional = true)
    @XFWElementLabel("Исполнитель")
    EmployeePosition performer;

    /**
     * Регистратор.
     */
    @XFWManyToOne(fetch = EAGER, optional = true)
    @XFWElementLabel("Регистратор")
    EmployeePosition registrator;

    /**
     * Доверитель.
     */
    @XFWManyToOne(fetch = EAGER, optional = true)
    @XFWElementLabel("Доверитель")
    EmployeePosition principal;

    /**
     * Доверенное лицо.
     */
    @XFWManyToOne(fetch = EAGER, optional = true)
    @XFWElementLabel("Доверенное лицо")
    EmployeePosition confidant;

    /**
     * Дата начала действия.
     */
    @XFWElementLabel("Дата начала действия")
    LocalDate startDate;

    /**
     * Срок действия.
     */
    @XFWElementLabel("Срок действия")
    Duration period;

    /**
     * Количество листов документа с признаком "Основной".
     */
    @XFWElementLabel("Количество листов документа")
    Integer sheetsAmount;
}