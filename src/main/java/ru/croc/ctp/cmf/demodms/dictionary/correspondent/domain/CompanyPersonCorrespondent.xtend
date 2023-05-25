package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import javax.persistence.Column
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
import javax.persistence.Table
import ru.croc.ctp.jxfw.core.domain.meta.XFWDefaultValue
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWManyToOne
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Модель корреспондента, являющегося персоной.
 */
@XFWObject
@XFWElementLabel("Персона")
@XFWElementLabel(propName=AbstractCorrespondent$Property.NAME, value="Фамилия Имя Отчество")
@Table(name=CompanyPersonCorrespondent.TABLE_NAME)
class CompanyPersonCorrespondent extends AbstractCorrespondent {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondent_companyperson"

    /**
     * 	Имя персоны.
     */
    @XFWElementLabel("Имя")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String firstName;

    /**
     * Фамилия персоны.
     */
    @XFWElementLabel("Фамилия")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String secondName;

    /**
     * Отчество персоны.
     */
    @XFWElementLabel("Отчество")
    @Column(length=64)
    String patronymic;

    /**
     * Должность.
     */
    @XFWElementLabel("Должность")
    @XFWBasic(optional=false)
    @Column(length=255, nullable=false)
    String position;

    /**
     * Флаг, указывающий является ли контактное лицо основным.
     */
    @XFWElementLabel("Основной")
    @XFWBasic(optional=false)
    @Column(nullable = false, name="is_primary")
    @XFWDefaultValue(value="false")
    Boolean primary = false;

    /**
     * Подразделение.
     */
    @XFWElementLabel("Подразделение")
    @Column(length=255)
    String department;

    /**
     * Ссылка на родительскую компанию.
     */
    @XFWElementLabel("Юридическое лицо")
    @XFWManyToOne(optional=false)
    CompanyCorrespondent parent;

    @PrePersist
    @PreUpdate
    def preInsert() {
        this.name = this.secondName + " " + this.firstName +
            if(this.patronymic !== null) (" " + this.patronymic) else "";
    }
}
