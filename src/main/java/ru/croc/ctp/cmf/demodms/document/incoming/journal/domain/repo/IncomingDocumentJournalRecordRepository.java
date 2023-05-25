package ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecord;
import ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.IncomingDocumentJournalRecordKey;

/**
 * Репозиторий работы с объектами хранения информации о записях в журнале входящих документов.
 */
public interface IncomingDocumentJournalRecordRepository
        extends JpaRepository<IncomingDocumentJournalRecord, IncomingDocumentJournalRecordKey>,
        QuerydslPredicateExecutor<IncomingDocumentJournalRecord> {

}
