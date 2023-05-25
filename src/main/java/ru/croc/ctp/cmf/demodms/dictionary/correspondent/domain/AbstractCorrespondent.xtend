package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import java.time.ZonedDateTime
import java.util.List
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Inheritance
import javax.persistence.InheritanceType
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.core.dictionary.CmfDictionary
import ru.croc.ctp.cmf.core.dictionary.DeleteMarkSupported
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWOneToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Базовая модель корреспондента.
 * <p/>
 * Используется как основная модель для ссылок.
 */
@XFWObject
@XFWElementLabel(value = "Корреспондент", lang = "ru")
@XFWElementLabel(value = "Correspondent", lang = "en")
@Table(name=AbstractCorrespondent.TABLE_NAME)
@Inheritance(strategy=InheritanceType.JOINED)
@EntityListeners(AuditingEntityListener)
abstract class AbstractCorrespondent implements DeleteMarkSupported, CmfDictionary {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondent_common"

    /**
     * Примечание.
     */
    @XFWElementLabel("Доп. информация")
    @XFWBasic(optional=true)
    @Column(length=2000)
    String comment;

    /**
     * Наименование корреспондента.
     */
    @XFWElementLabel("Наименование")
    @XFWBasic(optional=false)
    @Column(length=255, nullable=false, unique=true)
    String name;

    /**
     * Флаг, указывающий является ли вид документа удалённым.
     */
    @XFWElementLabel("Удалён")
    @XFWBasic(optional=false)
    @XFWDefaultValue(value="false")
    Boolean deleted = false;

    /**
     * Список контактов корреспондента.
     */
    @XFWElementLabel("Список контактов корреспондента")
    @XFWOneToMany(mappedBy="correspondent", targetEntity=AbstractCorrespondentContact, fetch=LAZY)
    List<AbstractCorrespondentContact> contacts;

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

    override boolean isDeleted() {
        return deleted;
    }
}
