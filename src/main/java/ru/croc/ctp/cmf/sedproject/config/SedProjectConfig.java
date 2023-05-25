package ru.croc.ctp.cmf.sedproject.config;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import ru.croc.ctp.cmf.sedproject.document.DocumentConfig;
import ru.croc.ctp.cmf.sedproject.document.warrant.WarrantProcessDefinitionName;

/**
 * Общая конфигурация проекта.
 */
@Configuration
@Import({ DocumentConfig.class })
public class SedProjectConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(SedProjectConfig.class);

    /**
     * Развёртывание шаблонов процессов.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean("ru.croc.ctp.cmf.sedproject.SedProject")
    InitializingBean deployTemplates(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("warrantMainProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantMainProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.PROCESS_WARRANT_MAIN)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("warrantRegistrationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantRegistrationSubProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.SUBPROCESS_WARRANT_REGISTRATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("warrantNotarizationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantNotarizationSubProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.SUBPROCESS_WARRANT_NOTARIZATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("warrantCreationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantCreationSubProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.SUBPROCESS_WARRANT_CREATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("warrantCancellationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantCancellationSubProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.SUBPROCESS_WARRANT_CANCELLATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            repositoryService.createDeployment()
                    .addInputStream("warrantActivationSubProcess.bpmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream("process/document/warrant/warrantActivationSubProcess.bpmn"))
                    .name(WarrantProcessDefinitionName.SUBPROCESS_WARRANT_ACTIVATION)
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.debug("Processes for commissions have been deployed.");
        };
    }

}
