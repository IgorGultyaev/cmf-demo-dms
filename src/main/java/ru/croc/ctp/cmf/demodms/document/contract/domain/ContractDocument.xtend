package ru.croc.ctp.cmf.demodms.document.contract.domain

import java.math.BigDecimal
import java.time.LocalDate
import java.util.ArrayList
import java.util.List
import javax.annotation.Nullable
import javax.persistence.Column
import javax.persistence.DiscriminatorValue
import javax.persistence.Index
import javax.persistence.Table
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import ru.croc.ctp.cmf.core.regnumber.PlaceholderResolverDefinition
import ru.croc.ctp.cmf.core.regnumber.TemplateResolverDefinition
import ru.croc.ctp.cmf.demodms.dictionary.currency.domain.Currency
import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.ContractRevokeReason
import ru.croc.ctp.cmf.demodms.document.contract.impl.inboxitem.ContractDocumentInboxItemHandler
import ru.croc.ctp.cmf.demodms.document.contract.regnumber.ContractDocumentPlaceholderResolver
import ru.croc.ctp.cmf.dms.dictionary.documenttype.domain.DocumentTemplate
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.domain.EmployeePosition
import ru.croc.ctp.cmf.dms.document.approval.ApprovalProcessSupported
import ru.croc.ctp.cmf.dms.document.domain.AbstractDocument
import ru.croc.ctp.cmf.dms.regnumber.impl.DocumentTemplateResolver
import ru.croc.ctp.cmf.task.inboxitem.InboxItemProcessor
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWOneToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.generator.meta.XFWToString

/**
 * Модель документа Договор.
 */
@SuppressFBWarnings("CC_CYCLOMATIC_COMPLEXITY") // Из-за большого количества полей генерируются большие методы getCurrentValue и obtainValueByPropertyName
@XFWObject
@XFWElementLabel("Договор")
@XFWElementLabel(propName=AbstractDocument$Property.DOCUMENT_TYPE, value="Подтип документа")
@XFWElementLabel(propName=AbstractDocument$Property.SUMMARY, value="Предмет договора")
@XFWToString(callSuper=true)
@Table(name=ContractDocument.TABLE_NAME, indexes=#[
    @Index(columnList=ContractDocument$Property.CONTRACT_STATE),
    @Index(columnList=ContractDocument$Property.COST),
    @Index(columnList=ContractDocument$Property.SIGNING_DATE),
    @Index(columnList=ContractDocument$Property.DEAL_WITH_INTEREST),
    @Index(columnList=ContractDocument$Property.BIG_DEAL),
    @Index(columnList=ContractDocument$Property.GREATLY_DEAL)])
@DiscriminatorValue(ContractDocument.DOCUMENT_TYPE_DISCRIMINATOR)
@InboxItemProcessor(ContractDocumentInboxItemHandler.NAME)
@TemplateResolverDefinition(DocumentTemplateResolver)
@PlaceholderResolverDefinition(ContractDocumentPlaceholderResolver)
class ContractDocument extends AbstractDocument implements ApprovalProcessSupported {

    /**
     * Наименование таблицы хранения.
     * <p/>
     * В таблице хранится только часть, которая не хранится в родителе.
     */
    public static final String TABLE_NAME = "cmf_document_contract";

    /**
     * Значение идентификатора, означающего, что хранимое значение - тип документа.
     * @see ColumnName#COLUMN_DOCUMENT_DISCRIMINATOR
     */
    public static final String DOCUMENT_TYPE_DISCRIMINATOR = "contract";

    /**
     * Создан на основании.
     */
    @XFWElementLabel("Создан на основании")
    @XFWManyToOne(fetch=LAZY)
    DocumentTemplate createdBasedOn;

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
    @XFWDefaultValue(value="true")
    Boolean paper = true;

    /**
     * Исполнитель проекта.
     */
    @XFWManyToOne(fetch=EAGER, optional=true)
    @XFWElementLabel("Исполнитель проекта")
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
     * Количество листов договора.
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Количество листов")
    Integer sheetsAmount;

    /**
     * Количество листов приложения договора.
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Количество листов приложения")
    Integer annexSheetsAmount;

    /**
     * Контрагенты.
     */
    @XFWElementLabel("Контрагенты")
    @XFWOneToMany(mappedBy=ContractDocumentContractor$Property.DOCUMENT,
        targetEntity=ContractDocumentContractor, fetch=LAZY, orphanRemoval=true)
    List<ContractDocumentContractor> contractors = new ArrayList;

