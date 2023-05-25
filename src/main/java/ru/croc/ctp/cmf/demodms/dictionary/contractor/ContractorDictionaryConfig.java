package ru.croc.ctp.cmf.demodms.dictionary.contractor;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.jxfw.jpa.config.XfwJpaConfig;

/**
 * Конфигурация справочника контрагментов.
 *
 * @author Andrei Dubonos
 * @since 2019.04.22
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractor.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.repo" })
@Import({ XfwJpaConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.facade",
        "ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.service",
        "ru.croc.ctp.cmf.demodms.dictionary.contractor.datasources" })
public class ContractorDictionaryConfig {
}
