package ru.croc.ctp.cmf.demodms.document.domain;

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel;
import ru.croc.ctp.jxfw.core.domain.meta.XFWEnumId;
import ru.croc.ctp.jxfw.core.metamodel.runtime.XfwModelFactory;
import ru.croc.ctp.jxfw.metamodel.runtime.XfwEnumeration;

/**
 * Статус отправки исходящего документа.
 *
 * @author Vladislav Volokh
 */
public enum OutgoingDocumentDeliveryStatus {
    /**
     * Пусто.
     */
    @XFWElementLabel(" ")
    @XFWEnumId(0)
    EMPTY,

    /**
     * На отправке.
     */
    @XFWElementLabel("На отправке")
    @XFWEnumId(1)
    SENDING,

    /**
     * Отправлен.
     */
    @XFWElementLabel("Отправлен")
    @XFWEnumId(2)
    SENT,

    /**
     * Возвращен.
     */
    @XFWElementLabel("Возвращен")
    @XFWEnumId(4)
    RETURNED;

    /**
     * Поле metadata, требуемое JXFW для enum, определенных в .java файлах.
     */
    public static final XfwEnumeration METADATA =
            XfwModelFactory.getInstance().findEnum(OutgoingDocumentDeliveryStatus.class);
}
