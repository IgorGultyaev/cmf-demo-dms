package ru.croc.ctp.cmf.demodms.document.domain;

import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID;
import static ru.croc.ctp.cmf.dms.journal.domain.JournalRecordKey.ColumnName.COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID;

import ru.croc.ctp.cmf.dms.journal.domain.AbstractJournalRecord;

import javax.persistence.Entity;
import javax.persistence.Index;
import javax.persistence.Table;

/**
 * Класс объекта хранения информации о записи в журнале исходящих документов.
 * 
 * @author Dmitry Malenok
 */
@Entity
@Table(name = OutgoingDocumentJournalRecord.TABLE_NAME, indexes = {
        @Index(columnList = COLUMN_JOURNAL_RECORD_KEY_ENTITY_ID + "," + COLUMN_JOURNAL_RECORD_KEY_PARTICIPANT_ID) })
public class OutgoingDocumentJournalRecord
        extends AbstractJournalRecord<String, String, OutgoingDocumentJournalCause, OutgoingDocumentJournalRecordKey> {

    /**
     * Наименование таблицы хранения.
     */
    public static final String TABLE_NAME = "cmf_journal_outgoing";
}
