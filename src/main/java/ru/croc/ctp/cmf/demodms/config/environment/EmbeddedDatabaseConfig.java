package ru.croc.ctp.cmf.demodms.config.environment;

import static com.google.common.base.Preconditions.checkArgument;
import static java.util.Objects.requireNonNull;
import static org.apache.commons.lang3.builder.ToStringStyle.SHORT_PREFIX_STYLE;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.apache.commons.lang.UnhandledException;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.ClassUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.reflect.MethodUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabase;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

import javax.annotation.Nullable;
import javax.sql.DataSource;

/**
 * Конфигурация подключения к внутренней БД.
 *
 * @author Dmitry Malenok
 */
@Configuration
@ConditionalOnProperty(prefix = DatabaseConfig.PREFIX_APP_DATASOURCE, name = "embedded", havingValue = "true")
public class EmbeddedDatabaseConfig {

    /**
     * Префикс настроек подключений к внутреннему H2.
     */
    static final String PREFIX_APP_H2 = "app.h2";

    /**
     * Префикс настроек слушателя tcp подключений к внутреннему H2.
     * 
     * @see H2ServerProperties#tcpserver
     */
    static final String PREFIX_APP_H2_TCPSERVER = PREFIX_APP_H2 + ".tcpserver";

    /**
     * Логгер.
     */
    private static final Logger LOG = LoggerFactory.getLogger(EmbeddedDatabaseConfig.class);

    /**
     * Ссылка на БД.
     */
    @Nullable
    private EmbeddedDatabase database;

    /**
     * Дополнительные настройки внутренней H2.
     */
    @Component
    @ConfigurationProperties(prefix = PREFIX_APP_H2)
    static class H2ServerProperties {

        /**
         * Настройки слушателя tcp подключений к внутреннему H2.
         */
        public static class TcpServerProperties {

            /**
             * Флаг, указывающий следует ли поднимать слушатель tcp подключений к внутреннему H2.
             */
            private boolean enabled = false;

            /**
             * Аргументы, передаваемые слушателю.
             */
            private String[] args = new String[] {};

            /**
             * Возвращает флаг, указывающий следует ли поднимать слушатель tcp подключений к внутреннему H2.
             *
             * @return флаг, указывающий следует ли поднимать слушатель tcp подключений к внутреннему H2
             */
            public boolean isEnabled() {
                return enabled;
            }

            /**
             * Устанавливает флаг, указывающий следует ли поднимать слушатель tcp подключений к внутреннему H2.
             *
             * @param enabled
             *            устанавливаемый флаг, указывающий следует ли поднимать слушатель tcp подключений к внутреннему
             *            H2
             */
            public void setEnabled(final boolean enabled) {
                this.enabled = enabled;
            }

            /**
             * Возвращает аргументы, передаваемые слушателю.
             *
             * @return аргументы, передаваемые слушателю
             */
            public String[] getArgs() {
                return requireNonNull(ArrayUtils.clone(args));
            }

            /**
             * Устанавливает аргументы, передаваемые слушателю.
             *
             * @param args
             *            устанавливаемый аргументы, передаваемые слушателю
             */
            @SuppressFBWarnings("EI_EXPOSE_REP2") // аргументы потом не изменяются
            public void setArgs(final String... args) {
                this.args = args;
            }

            @Override
            public String toString() {
                final ToStringBuilder builder = new ToStringBuilder(this, SHORT_PREFIX_STYLE);
                builder.append("enabled", enabled).append("args", args);
                return builder.toString();
            }
        }

        /**
         * Настройки слушателя tcp подключений к внутреннему H2.
         */
        private TcpServerProperties tcpserver = new TcpServerProperties();

        /**
         * Флаг, указывающий, что требуется закрыть подключение к БД при уничтожении контекста.
         */
        private boolean shutdownDatabaseOnDispose = true;

        /**
         * Флаг, указывающий, что требуется выгрузить драйвер БД при уничтожении контекста..
         */
        private boolean shutdownDatabaseDriverOnDispose = true;

        /**
         * Возвращает настройки слушателя tcp подключений к внутреннему H2.
         *
         * @return настройки слушателя tcp подключений к внутреннему H2
         */
        public TcpServerProperties getTcpserver() {
            return tcpserver;
        }

        /**
         * Устанавливает настройки слушателя tcp подключений к внутреннему H2.
         *
         * @param tcpserver
         *            устанавливаемые настройки слушателя tcp подключений к внутреннему H2
         */
        public void setTcpserver(final TcpServerProperties tcpserver) {
            this.tcpserver = tcpserver;
        }

        /**
         * Возвращает флаг, указывающий, что требуется закрыть подключение к БД при уничтожении контекста.
         *
         * @return флаг, указывающий, что требуется закрыть подключение к БД при уничтожении контекста
         */
        public boolean isShutdownDatabaseOnDispose() {
            return shutdownDatabaseOnDispose;
        }

