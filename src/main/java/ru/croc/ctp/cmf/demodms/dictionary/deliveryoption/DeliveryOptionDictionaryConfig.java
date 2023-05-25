package ru.croc.ctp.cmf.demodms.dictionary.deliveryoption;

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
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.repo" })
@Import({ XfwJpaConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.facade",
        "ru.croc.ctp.cmf.demodms.dictionary.deliveryoption.domain.service" })
public class DeliveryOptionDictionaryConfig {
}
