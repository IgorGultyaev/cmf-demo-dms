package ru.croc.ctp.cmf.demodms.document.outgoing.config;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.croc.ctp.cmf.demodms.document.outgoing.OutgoingDocumentProcessDefinitionName;

/**
 * Развертывание шаблонов для исходящего документа.
 * 
 * @author Vladislav Volokh
 */
@Configuration
public class OutgoingDocumentProcessConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(OutgoingDocumentProcessConfig.class);

    /**
     * Развёртывание шаблонов.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean
    InitializingBean deployOutgoingDocumentTemplates(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentMainProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/outgoing/outgoingDocumentMainProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.PROCESS_OUTGOING_DOCUMENT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
//********************************************
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentRegistrationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/outgoing/outgoingDocumentRegistrationSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.PROCESS_OUTGOING_DOCUMENT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
//********************************************


            //********************************************
            repositoryService.createDeployment()
                    .addInputStream("outgoinDocumentAttachOriginalSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/outgoing/outgoinDocumentAttachOriginalSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.PROCESS_OUTGOING_DOCUMENT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
//********************************************



            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentInitSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/outgoing/outgoingDocumentInitSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.SUBPROCESS_OUTGOING_DOCUMENT_INIT)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentCreationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/outgoing/outgoingDocumentCreationSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.SUBPROCESS_OUTGOING_DOCUMENT_CREATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentDispatchSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/outgoing/outgoingDocumentDispatchSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.SUBPROCESS_OUTGOING_DOCUMENT_DISPATCH)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentRevokeSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "process/document/outgoing/outgoingDocumentRevokeSubProcess.bpmn"))
                    .name(OutgoingDocumentProcessDefinitionName.SUBPROCESS_OUTGOING_DOCUMENT_REVOKE)
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.info("Outgoing document processes have been deployed.");
        };
    }
}
