package ru.croc.ctp.cmf.demodms.document.outgoing.impl.process;

import static java.util.Collections.singletonList;
import static java.util.Collections.unmodifiableSet;

import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.DocumentTypeSystemName;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinition;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinitionProvider;
import ru.croc.ctp.cmf.dms.document.process.domain.DocumentProcessType;

import java.util.HashSet;
import java.util.Set;

/**
 * Провайдер, осуществляющий сопоставление типов и подтипов исходящего документа и объявления процесса для них.
 *
 * @author Dmitry Malenok
 */
@Component
public class OutgoingDocumentProcessDefinitionProvider implements DocumentProcessDefinitionProvider {

    /**
     * Множество системных имён типов и подтипов документов, для которых объявляется процесс.
     */
    static final Set<String> SUPPORTED_TYPE_SYSTEM_NAMES =
            unmodifiableSet(new HashSet<>(singletonList(DocumentTypeSystemName.DOCUMENT_TYPE_OUTGOING)));

    /**
     * Информация о процессе.
     */
    static final DocumentProcessDefinition DEFINITION = new DocumentProcessDefinition() {

        @Override
        public String getTemplateName() {
            return "OutgoingDocumentMainProcess";
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
