package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.Table
import javax.persistence.Version
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.cmf.demodms.dictionary.SupportSystemNameDictionaryItem
import ru.croc.ctp.jxfw.core.domain.Editable
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Модель,внутреннего справочника типов контактов.
 */
@XFWObject
@XFWElementLabel("Тип контакта")
@Table(name=CorrespondentContactType.TABLE_NAME)
@XFWReadOnly
@EntityListeners(AuditingEntityListener)
class CorrespondentContactType implements SupportSystemNameDictionaryItem, Editable {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondentcontacttype"

    /**
     * Имя.
     */
    @XFWElementLabel("Имя")
    @XFWBasic(optional=false)
    @Column(length=32, nullable=false, unique=true)
    String name;

    /**
     * Системный именованный идентификатор.
     * <p/>
     * Используется для определения типа контакта логикой ПО.
     */
    @XFWElementLabel("Системный идентификатор")
    @XFWBasic(optional=false)
    @Column(length=32, nullable=false, unique=true)
    String systemName;

    /**
     * Версия объекта справочника.
     * <p/>
     * Поле осталось для осуществления возможности в прикладных проектах узнавать об изменении данных по изменению ts.
     */
    @Column(name="ts", nullable=false)
    @Version
    Long version = -1L;

    /**
     * {@inheritDoc}
     */
    override getNameOfVersionField() {
        return "version";
    }
    
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

    override String getSystemName() {
        return systemName;
    }

    override boolean hasSystemName() {
        return (systemName !== null);
    }
}