        /**
         * Устанавливает флаг, указывающий, что требуется закрыть подключение к БД при уничтожении контекста.
         *
         * @param shutdownOnDatabaseOnDispose
         *            устанавливаемый флаг, указывающий, что требуется закрыть подключение к БД при уничтожении
         *            контекста
         */
        public void setShutdownDatabaseOnDispose(final boolean shutdownOnDatabaseOnDispose) {
            this.shutdownDatabaseOnDispose = shutdownOnDatabaseOnDispose;
        }

        /**
         * Возвращает флаг, указывающий, что требуется выгрузить драйвер БД при уничтожении контекста.
         *
         * @return флаг, указывающий, что требуется выгрузить драйвер БД при уничтожении контекста
         */
        public boolean isShutdownDatabaseDriverOnDispose() {
            return shutdownDatabaseDriverOnDispose;
        }

        /**
         * Устанавливает флаг, указывающий, что требуется выгрузить драйвер БД при уничтожении контекста.
         *
         * @param shutdownOnDatabaseDriverOnDispose
         *            устанавливаемый флаг, указывающий, что требуется выгрузить драйвер БД при уничтожении контекста
         */
        public void setShutdownDatabaseDriverOnDispose(final boolean shutdownOnDatabaseDriverOnDispose) {
            this.shutdownDatabaseDriverOnDispose = shutdownOnDatabaseDriverOnDispose;
        }

    }

    /**
     * Создание источника данных к БД, в которой хранится информация системы.
     *
     * @return источник данных к БД, в которой хранится информация системы
     */
    @Bean(name = "SqlDataSource")
    @Primary
    public DataSource dataSource() {
        final EmbeddedDatabaseBuilder builder = new EmbeddedDatabaseBuilder();
        database = builder.setType(EmbeddedDatabaseType.H2).build();
        return new TransactionAwareDataSourceProxy(database);
    }

    /**
     * Шатдауним БД H2.
     * 
     * @param properties
     *            Дополнительные настройки внутренней H2
     * @return бин, шатдаунищий БД при уничтожении контекста
     */
    @Order(Ordered.LOWEST_PRECEDENCE)
    @Bean("SqlDataSourceShutdown")
    public DisposableBean closeDataSource(final H2ServerProperties properties) {
        return () -> {
            final EmbeddedDatabase database = this.database;
            if (database != null && properties.isShutdownDatabaseOnDispose()) {
                database.shutdown();
                LOG.info("H2 database has been shutdowned.");
                this.database = null;

                if (properties.isShutdownDatabaseDriverOnDispose()) {
                    try {
                        final Class<?> driverClass = Class.forName("org.h2.Driver");
                        final Method unloadMethod = driverClass.getDeclaredMethod("unload");
                        unloadMethod.invoke(null);
                        LOG.info("H2 driver has been unloaded.");
                    } catch (final RuntimeException exception) {
                        LOG.error("Unable to unload H2 driver.", exception);
                    }
                }
            }
        };
    }

    /**
     * Возвращает бин, который останавливает слушатель для TCP подключения к внутреннему H2 серверу.
     *
     * @param properties
     *            дополнительные настройки внутренней H2
     * @return бин, который останавливает слушатель для TCP подключения к внутреннему H2 серверу.
     */
    @ConditionalOnClass(name = "org.h2.tools.Server")
    @ConditionalOnProperty(prefix = PREFIX_APP_H2_TCPSERVER, name = "enabled", havingValue = "true")
    @Bean
    DisposableBean stopH2Server(final H2ServerProperties properties) {
        final Object h2Server = createH2Server(properties.getTcpserver());
        return () -> {
            MethodUtils.invokeMethod(h2Server, "stop");
        };
    }

    /**
     * Создаёт слушатель для TCP подключения к внутреннему H2 серверу.
     *
     * @param properties
     *            настройки слушателя tcp подключений к внутреннему H2
     * @return слушатель для TCP подключения к внутреннему H2 серверу
     */
    Object createH2Server(final H2ServerProperties.TcpServerProperties properties) {
        try {
            final Class<?> serverClass = ClassUtils.getClass("org.h2.tools.Server");
            final String[] createTcpServerArgs = properties.getArgs();
            final Object server = MethodUtils.invokeStaticMethod(serverClass,
                    "createTcpServer",
                    new Object[] { createTcpServerArgs },
                    new Class<?>[] { createTcpServerArgs.getClass() });
            final Object result = MethodUtils.invokeMethod(server, "start");
            checkArgument(result != null);

            final String serverUrl = (String) MethodUtils.invokeMethod(result, "getURL");
            LOG.info("TCP connection to H2 embedded server: jdbc:h2:{}/mem:testdb", serverUrl);

            return result;
        } catch (final ReflectiveOperationException exception) {
            throw new UnhandledException(exception);
        }
    }

    /**
     * Устанавливает флаг очистки поискового индекса при старте приложения.
     * 
     * @param searchProperties
     *            конфигурация поискового движка
     * @return не важно
     */
/*
    @Bean
    InitializingBean updateClearOnStartSearchProperty(final SearchProperties searchProperties) {
        searchProperties.setClearOnStart(false);
        return () -> {
        };
    }
*/
}
