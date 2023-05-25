package ru.croc.ctp.cmf.demodms.document;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.cmf.demodms.document.contract.ContractDocumentConfig;
import ru.croc.ctp.cmf.demodms.document.incoming.IncomingDocumentConfig;
import ru.croc.ctp.cmf.demodms.document.outgoing.OutgoingDocumentConfig;
import ru.croc.ctp.cmf.dms.document.BaseDocumentConfig;
import ru.croc.ctp.cmf.dms.document.approval.DmsDocumentApprovalConfig;
import ru.croc.ctp.jxfw.jpa.config.XfwJpaConfig;

/**
 * Конфигурация подсистемы работы с документами.
 * 
 * @author Dmitry Malenok
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.document.domain.repo" })
@Import({ XfwJpaConfig.class,
    BaseDocumentConfig.class,
    DmsDocumentApprovalConfig.class,
    OutgoingDocumentConfig.class,
    IncomingDocumentConfig.class,
    ContractDocumentConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.document.domain.facade",
    "ru.croc.ctp.cmf.demodms.document.domain.service",
    "ru.croc.ctp.cmf.demodms.document.domain.datasource",
    "ru.croc.ctp.cmf.demodms.document.impl" })
public class DocumentConfig {

}
