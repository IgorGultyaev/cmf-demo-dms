package ru.croc.ctp.cmf.demodms.document.contract;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.cmf.demodms.document.contract.config.ContractDocumentProcessConfig;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.impl.process.ContractDocumentApprovalProcessHandler;
import ru.croc.ctp.cmf.dms.document.approval.ApprovingObjectProcessHandler;
import ru.croc.ctp.cmf.dms.journal.JournalConfig;

/**
 * Конфигурация подсистемы работы с документами Договор.
 *
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.contract.domain",
        "ru.croc.ctp.cmf.demodms.document.contract.journal.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.document.contract.domain.repo",
        "ru.croc.ctp.cmf.demodms.document.contract.journal.domain.repo" })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.contract.impl",
        "ru.croc.ctp.cmf.demodms.document.contract.domain.service",
        "ru.croc.ctp.cmf.demodms.document.contract.domain.facade",
        "ru.croc.ctp.cmf.demodms.document.contract.journal.datasources",
        "ru.croc.ctp.cmf.demodms.document.contract.journal.domain.facade.webclient",
        "ru.croc.ctp.cmf.demodms.document.contract.journal.impl",
        "ru.croc.ctp.cmf.demodms.document.contract.regnumber",
        "ru.croc.ctp.cmf.demodms.document.contract.search" })
@Import({ ContractDocumentProcessConfig.class, JournalConfig.class })
public class ContractDocumentConfig {

    /**
     * Обработчик операций процесса согласования документа Договор.
     * <p/>
     * Незнаю, как прямо там дать ещё одно наименование бину.
     * 
     * @param handler
     *            обработчик операций процесса согласования документа Договор
     * @return обработчик операций процесса согласования документа Договор
     */
    @Bean(ApprovingObjectProcessHandler.AOPH_BEAN_NAME_PREFIX + ContractDocument.TYPE_NAME)
    ApprovingObjectProcessHandler approvingObjectProcessHandler(final ContractDocumentApprovalProcessHandler handler) {
        return handler;
    }
}
