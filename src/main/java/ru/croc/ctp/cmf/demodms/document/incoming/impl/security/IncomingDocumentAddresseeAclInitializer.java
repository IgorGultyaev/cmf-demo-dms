package ru.croc.ctp.cmf.demodms.document.incoming.impl.security;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocument;
import ru.croc.ctp.cmf.demodms.document.incoming.domain.IncomingDocumentAddressee;
import ru.croc.ctp.jxfw.core.store.events.DomainObjectStoreEvent;

/**
 * Обработчик, инициализирующий ACL для адресатов входящего документа.
 *
 * @author Dmitry Malenok
 */
@Component
public class IncomingDocumentAddresseeAclInitializer {

    /**
     * Устанавливает ACL создаваемого адресата входящего документа равного ACL документа.
     *
     * @param event
     *            событие по модификации адресата входящего документа
     */
    @Transactional(propagation = Propagation.MANDATORY)
    @EventListener
    public void incomingDocumentAddresseeAclInitializer(
            final DomainObjectStoreEvent<? extends IncomingDocumentAddressee> event) {
        final IncomingDocumentAddressee object = event.getDomainObject();
        if (!object.isNew()) {
            return;
        }

        final IncomingDocument document = object.getDocument();
        object.setAclId(document.getAclId());
    }
}
