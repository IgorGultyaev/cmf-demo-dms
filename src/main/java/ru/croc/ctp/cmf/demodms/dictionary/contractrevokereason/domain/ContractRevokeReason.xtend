package ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.core.dictionary.CmfDictionary
import ru.croc.ctp.cmf.core.dictionary.DeleteMarkSupported
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Модель причины расторжения/аннулирования договоров.
 * <p/>
 * Справочник содержит как причины аннулирования, так и причины прекращения действия договоров.<br/>
 * Аннулирование - это отказ от дальнейшей работы с проектом Договора до подписания.<br/>
 * Прекращение действия (Расторжение) - это уже расторжение после подписания Договора.
 */
@XFWObject
@XFWElementLabel("Причина расторжения/аннулирования договора")
@Table(name = ContractRevokeReason.TABLE_NAME)
@EntityListeners(AuditingEntityListener)
class ContractRevokeReason implements DeleteMarkSupported, CmfDictionary {

	/**
	 * Наименование таблицы хранения.
	 */
	public static final String TABLE_NAME = "cmf_contract_revoke_reason"

	/**
	 * Причина расторжения/аннулирования договора.
	 */
	@XFWElementLabel("Причина расторжения/аннулирования договора")
	@Column(nullable=false, unique=true, length=256)
	String name

	/**
     * Флаг, указывающий является ли элемент справочника удалённым.
     */
    @XFWElementLabel("Удалён")
    @XFWBasic(optional=false)
    @XFWDefaultValue(value = "false")
    Boolean deleted = false;

    /**
     * Дата создания объекта.
     */
    @XFWElementLabel("Дата создания")
    @XFWReadOnly
    @Column(nullable=false, updatable=false)
    @CreatedDate
    ZonedDateTime creationTime

    /**
     * Время последней модификации объекта.
     */
    @XFWElementLabel("Время последней модификации")
    @XFWReadOnly
    @Column(nullable=false)
    @LastModifiedDate
    ZonedDateTime lastModifiedTime;

    override boolean isDeleted() {
        return deleted.booleanValue()
    }
}
