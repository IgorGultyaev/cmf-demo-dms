package ru.croc.ctp.cmf.sedproject.document.warrant;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Конфигурация подсистемы работы с доверенностями.
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.sedproject.document.warrant.domain",
    "ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.sedproject.document.warrant.domain.repo",
    "ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.repo" })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.sedproject.document.warrant.impl",
    "ru.croc.ctp.cmf.sedproject.document.warrant.domain.service",
    "ru.croc.ctp.cmf.sedproject.document.warrant.domain.facade",
    "ru.croc.ctp.cmf.sedproject.document.warrant.domain.datasource",
    "ru.croc.ctp.cmf.sedproject.document.warrant.journal.datasources",
    "ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.facade.webclient",
    "ru.croc.ctp.cmf.sedproject.document.warrant.journal.impl",
    "ru.croc.ctp.cmf.sedproject.document.warrant.regnumber" })
public class WarrantDocumentConfig {

}
