package ru.croc.ctp.cmf.demodms.config.environment;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;

import javax.sql.DataSource;

/**
 * Конфигурация подключения к внешней БД.
 *
 * @author Dmitry Malenok
 */
@Configuration
@ConditionalOnProperty(prefix = DatabaseConfig.PREFIX_APP_DATASOURCE, name = "embedded", havingValue = "false")
public class ExternalDatabaseConfig {

    /**
     * Создание источника данных к БД, в которой хранится информация системы.
     * <p/>
     * Код взят отсюда
     * {@link org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.NonEmbeddedConfiguration} +
     * результат обёрнут в {@link TransactionAwareDataSourceProxy}.
     * 
     * @param properties
     *            конфигурация источника данных
     * @return источник данных к БД, в которой хранится информация системы
     */
    @Bean(name = "SqlDataSource")
    @Primary
    public DataSource dataSource(final DataSourceProperties properties) {
        final DataSourceBuilder<?> factory = properties.initializeDataSourceBuilder()
                .driverClassName(properties.getDriverClassName())
                .url(properties.getUrl())
                .username(properties.getUsername())
                .password(properties.getPassword());
        if (properties.getType() != null) {
            factory.type(properties.getType());
        }
        return new TransactionAwareDataSourceProxy(factory.build());
    }
}
