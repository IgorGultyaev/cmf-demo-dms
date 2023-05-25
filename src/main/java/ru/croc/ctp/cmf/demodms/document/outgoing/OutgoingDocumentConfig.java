package ru.croc.ctp.cmf.demodms.document.outgoing;

import org.camunda.bpm.engine.RepositoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.outgoing.config.OutgoingDocumentProcessConfig;
import ru.croc.ctp.cmf.demodms.document.outgoing.impl.process.OutgoingDocumentApprovalProcessHandler;
import ru.croc.ctp.cmf.dms.document.approval.ApprovingObjectProcessHandler;
import ru.croc.ctp.cmf.dms.journal.JournalConfig;

/**
 * Конфигурация подсистемы работы с исходящими документами.
 * 
 * @author Dmitry Malenok
 */
@Configuration
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.outgoing.impl",
    "ru.croc.ctp.cmf.demodms.document.outgoing.journal.datasources",
    "ru.croc.ctp.cmf.demodms.document.outgoing.journal.impl" })
@Import({ OutgoingDocumentProcessConfig.class, JournalConfig.class })
public class OutgoingDocumentConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(OutgoingDocumentConfig.class);

    /**
     * Развёртывание шаблонов таблиц валидации входящего документа.
     *
     * @param repositoryService
     *            сервис репозитория процессов
     * @return не важно
     */
    @Bean
    InitializingBean deployOutgoingDocumentValidationTables(final RepositoryService repositoryService) {
        return () -> {
            repositoryService.createDeployment()
                    .addInputStream("outgoingDocumentValidationTable.dmn",
                            Thread.currentThread()
                                    .getContextClassLoader()
                                    .getResourceAsStream(
                                            "validation/document/outgoing/outgoingDocumentValidationTable.dmn"))
                    .name("OutgoingDocumentValidationTable")
                    .enableDuplicateFiltering(true)
                    .deploy();
            LOG.debug("Validation tables for outgoing document have been deployed.");
        };
    }

    /**
     * Обработчик операций процесса согласования исходящего документа.
     * <p/>
     * Незнаю, как прямо там дать ещё одно наименование бину.
     * 
     * @param handler
     *            обработчик операций процесса согласования исходящего документа
     * @return обработчик операций процесса согласования исходящего документа
     */
    @Bean(ApprovingObjectProcessHandler.AOPH_BEAN_NAME_PREFIX + OutgoingDocument.TYPE_NAME)
    ApprovingObjectProcessHandler apprivingObjectProcessHandler(final OutgoingDocumentApprovalProcessHandler handler) {
        return handler;
    }
}
