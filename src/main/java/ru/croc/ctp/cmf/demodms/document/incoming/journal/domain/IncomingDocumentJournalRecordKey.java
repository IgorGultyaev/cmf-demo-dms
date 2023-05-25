package ru.croc.ctp.cmf.demodms.document.incoming.journal.domain;

import ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey;

import javax.annotation.Nonnull;
import javax.persistence.Embeddable;

/**
 * Класс составного ключа {@link IncomingDocumentJournalRecord}.
 * 
 * @author Dmitry Malenok
 */
@Embeddable
public class IncomingDocumentJournalRecordKey extends JournalRecordKey<String, String, IncomingDocumentJournalCause> {

    /**
     * Constructor.
     */
    public IncomingDocumentJournalRecordKey() {
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
    public IncomingDocumentJournalRecordKey(@Nonnull final String entityId,
            @Nonnull final String participantId,
            @Nonnull final IncomingDocumentJournalCause cause) {
        super(entityId, participantId, cause);
    }
}
