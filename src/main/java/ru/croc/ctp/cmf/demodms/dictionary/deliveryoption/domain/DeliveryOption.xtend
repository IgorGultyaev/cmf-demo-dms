package ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Table
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.core.dictionary.CmfDictionary
import ru.croc.ctp.cmf.core.dictionary.DeleteMarkSupported
import ru.croc.ctp.cmf.demodms.dictionary.SupportSystemNameDictionaryItem
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Модель способа отправки/доставки.
 */
@XFWObject
@XFWElementLabel("Способ доставки")
@Table(name=DeliveryOption.TABLE_NAME)
@EntityListeners(AuditingEntityListener)
class DeliveryOption implements DeleteMarkSupported, SupportSystemNameDictionaryItem, CmfDictionary {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_deliveryoption"

    /**
     * Системный именованный идентификатор.
     */
    @XFWElementLabel("Системный идентификатор")
    @Column(length=256)
    String systemName;

    /**
     * Наименование способа отправки/доставки.
     */
    @XFWElementLabel("Способ отправки/доставки")
    @XFWBasic(optional=false)
    @Column(length=256, nullable=false, unique=true)
    String name;

    /**
     * Ссылка на тип доставки.
     */
    @XFWElementLabel("Тип доставки")
    @XFWManyToOne(optional=true)
    DeliveryType deliveryType;

    /**
     * Флаг, указывающий является ли элемент справочника удалённым.
     */
    @XFWElementLabel("Удалён")
    @XFWBasic(optional=false)
    @XFWDefaultValue(value="false")
    Boolean deleted = false;

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

    /**
     * Проверка, удален ли пользователь.
     * 
     * @return true - удален
     */
    override boolean isDeleted() {
        return deleted;
    }

    /**
     * Получение системного имени
     * 
     * @return системное имя
     */
    override String getSystemName() {
        return systemName;
    }

    /**
     * Проверка на наличие системного имени
     * 
     * @return true - систменое имя установлено
     */
    override boolean hasSystemName() {
        return (systemName !== null);
    }
}
