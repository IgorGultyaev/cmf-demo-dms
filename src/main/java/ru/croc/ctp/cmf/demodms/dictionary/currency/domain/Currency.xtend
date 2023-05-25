package ru.croc.ctp.cmf.demodms.dictionary.currency.domain

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
 * Модель валюты.
 */
@XFWObject
@XFWElementLabel("Валюта")
@Table(name = Currency.TABLE_NAME)
@EntityListeners(AuditingEntityListener)
class Currency implements DeleteMarkSupported, CmfDictionary {

	/**
	 * Наименование таблицы хранения.
	 */
	public static final String TABLE_NAME = "cmf_currency"

	/**
	 * Наименование.
	 */
	@XFWElementLabel("Наименование")
	@Column(nullable=false, unique=true, length=256)
	String name

    /**
	 * Код.
	 * <p\>
	 * Алфавитная часть ISO 4217 ("RUB" и т.п.).
	 */
	@XFWElementLabel("Код")
	@Column(nullable=false, unique=true, length=16)
	String codeAlfa

	/**
	 * Обозначение.
     * <p\>
     * Цифровая часть ISO 4217 ("643" и т.п.).
	 */
	@XFWElementLabel("Обозначение")
	@Column(nullable=false, unique=true, length=10)
	String codeNumber

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
