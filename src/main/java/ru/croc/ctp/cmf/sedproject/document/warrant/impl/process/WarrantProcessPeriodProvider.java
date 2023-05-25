package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.repo.WarrantDocumentRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Обработчик, предсотавляющий срок действия доверенности.
 */
@Component("processWarrantPeriodProvider")
public class WarrantProcessPeriodProvider {

    /**
     * Репозиторий доверенностей.
     */
    @Autowired
    WarrantDocumentRepository warrantDocumentRepository;

    /**
     * Получение срока действия доверенности.
     * 
     * @param warrantId
     *            идентификатор доверенности
     * @return срок
     */
    public String getExpirationDate(final String warrantId) {
        final WarrantDocument warrant = warrantDocumentRepository.findById(warrantId).get();
        final LocalDate date = warrant.getStartDate().plusDays(warrant.getPeriod().toDays());
        return DateTimeFormatter.ofPattern("yyyy-MM-dd'T'00:00:00'Z'").format(date);
    }
}
