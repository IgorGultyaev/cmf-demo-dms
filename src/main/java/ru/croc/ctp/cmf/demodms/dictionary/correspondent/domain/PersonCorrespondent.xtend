package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import javax.persistence.Column
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
import javax.persistence.Table
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Модель корреспондента, являющегося физическим лицом.
 */
@XFWObject
@XFWElementLabel("Физическое лицо")
@XFWElementLabel(propName=AbstractCorrespondent$Property.NAME, value="Фамилия Имя Отчество")
@Table(name=PersonCorrespondent.TABLE_NAME)
class PersonCorrespondent extends AbstractCorrespondent {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondent_person"

    /**
     * Имя.
     */
    @XFWElementLabel("Имя")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String firstName;

    /**
     * Фамилия.
     */
    @XFWElementLabel("Фамилия")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String secondName;

    /**
     * Отчество.
     */
    @XFWElementLabel("Отчество")
    @Column(length=64)
    String patronymic;

    @PrePersist
    @PreUpdate
    def preInsert() {
        this.name = this.secondName + " " + this.firstName +
            if(this.patronymic !== null) (" " + this.patronymic) else "";
    }
}