    /**
     * Подготовлен контрагентом.
     */
    @XFWElementLabel("Подготовлен контрагентом")
    @XFWBasic(optional=false)
    Boolean preparedByContractor = false;

    /**
     * Протокол разногласий.
     */
    @XFWElementLabel("Протокол разногласий")
    @XFWBasic(optional=false)
    Boolean protocolDisagreements = false;

    /**
     * Протокол урегулирования разногласий.
     */
    @XFWElementLabel("Протокол урег. разногласий")
    @XFWBasic(optional=false)
    Boolean protocolApproveDisagreements = false;

    /**
     * Стоимость.
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Стоимость")
    BigDecimal cost;

    /**
     * Валюта.
     */
    @XFWElementLabel("Валюта")
    @XFWManyToOne(fetch=EAGER)
    Currency currency;

    /**
     * Стоимость в рублях.
     */
    @XFWBasic(optional=true)
    @XFWElementLabel("Стоимость в рублях")
    BigDecimal costRub;

    /**
     * Доходный/расходный.
     */
    @XFWElementLabel("Доходный/расходный")
    ContractSettlementType settlementType;

    /**
     * Состояние договора.
     * <p/>
     * Не путать с состоянием ЖЦ документа!
     */
    @XFWElementLabel("Состояние договора")
    ContractState contractState;

    /**
     * Дата заключения.
     */
    @XFWElementLabel("Дата заключения")
    @Nullable
    LocalDate agreementDate;

    /**
     * Действует с.
     */
    @XFWElementLabel("Действует с")
    @Nullable
    LocalDate durationFromDate;

    /**
     * Действует по.
     */
    @XFWElementLabel("Действует по")
    @Nullable
    LocalDate durationToDate;

    /**
     * Фактическая дата окончания.
     */
    @XFWElementLabel("Фактическая дата окончания")
    @Nullable
    LocalDate completedDate;

    /**
     * Условие вступления в силу.
     */
    @XFWElementLabel("Условие вступления в силу")
    ContractConditionIntoForce conditionIntoForce;

    /**
     * Порядок определения стоимости.
     */
    @XFWElementLabel("Порядок определения стоимости")
    @Nullable
    @Column(length=1024)
    String determiningCost;

    /**
     * Дата прекращения действия.
     */
    @XFWElementLabel("Дата прекращения действия")
    @Nullable
    LocalDate terminationDate;

    /**
     * Причина прекращения действия.
     */
    @XFWElementLabel("Причина прекращения действия")
    @XFWManyToOne(fetch=EAGER)
    ContractRevokeReason terminationReason;

    /**
     * Куратор.
     */
    @XFWManyToOne(fetch=EAGER, optional=true)
    @XFWElementLabel("Куратор")
    EmployeePosition curator;

    /**
     * Дата подписания.
     */
    @XFWElementLabel("Дата подписания")
    @Nullable
    LocalDate signingDate;

    /**
     * Доверенность.
     */
    @XFWElementLabel("Доверенность")
    @Nullable
    @Column(length=128)
    String warrantName;

    /**
     * Сделка с заинтересованностью.
     */
    @XFWElementLabel("Сделка с заинтересованностью")
    @XFWBasic(optional=false)
    Boolean dealWithInterest = false;

    /**
     * Крупная сделка.
     */
    @XFWElementLabel("Крупная сделка")
    @XFWBasic(optional=false)
    Boolean bigDeal = false;

    /**
     * Существенная сделка.
     */
    @XFWElementLabel("Существенная сделка")
    @XFWBasic(optional=false)
    Boolean greatlyDeal = false;

    /**
     * Государственная регистрация.
     */
    @XFWElementLabel("Государственная регистрация")
    @XFWBasic(optional=false)
    Boolean officialRegistration = false;

    /**
     * Передача имущества.
     */
    @XFWElementLabel("Передача имущества")
    @XFWBasic(optional=false)
    Boolean propertyTransfer = false;

    /**
     * Примечание.
     */
    @XFWElementLabel("Примечание")
    @Nullable
    @Column(length=2000)
    String notes;
}
