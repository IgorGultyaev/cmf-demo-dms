package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import java.time.ZonedDateTime
import java.util.List
import javax.persistence.Column
import javax.persistence.EntityListeners
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.Table
import javax.persistence.Version
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import ru.croc.ctp.jxfw.core.domain.Editable
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Модель,внутреннего справочника видов контактов (рабочий, домашний и т.п.).
 */
@XFWObject
@XFWElementLabel("Вид контакта")
@Table(name=CorrespondentContactKind.TABLE_NAME)
@XFWReadOnly
@EntityListeners(AuditingEntityListener)
class CorrespondentContactKind implements Editable {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondentcontactkind"

    /**
     * Наименование.
     */
    @XFWElementLabel("Наименование")
    @XFWBasic(optional=false)
    @Column(length=32, nullable=false, unique = true)
    String name;

    /**
     * Список типов контактов, для которых применим данный вид.
     * Используется для того, чтобы для заданного типа выводить только те виды,
     * с которыми он связан.
     */
    @XFWManyToMany(targetEntity = CorrespondentContactType)
    @JoinTable(name = "correspondentcontactkinds_correspondentcontacttypes",
    joinColumns = @JoinColumn(name = "correspondentcontactkind_id"),
    inverseJoinColumns = @JoinColumn(name = "correspondentcontacttype_id"))
    @XFWBasic(optional=false)
    List<CorrespondentContactType> contactTypes;

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
}