package ru.croc.ctp.cmf.demodms.document.incoming;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.cmf.demodms.document.incoming.config.IncomingDocumentProcessConfig;
import ru.croc.ctp.cmf.dms.journal.JournalConfig;

/**
 * Конфигурация подсистемы работы с входящими документами.
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.incoming.domain",
    "ru.croc.ctp.cmf.demodms.document.incoming.journal.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.document.incoming.domain.repo",
    "ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.repo" })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.incoming.impl",
    "ru.croc.ctp.cmf.demodms.document.incoming.domain.service",
    "ru.croc.ctp.cmf.demodms.document.incoming.domain.facade",
    "ru.croc.ctp.cmf.demodms.document.incoming.domain.datasource",
    "ru.croc.ctp.cmf.demodms.document.incoming.journal.datasources",
    "ru.croc.ctp.cmf.demodms.document.incoming.journal.domain.facade.webclient",
    "ru.croc.ctp.cmf.demodms.document.incoming.journal.impl",
    "ru.croc.ctp.cmf.demodms.document.incoming.regnumber",
    "ru.croc.ctp.cmf.demodms.document.incoming.search" })
@Import({ IncomingDocumentProcessConfig.class, JournalConfig.class })
public class IncomingDocumentConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(IncomingDocumentConfig.class);

    /**
     * Развёртывание шаблонов таблиц валидации входящего документа.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean
    InitializingBean deployIncomingDocumentValidationTables(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("incomingDocumentValidationTable.dmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "validation/document/incoming/incomingDocumentValidationTable.dmn"))
                    .name("IncomingDocumentValidationTable")
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.debug("Validation tables for incoming document have been deployed.");
        };
    }

}
