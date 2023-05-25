package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import javax.persistence.DiscriminatorValue
import javax.persistence.Table
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Общая модель, хранящая информацию о контакте корреспондента.
 * Хранит любые контакты, для которых не выделены отдельные подтипы.
 */
@XFWObject
@XFWElementLabel("Контакт")
@Table(name=CorrespondentContactDefault.TABLE_NAME)
@DiscriminatorValue(CorrespondentContactDefault.TYPE_DISCRIMINATOR)
class CorrespondentContactDefault extends AbstractCorrespondentContact {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondentcontactdefault"

    /**
     * Значение идентификатора, означающего, что хранимое значение - обобщённый контакт,
     * информация о котором не выделена в отдельный подтип.
     * 
     * @see ColumnName#ACCCN_DISCRIMINATOR
     */
    public static final String TYPE_DISCRIMINATOR = "default";
}
