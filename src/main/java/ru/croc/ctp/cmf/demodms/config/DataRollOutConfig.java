package ru.croc.ctp.cmf.demodms.config;

import org.flywaydb.core.Flyway;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

/**
 * Конфигурация развёртывания данных приложения в БД.
 * <p/>
 * Т.к. пока схему БД разворачивает Hibernate, нельзя использовать стандартную конфигурацию Spring Boot для Flyway,
 * который проектировался исходя из того, что наоборот, схема будет развёрнута Flyway. Потому запускаем развёртывание
 * после инициализации всех бинов.
 * 
 * @author Dmitry Malenok
 */
@Configuration
public class DataRollOutConfig {

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(DataRollOutConfig.class);

    /**
     * Развёртывание данных.
     * 
     * @param dataSource
     *            источник данных БД
     * @return не важно
     */
    @Bean(name = "datarollout")
            InitializingBean rollOutData(final DataSource dataSource) {
        return () -> {
            final Flyway flyway = new Flyway();
            flyway.setBaselineOnMigrate(true);
            flyway.setLocations("classpath:db/migration/common/data");
            flyway.setDataSource(dataSource);
            final int applied = flyway.migrate();

            LOG.info("The application data has been rolled out. {} migrations has been applied.", applied);
        };
    }
}
