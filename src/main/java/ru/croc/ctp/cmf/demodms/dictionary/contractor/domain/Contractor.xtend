package ru.croc.ctp.cmf.demodms.dictionary.contractor.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.core.dictionary.CmfDictionary
import ru.croc.ctp.cmf.core.dictionary.DeleteMarkSupported
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.CompanyCorrespondent
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Модель контрагента.
 * <p/>
 * В комментариях используется сокращение "КА".
 * <p/>
 * КА и Корреспондент ({@link AbstractCorrespondent}) для ДемоСЭД - это независимые сущности в общем случае.<br/>
 * КА имеет ссылку на Корреспондента для "технических" целей, и чтобы можно было создать КА на основе Корреспондент.
 * КА после создания не влияет на Корееспондента, и наоборот.
 */
@XFWObject
@XFWElementLabel("Контрагент")
@Table(name = Contractor.TABLE_NAME)
@EntityListeners(AuditingEntityListener)
class Contractor implements DeleteMarkSupported, CmfDictionary {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_contractor"

    /**
     * Корреспондент.
     * <p/>
     * Только "Юридическое лицо".
     */
    @XFWElementLabel("Корреспондент")
    @XFWManyToOne(fetch=LAZY)
    CompanyCorrespondent correspondent

    /**
     * Наименование.
     */
    @XFWElementLabel("Наименование")
    @Column(nullable=false, unique=true, length=256)
    String name

    /**
     * Краткое наименование.
     */
    @XFWElementLabel("Краткое наименование")
    @Column(length=256)
    String shortName

    /**
     * ОГРН.
     */
    @XFWElementLabel("ОГРН")
    @Column(length=15)
    String ogrn

    /**
     * ИНН.
     */
    @XFWElementLabel("ИНН")
    @Column(length=12)
    String inn

    /**
     * КПП.
     */
    @XFWElementLabel("КПП")
    @Column(length=9)
    String kpp

    /**
     * Доп. информация.
     */
    @XFWElementLabel("Доп. информация")
    @Column(length=2000)
    String comment

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
