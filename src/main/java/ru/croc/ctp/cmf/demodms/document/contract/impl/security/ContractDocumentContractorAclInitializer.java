package ru.croc.ctp.cmf.demodms.document.contract.impl.security;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocumentContractor;
import ru.croc.ctp.jxfw.core.store.events.DomainObjectStoreEvent;

/**
 * Обработчик, инициализирующий ACL для Контрагентов документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.04.11
 */
@Component
public class ContractDocumentContractorAclInitializer {

    /**
     * Устанавливает ACL создаваемого контрагента документа Договор. ACL берёт из документа Договор.
     *
     * @param event
     *            событие по модификации контрагента
     */
    @Transactional(propagation = Propagation.MANDATORY)
    @EventListener
    public void contractDocumentContractorAclInitializer(
            final DomainObjectStoreEvent<? extends ContractDocumentContractor> event) {
        final ContractDocumentContractor contractor = event.getDomainObject();
        if (!contractor.isNew()) {
            return;
        }

        final ContractDocument document = contractor.getDocument();
        contractor.setAclId(document.getAclId());
    }
}
