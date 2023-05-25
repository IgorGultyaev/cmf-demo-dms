package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.repo.WarrantDocumentRepository;

/**
 * Обработчик, содержащий бизнес логику автоматических действий (включая разрешение условия) подпроцесса нотариального
 * заверения доверенности.
 */
@Component("processWarrantNotarizationHandler")
public class WarrantProcessNotarizationHandler {

    /**
     * Репозиторий доверенностей.
     */
    @Autowired
    WarrantDocumentRepository warrantDocumentRepository;

    /**
     * Определяет, требуется ли нотариальное заверение.
     * 
     * @param warrantId
     *            идентификатор доверенности
     * @return <code>true</code> - требуется, иначе - <code>false</code>
     */
    public boolean isNotarizationRequired(final String warrantId) {
        final WarrantDocument warrant = warrantDocumentRepository.findById(warrantId).get();
        return warrant.getNotarizationRequired();
    }
}
