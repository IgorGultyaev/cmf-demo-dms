package ru.croc.ctp.cmf.demodms.config;

import static com.google.common.base.Preconditions.checkNotNull;

import com.querydsl.jpa.sql.JPASQLQuery;
import com.querydsl.sql.SQLTemplates;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.croc.ctp.cmf.core.jpa.service.JpaSqlQueryFactory;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Конфигурация фабрики {@link JPASQLQuery}.
 * 
 * @author Dmitry Malenok
 */
@Configuration
public class JpaSqlQueryFactoryConfig {

    @SuppressWarnings("null")
    @Nonnull
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Возвращает фабрику {@link JPASQLQuery}.
     *
     * @param sqlTemplates
     *            настройки диалекта БД
     * @return фабрику {@link JPASQLQuery}
     */
    @SuppressFBWarnings("SIC_INNER_SHOULD_BE_STATIC_ANON") // Создаётся только раз при поднятии контекста
    @Bean
    public JpaSqlQueryFactory jpaSqlQueryFactory(final SQLTemplates sqlTemplates) {
        return new JpaSqlQueryFactory() {

            /**
             * Менеджер сущостей.
             */
            @Nullable
            EntityManager entityManager;

            /**
             * Настройки диалекта БД.
             */
            @Nullable
            SQLTemplates sqlTemplates;

            @Override
            public <T> JPASQLQuery<T> query() {
                return new JPASQLQuery<>(checkNotNull(entityManager), checkNotNull(sqlTemplates));
            }

            JpaSqlQueryFactory init(final EntityManager entityManager, final SQLTemplates sqlTemplates) {
                this.entityManager = entityManager;
                this.sqlTemplates = sqlTemplates;
                return this;
            }
        }.init(entityManager, sqlTemplates);
    }
}
