package ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain;

import ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey;

import javax.persistence.Embeddable;

/**
 * Класс составного ключа {@link WarrantJournalRecord}.
 */
@Embeddable
public class WarrantJournalRecordKey extends JournalRecordKey<String, String, WarrantJournalCause> {

    /**
     * Constructor.
     */
    public WarrantJournalRecordKey() {
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
    public WarrantJournalRecordKey(final String entityId, final String participantId, final WarrantJournalCause cause) {
        super(entityId, participantId, cause);
    }
}
