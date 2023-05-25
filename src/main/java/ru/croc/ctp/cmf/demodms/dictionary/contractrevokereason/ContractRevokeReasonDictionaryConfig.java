package ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import ru.croc.ctp.jxfw.jpa.config.XfwJpaConfig;

/**
 * Конфигурация справочника причин расторжения/аннулирования договоров.
 *
 * @author Andrei Dubonos
 * @since 2019.04.03
 */
@Configuration
@EntityScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain" })
@EnableJpaRepositories(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.repo" })
@Import({ XfwJpaConfig.class })
@ComponentScan(basePackages = { "ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.facade",
        "ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.service",
        "ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.datasources" })
public class ContractRevokeReasonDictionaryConfig {
}
