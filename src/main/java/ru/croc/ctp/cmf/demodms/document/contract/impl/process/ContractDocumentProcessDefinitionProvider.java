package ru.croc.ctp.cmf.demodms.document.contract.impl.process;

import static java.util.Collections.singletonList;
import static java.util.Collections.unmodifiableSet;

import org.springframework.stereotype.Component;
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentTypeSystemName;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinition;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessDefinitionProvider;
import ru.croc.ctp.cmf.dms.document.process.domain.DocumentProcessType;

import java.util.HashSet;
import java.util.Set;

/**
 * Провайдер, осуществляющий сопоставление типов и подтипов документа Договор и объявления процесса для них.
 *
 * @author Andrei Dubonos
 * @since 2019.03.22
 */
@Component
public class ContractDocumentProcessDefinitionProvider implements DocumentProcessDefinitionProvider {

    /**
     * Множество системных имён типов и подтипов документов, для которых объявляется процесс.
     */
    static final Set<String> SUPPORTED_TYPE_SYSTEM_NAMES =
            unmodifiableSet(new HashSet<>(singletonList(ContractDocumentTypeSystemName.DOCUMENT_TYPE_CONTRACT)));

    /**
     * Информация о процессе.
     */
    static final DocumentProcessDefinition DEFINITION = new DocumentProcessDefinition() {

        @Override
        public String getTemplateName() {
            return ContractProcessDefinitionName.PROCESS_CONTRACT_DOCUMENT_MAIN;
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