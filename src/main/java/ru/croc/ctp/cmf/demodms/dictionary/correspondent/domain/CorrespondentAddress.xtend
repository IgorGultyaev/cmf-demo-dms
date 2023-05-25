package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import javax.persistence.Column
import javax.persistence.DiscriminatorValue
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
import javax.persistence.Table
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWBasic
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Модель, хранящая адреса корреспондента.
 * Тип контакта может быть установлен только в "адрес".
 */
@XFWObject
@XFWElementLabel("Адрес")
@Table(name=CorrespondentAddress.TABLE_NAME)
@DiscriminatorValue(CorrespondentAddress.TYPE_DISCRIMINATOR)
class CorrespondentAddress extends AbstractCorrespondentContact {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondentaddress"

    /**
     * Значение идентификатора, означающего, что хранимое значение - адрес.
     * 
     * @see ColumnName#ACCCN_DISCRIMINATOR
     */
    public static final String TYPE_DISCRIMINATOR = "address";

    /**
     * Страна.
     */
    @XFWElementLabel("Страна")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String country;

    /**
     * Область.
     */
    @XFWElementLabel("Регион/область/край/штат")
    @Column(length=64)
    String region;

    /**
     * Район.
     */
    @XFWElementLabel("Район")
    @Column(length=64)
    String subregion;

    /**
     * 	Город/посёлок.
     */
    @XFWElementLabel("Город/посёлок/село")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String city;

    /**
     * Улица.
     */
    @XFWElementLabel("Улица")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String street;

    /**
     * Номер дома включая, корпус, номер строения, литеру, и т.п.
     */
    @XFWElementLabel("Дом, строение/Корпус")
    @XFWBasic(optional=false)
    @Column(length=64, nullable=false)
    String building;

    /**
     * Номер офиса/квартыры.
     */
    @XFWElementLabel("Офис/квартира")
    @Column(length=64)
    String appartment;

    /**
     * 	Почтовый индекс.
     */
    @XFWElementLabel("Индекс")
    @Column(length=32)
    String postalCode;

    @PreUpdate
    @PrePersist
    def preInsert() {
        this.name = this.street + ", " + this.building +
            (if(this.appartment !== null) (", " + this.appartment) else "") + ", " + this.city +
            (if(this.subregion !== null) (", " + this.subregion) else "") +
            (if(this.region !== null) (", " + this.region) else "") + ", " + this.country +
            (if(this.postalCode !== null) (", " + this.postalCode) else "");

    }
}
