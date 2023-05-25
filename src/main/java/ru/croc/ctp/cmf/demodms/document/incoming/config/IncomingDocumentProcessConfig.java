package ru.croc.ctp.cmf.demodms.document.incoming.config;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentProcessDefinitionName;

/**
 * Развертывание шаблонов для входящего документа.
 *
 * @author Vladislav Volokh
 */
@Configuration
public class IncomingDocumentProcessConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(IncomingDocumentProcessConfig.class);

    /**
     * Развёртывание шаблонов.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean
    InitializingBean deployIncomingDocumentTemplates(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentMainProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/incoming/incomingDocumentMainProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.PROCESS_INCOMING_DOCUMENT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentCreationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentCreationSubProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_CREATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentRegistrationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentRegistrationSubProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_REGISTRATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentScanningSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentScanningSubProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_SCANNING)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentExecutionSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentExecutionSubProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_EXECUTION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentCompletionSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentCompletionSubProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_COMPLETION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentCancellationProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/incoming/incomingDocumentCancellationProcess.bpmn"))
                    .name(IncomingDocumentProcessDefinitionName.SUBPROCESS_INCOMING_DOCUMENT_CANCELLATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.info("Incoming document processes have been deployed.");
        };
    }
}
