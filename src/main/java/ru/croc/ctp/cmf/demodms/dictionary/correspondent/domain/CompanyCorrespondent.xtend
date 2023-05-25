package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings
import java.util.List
import javax.persistence.Column
import javax.persistence.Table
import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel
import ru.croc.ctp.jxfw.core.domain.meta.persistence.XFWOneToMany
import ru.croc.ctp.jxfw.core.generator.meta.XFWObject

/**
 * Модель корреспондента, являющегося компанией.
 */
@XFWObject
@XFWElementLabel("Юридическое лицо")
@Table(name=CompanyCorrespondent.TABLE_NAME)
@SuppressFBWarnings("JPAI_INEFFICIENT_EAGER_FETCH") // Их не должно быть много.
class CompanyCorrespondent extends  AbstractCorrespondent {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_correspondent_company"

    /**
     * Полное наименование организации.
     */
    @XFWElementLabel("Краткое наименование")
    @Column(length=255)
    String shortName;

    /**
     * Контактные лица.
     */
    @XFWElementLabel("Контактные лица")
    @XFWOneToMany(mappedBy="parent", targetEntity=CompanyPersonCorrespondent, fetch=EAGER)
    List<CompanyPersonCorrespondent> persons;
}