package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import java.time.ZonedDateTime
import javax.persistence.Column
import javax.persistence.DiscriminatorColumn
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
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject
import ru.croc.ctp.jxfw.core.validation.meta.XFWReadOnly

/**
 * Базовая модель, хранящая информацию о контакте корреспондента.
 */
@XFWObject
@XFWElementLabel("Контакты")
@Table(name=AbstractCorrespondentContact.TABLE_NAME)
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name=ColumnName.ACCCN_DISCRIMINATOR, length=32)
@EntityListeners(AuditingEntityListener)
abstract class AbstractCorrespondentContact implements DeleteMarkSupported, CmfDictionary {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondentcontact"


    /**
     * Класс констант, содержащих наименования колонок {@link AbstractCorrespondentContact#TABLE_NAME}.
     */
    static class ColumnName {

        /**
         * Колонка, в которой хранится идентификатор модели наследника.
         */
        public static final String ACCCN_DISCRIMINATOR = "dtype";
    }

    /**
     * Дискриминатор.
     * <p/>
     * Введён из-за ошибок определения типа в querydsl.
     */
    @Column(name=ColumnName.ACCCN_DISCRIMINATOR, insertable=false, updatable=false, length=32)
    String discriminator;

    /**
     * Отображение контакта (e-mail для типа e-mail,
     * телефон для типов телефон, факс, адрес - для адреса и т.п.).
     */
    @XFWElementLabel("Контакт")
    @XFWBasic(optional=false)
    @Column(length=1000, nullable=false, unique = true)
    String name;

    /**
     * Флаг, указывающий является ли элемент справочника удалённым.
     */
    @XFWElementLabel("Удалён")
    @XFWBasic(optional=false)
    @XFWDefaultValue(value = "false")
    Boolean deleted = false;

    /**
     * 	Тип контакта (адрес, e-mail, телефон, факс и т.п.).
     */
    @XFWElementLabel("Тип контакта")
    @XFWManyToOne(optional=false)
    CorrespondentContactType contactType;

    /**
     * Вид контакта (рабочий, домашний, мобильный и т.п.).
     */
    @XFWElementLabel("Вид контакта")
    @XFWManyToOne(optional = false)
    CorrespondentContactKind contactKind;

    /**
     * Флаг, указывающий следует ли использовать адрес как основной.
     * Значение true может быть только для контакта одного типа, связанного с корреспондентом.
     */
    @XFWElementLabel("Основной")
    @Column(name = "is_primary", nullable = false)
    @XFWDefaultValue(value = "false")
    Boolean primary = false;

    /**
     * Модель корреспондента, с которым связан адрес.
     */
    @XFWElementLabel("Корреспондент")
    @XFWManyToOne
    AbstractCorrespondent correspondent;

    /**
     * 	Комментарий.
     * 	При наличии нескольких однотипных контактов можно указать область использования.
     */
    @XFWElementLabel("Комментарий")
    @XFWBasic(optional = true)
    @Column(length=2000)
    String comment;
    
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