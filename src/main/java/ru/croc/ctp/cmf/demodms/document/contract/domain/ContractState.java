package ru.croc.ctp.cmf.demodms.document.contract.domain;

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel;
import ru.croc.ctp.jxfw.core.domain.meta.XFWEnumId;
import ru.croc.ctp.jxfw.core.metamodel.runtime.XfwModelFactory;
import ru.croc.ctp.jxfw.metamodel.runtime.XfwEnumeration;

/**
 * Состояние договора.
 * <p/>
 * TODO: переделать на справочник для корректной сортировки<br/>
 * https://jira.croc.ru/browse/A1900895-85 Поля-перечисления переделать на справочники для корректной сортировки
 *
 * @author Andrei Dubonos
 * @since 2019.03.25
 */
public enum ContractState {

    /**
     * Исполняется.
     */
    @XFWElementLabel("Исполняется")
    @XFWEnumId(0)
    CS_PERFORMING,

    /**
     * Исполнен.
     */
    @XFWElementLabel("Исполнен")
    @XFWEnumId(1)
    CS_PERFORMED,

    /**
     * Не исполняется.
     */
    @XFWElementLabel("Не исполняется")
    @XFWEnumId(2)
    CS_NOT_PERFORMING,

    /**
     * Не вступил в силу.
     */
    @XFWElementLabel("Не вступил в силу")
    @XFWEnumId(3)
    CS_NOT_INTO_FORCE,

    /**
     * Расторгнут.
     */
    @XFWElementLabel("Расторгнут")
    @XFWEnumId(4)
    CS_DISSOLVED;

    /**
     * Поле metadata, требуемое JXFW для enum, определенных в .java файлах.
     */
    public static final XfwEnumeration METADATA = XfwModelFactory.getInstance().findEnum(ContractState.class);
}
