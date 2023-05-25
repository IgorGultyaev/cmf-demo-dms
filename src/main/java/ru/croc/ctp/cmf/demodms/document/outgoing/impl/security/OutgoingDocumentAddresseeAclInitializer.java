package ru.croc.ctp.cmf.demodms.document.outgoing.impl.security;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentAddressee;
import ru.croc.ctp.jxfw.core.store.events.DomainObjectStoreEvent;

/**
 * Обработчик, инициализирующий ACL для адресатов исходящих документа.
 *
 * @author Dmitry Malenok
 */
@Component
public class OutgoingDocumentAddresseeAclInitializer {

    /**
     * Устанавливает ACL создаваемого адресата исходящего документа равного ACL документа.
     *
     * @param event
     *            событие по модификации адресата исходящего документа
     */
    @Transactional(propagation = Propagation.MANDATORY)
    @EventListener
    public void incomingDocumentAddresseeAclInitializer(
            final DomainObjectStoreEvent<? extends OutgoingDocumentAddressee> event) {
        final OutgoingDocumentAddressee object = event.getDomainObject();
        if (!object.isNew()) {
            return;
        }

        final OutgoingDocument document = object.getDocument();
        object.setAclId(document.getAclId());
    }
}
