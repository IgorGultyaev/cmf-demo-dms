package ru.croc.ctp.cmf.demodms.document.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalRecordKey;

/**
 * Репозиторий работы с объектами хранения информации о записях в журнале исходящих документов.
 * 
 * @author Dmitry Malenok
 */
public interface OutgoingDocumentJournalRecordRepository
        extends JpaRepository<OutgoingDocumentJournalRecord, OutgoingDocumentJournalRecordKey>,
        QuerydslPredicateExecutor<OutgoingDocumentJournalRecord> {

}
