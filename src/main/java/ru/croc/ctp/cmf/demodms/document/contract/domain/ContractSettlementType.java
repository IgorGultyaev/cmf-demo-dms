package ru.croc.ctp.cmf.demodms.document.contract.domain;

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel;
import ru.croc.ctp.jxfw.core.domain.meta.XFWEnumId;
import ru.croc.ctp.jxfw.core.metamodel.runtime.XfwModelFactory;
import ru.croc.ctp.jxfw.metamodel.runtime.XfwEnumeration;

/**
 * Типы взаиморасчётов (приходный/расходный).
 * <p/>
 * TODO: переделать на справочник для корректной сортировки<br/>
 * https://jira.croc.ru/browse/A1900895-85 Поля-перечисления переделать на справочники для корректной сортировки
 *
 * @author Andrei Dubonos
 * @since 2019.03.25
 */
public enum ContractSettlementType {

    /**
     * Доходный.
     */
    @XFWElementLabel("Доходный")
    @XFWEnumId(0)
    CST_PROFITABLE,

    /**
     * Расходный.
     */
    @XFWElementLabel("Расходный")
    @XFWEnumId(1)
    CST_CONSUMABLES;

    /**
     * Поле metadata, требуемое JXFW для enum, определенных в .java файлах.
     */
    public static final XfwEnumeration METADATA = XfwModelFactory.getInstance().findEnum(ContractSettlementType.class);
}
