package ru.croc.ctp.cmf.demodms.dictionary.currency;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.jxfw.jpa.config.XfwJpaConfig;

/**
 * Конфигурация справочника валют.
 *
 * @author Andrei Dubonos
 * @since 2019.04.01
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.currency.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.currency.domain.repo" })
@Import({ XfwJpaConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.currency.domain.facade",
        "ru.croc.ctp.cmf.demodms.dictionary.currency.domain.service",
        "ru.croc.ctp.cmf.demodms.dictionary.currency.datasources" })
public class CurrencyDictionaryConfig {
}
