package ru.croc.ctp.cmf.demodms.document.contract.domain;

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel;
import ru.croc.ctp.jxfw.core.domain.meta.XFWEnumId;
import ru.croc.ctp.jxfw.core.metamodel.runtime.XfwModelFactory;
import ru.croc.ctp.jxfw.metamodel.runtime.XfwEnumeration;

/**
 * Условие вступления в силу.
 * <p/>
 * TODO: переделать на справочник для корректной сортировки<br/>
 * https://jira.croc.ru/browse/A1900895-85 Поля-перечисления переделать на справочники для корректной сортировки
 *
 * @author Andrei Dubonos
 * @since 2019.03.26
 */
public enum ContractConditionIntoForce {

    /**
     * В момент подписания.
     */
    @XFWElementLabel("В момент подписания")
    @XFWEnumId(0)
    CCIF_IN_SIGNING_TIME,

    /**
     * С условием.
     */
    @XFWElementLabel("С условием")
    @XFWEnumId(1)
    CCIF_WITH_CONDITION;

    /**
     * Поле metadata, требуемое JXFW для enum, определенных в .java файлах.
     */
    public static final XfwEnumeration METADATA =
            XfwModelFactory.getInstance().findEnum(ContractConditionIntoForce.class);

}
