package ru.croc.ctp.cmf.demodms.document.domain;

import ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey;

import javax.persistence.Embeddable;

/**
 * Класс составного ключа {@link OutgoingDocumentJournalRecord}.
 * 
 * @author Dmitry Malenok
 */
@Embeddable
public class OutgoingDocumentJournalRecordKey extends JournalRecordKey<String, String, OutgoingDocumentJournalCause> {

    /**
     * Constructor.
     */
    public OutgoingDocumentJournalRecordKey() {
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
    public OutgoingDocumentJournalRecordKey(final String entityId,
            final String participantId,
            final OutgoingDocumentJournalCause cause) {
        super(entityId, participantId, cause);
    }
}
