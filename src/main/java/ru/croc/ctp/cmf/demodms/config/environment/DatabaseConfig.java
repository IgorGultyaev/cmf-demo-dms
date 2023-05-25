package ru.croc.ctp.cmf.demodms.config.environment;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Objects.requireNonNull;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.apache.commons.lang3.StringUtils.substringAfterLast;
import static org.apache.commons.lang3.StringUtils.substringBeforeLast;
import static org.apache.commons.lang3.builder.ToStringStyle.SHORT_PREFIX_STYLE;

import com.querydsl.sql.SQLTemplates;
import org.apache.commons.lang.UnhandledException;
import org.apache.commons.lang3.ClassUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.hibernate.Interceptor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScanPackages;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateSettings;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

/**
 * Конфигурация подключения БД.
 *
 * @author Dmitry Malenok
 */
@Configuration
@Import({ EmbeddedDatabaseConfig.class, ExternalDatabaseConfig.class })
public class DatabaseConfig {

    /**
     * Наименование бина свойств основного источника данных.
     */
    static final String PRIMARY_DATA_SOURCE_PROPERTIS_NAME =
            "spring.datasource-org.springframework.boot.autoconfigure.jdbc.DataSourceProperties";

    /**
     * Префикс настроек источника данных приложения.
     */
    static final String PREFIX_APP_DATASOURCE = "app.datasource";

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(DatabaseConfig.class);

    /**
     * Свойства источника данных приложения.
     */
    @Component
    @ConfigurationProperties(prefix = PREFIX_APP_DATASOURCE)
    static class AppDatasourceProperties {

        /**
         * Флаг, указывающий, является ли источник данных внутренним или внешним.
         */
        private Boolean embedded = Boolean.TRUE;

        /**
         * Полное имя константы, содержащая настройки диалекта БД.
         */
        @Nullable
        private String sqlTemplates;

        /**
         * Возвращает флаг, указывающий, является ли источник данных внутренним или внешним.
         *
         * @return флаг, указывающий, является ли источник данных внутренним или внешним
         */
        public boolean isEmbedded() {
            return embedded;
        }

        /**
         * Устанавливает флаг, указывающий, является ли источник данных внутренним или внешним.
         *
         * @param embedded
         *            устанавливаемый флаг, указывающий, является ли источник данных внутренним или внешним
         */
        public void setEmbedded(@Nullable final Boolean embedded) {
            this.embedded = embedded != null ? embedded : Boolean.FALSE;
        }

        /**
         * Возвращает полное имя константы, содержащая настройки диалекта БД.
         *
         * @return полное имя константы, содержащая настройки диалекта БД
         */
        public String getSqlTemplates() {
            return requireNonNull(sqlTemplates);
        }

        /**
         * Устанавливает полное имя константы, содержащая настройки диалекта БД.
         *
         * @param sqlTemplates
         *            устанавливаемый полное имя константы, содержащая настройки диалекта БД
         */
        public void setSqlTemplates(final String sqlTemplates) {
            this.sqlTemplates = requireNonNull(sqlTemplates);
        }

        @Override
        public String toString() {
            final ToStringBuilder builder = new ToStringBuilder(this, SHORT_PREFIX_STYLE);
            builder.append("embedded", embedded).append("sqlTemplates", sqlTemplates);
            return builder.toString();
        }
    }

    /**
     * Возвращает конфигурацию основного источника данных.
     * <p/>
     * Т.к. у нас более одного источника данных, конфигурации тоже более одной. Здесь помечаем как основную ту, что
     * "приезжает" из spring boot.
     *
     * @param properties
     *            свойства источника данных, сконфигурированные spring boot
     * @return конфигурацию основного источника данных
     */
    @Bean
    @Primary
    public DataSourceProperties
            dataSourceProperties(@Qualifier(PRIMARY_DATA_SOURCE_PROPERTIS_NAME) final DataSourceProperties properties) {
        return properties;
    }

    /**
     * Возвращает создатель фабрики менеджеров основного источника данных.
     * <p/>
     * Т.к. источников данных более одного, приходится конфигурировать руками. За основу взято:
     * JpaBaseConfiguration.entityManagerFactory(EntityManagerFactoryBuilder).
     * <p/>
     * TODO: подумать, как сделать проще
     *
     * @param factoryBuilder
     *            билдер для фабрики сущностей
     * @param dataSource
     *            основной источник данных
     * @param jpaProperties
     *            свойства фабрики
     * @param context
     *            контекст приложения
     * @param interceptor
     *            общий обработчик, перехватывающий вызовы к ORM
     * @return создатель фабрики менеджеров основного источника данных
     */
    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(final EntityManagerFactoryBuilder factoryBuilder,
            final DataSource dataSource,
            final JpaProperties jpaProperties,
            final ApplicationContext context,
            @Nullable @Autowired(required = false) final Interceptor interceptor) {
        final Map<String, Object> vendorProperties =
                new HashMap<>(jpaProperties.getHibernateProperties(new HibernateSettings()));
        if (interceptor != null) {
            vendorProperties.putIfAbsent("hibernate.ejb.interceptor", interceptor);
        }
        // Здесь добавить конфигурацию JTA, если надо
        final List<String> packageNamesToScan = EntityScanPackages.get(context).getPackageNames();
        final LocalContainerEntityManagerFactoryBean result = factoryBuilder.dataSource(dataSource)
                .packages(packageNamesToScan.toArray(new String[packageNamesToScan.size()]))
                .properties(vendorProperties)
                .jta(false)
                .build();
        return requireNonNull(result);
    }

    /**
     * Возвращает основной менеджер транзакций.
     * <p/>
     * Т.к. источников данных более одного, приходится конфигурировать руками. За основу взято:
     * JpaBaseConfiguration.transactionManager().
     *
     * @param entityManagerFactory
     *            фабрика менеджеров транзакций основной сущности
     * @return основной менеджер транзакций
     */
    @Bean//("primaryTransactionManager")
    @Primary
    public PlatformTransactionManager transactionManager(final EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    /**
     * Возвращает настройки диалекта БД.
     *
     * @param properties
     *            свойства источника данных приложения
     * @return настройки диалекта БД
     */
    @Bean
    public SQLTemplates queryDslSqlConfiguration(final AppDatasourceProperties properties) {
        final String sqlTemplates = properties.getSqlTemplates();
        final String className = substringBeforeLast(sqlTemplates, ".");
        final String constantName = substringAfterLast(sqlTemplates, ".");

        checkArgument(isNotEmpty(className) && isNotEmpty(constantName),
                PREFIX_APP_DATASOURCE + ".sql_templates should be set");

        try {
            final Class<?> clazz = ClassUtils.getClass(className);
            final SQLTemplates result = (SQLTemplates) FieldUtils.readStaticField(clazz, constantName);
            return requireNonNull(result);
        } catch (final ReflectiveOperationException exception) {
            throw new UnhandledException(exception);
        }
    }

    /**
     * Логгирование свойств приложения.
     *
     * @param properties
     *            свойства источника данных приложения
     * @return не важно
     */
    @Bean
    InitializingBean logConfig(final AppDatasourceProperties properties) {
        return () -> {
            LOG.info("Application Datasource Properties: {}", properties);
        };
    }
}
