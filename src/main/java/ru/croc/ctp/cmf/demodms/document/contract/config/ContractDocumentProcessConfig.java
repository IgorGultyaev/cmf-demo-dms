package ru.croc.ctp.cmf.demodms.document.contract.config;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.croc.ctp.cmf.demodms.document.contract.impl.process.ContractProcessDefinitionName;

/**
 * Развертывание шаблонов для документа Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.22
 */
@Configuration
public class ContractDocumentProcessConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ContractDocumentProcessConfig.class);

    /**
     * Развёртывание шаблонов.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean
    InitializingBean deployContractDocumentTemplates(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentMainProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/contract/contractDocumentMainProcess.bpmn"))
                    .name(ContractProcessDefinitionName.PROCESS_CONTRACT_DOCUMENT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentInitSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentInitSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_INIT)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentCreationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentCreationSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_CREATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentRegistrationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentRegistrationSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_REGISTRATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentAttachOriginalSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentAttachOriginalSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_ATTACH_ORIGINAL)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentTakeStorageSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentTakeStorageSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_TAKE_STORAGE)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentTerminationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentTerminationSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_TERMINATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("contractDocumentRevokeSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/contract/contractDocumentRevokeSubProcess.bpmn"))
                    .name(ContractProcessDefinitionName.SUBPROCESS_CONTRACT_DOCUMENT_REVOKE)
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.info("Contract document processes have been deployed.");
        };
    }
}
