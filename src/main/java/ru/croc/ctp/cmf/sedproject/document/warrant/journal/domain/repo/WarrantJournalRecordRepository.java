package ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecord;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.WarrantJournalRecordKey;

/**
 * Репозиторий работы с объектами хранения информации о записях в журнале доверенстей.
 */
public interface WarrantJournalRecordRepository extends JpaRepository<WarrantJournalRecord, WarrantJournalRecordKey>,
        QuerydslPredicateExecutor<WarrantJournalRecord> {
}
