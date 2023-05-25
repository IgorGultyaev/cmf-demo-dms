package ru.croc.ctp.cmf.sedproject.document.warrant.impl.process;

import static java.util.Collections.singletonList;
import static java.util.Collections.unmodifiableSet;

import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinition;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinitionProvider;
import ru.croc.ctp.cmf.dms.document.process.domain.DocumentProcessType;
import ru.croc.ctp.cmf.sedproject.dictionary.DocumentTypeSystemName;

import java.util.HashSet;
import java.util.Set;

/**
 * Провайдер, осуществляющий сопоставление типов и подтипов доверенности и объявления процесса для них.
 */
@Component
public class WarrantProcessDefinitionProvider implements DocumentProcessDefinitionProvider {

    /**
     * Множество системных имён типов и подтипов документов, для которых объявляется процесс.
     */
    static final Set<String> SUPPORTED_TYPE_SYSTEM_NAMES =
            unmodifiableSet(new HashSet<>(singletonList(DocumentTypeSystemName.DOCUMENT_TYPE_WARRANT)));

    /**
     * Информация о процессе.
     */
    static final DocumentProcessDefinition DEFINITION = new DocumentProcessDefinition() {

        @Override
        public String getTemplateName() {
            return "WarrantMainProcess";
        }
    };

    @Override
    public Set<String> getSupportedTypeSystemNames() {
        return SUPPORTED_TYPE_SYSTEM_NAMES;
    }

    @Override
    public DocumentProcessType getProcessType() {
        return DocumentProcessType.DPT_CREATION;
    }

    @Override
    public DocumentProcessDefinition getProcessDefinition() {
        return DEFINITION;
    }
}
