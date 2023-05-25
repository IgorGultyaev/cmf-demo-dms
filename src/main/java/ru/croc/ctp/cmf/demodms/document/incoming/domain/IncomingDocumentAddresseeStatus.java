package ru.croc.ctp.cmf.demodms.document.incoming.domain;

import ru.croc.ctp.jxfw.core.domain.meta.XFWElementLabel;
import ru.croc.ctp.jxfw.core.domain.meta.XFWEnumId;
import ru.croc.ctp.jxfw.core.metamodel.runtime.XfwModelFactory;
import ru.croc.ctp.jxfw.metamodel.runtime.XfwEnumeration;

/**
 * Состояние рассмотрения по адресату.
 */
@XFWElementLabel("Состояние рассмотрения")
// @XFWEnum(isFlags = false) //TODO: isFlags or isn't?
public enum IncomingDocumentAddresseeStatus {

    /**
     * Новый.
     */
    @XFWElementLabel("Новый")
    @XFWEnumId(0)
    IDAS_NEW,

    /**
     * На рассмотрении.
     */
    @XFWElementLabel("На рассмотрении")
    @XFWEnumId(1)
    IDAS_ON_REVIEW,

    /**
     * Рассмотрен.
     */
    @XFWElementLabel("Рассмотрен")
    @XFWEnumId(2)
    IDAS_REVIWED;

    /**
     * Поле metadata, требуемое JXFW для enum, определенных в .java файлах.
     */
    public static final XfwEnumeration METADATA =
            XfwModelFactory.getInstance().findEnum(IncomingDocumentAddresseeStatus.class);

}
