package ru.croc.ctp.cmf.demodms.document.contract.journal.domain;

import ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey;

import javax.persistence.Embeddable;

/**
 * Класс составного ключа {@link ContractDocumentJournalRecord}.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
@Embeddable
public class ContractDocumentJournalRecordKey extends JournalRecordKey<String, String, ContractDocumentJournalCause> {

    /**
     * Constructor.
     */
    public ContractDocumentJournalRecordKey() {
    }

    /**
     * Constructor.
     *
     * @param entityId
     *            идентификатор элемента, включённого в журнал
     * @param participantId
     *            идентификатор участника, для которого элемент включён в журнал
     * @param cause
     *            причина включения элемента в журнал
     */
    public ContractDocumentJournalRecordKey(final String entityId,
            final String participantId,
            final ContractDocumentJournalCause cause) {
        super(entityId, participantId, cause);
    }
}