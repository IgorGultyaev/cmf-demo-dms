package ru.croc.ctp.cmf.demodms.dictionary.correspondent;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.jxfw.jpa.config.XfwJpaConfig;

/**
 * Конфигурация справочника.
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.repo" })
@Import({ XfwJpaConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.facade",
        "ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.service",
        "ru.croc.ctp.cmf.demodms.dictionary.correspondent.datasources" })
public class CorrespondentConfig {
}
