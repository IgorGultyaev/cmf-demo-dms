package ru.croc.ctp.cmf.demodms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import ru.croc.ctp.cmf.core.jpa.converter.NewZonedDateTimeProviderConfig;
import ru.croc.ctp.cmf.core.jpa.service.config.CmfJpaServiceConfig;
import ru.croc.ctp.cmf.core.jpa.store.springauditing.CmfStoreSpringAuditingConfig;
import ru.croc.ctp.cmf.core.lock.config.CmfCoreLockConfig;
import ru.croc.ctp.cmf.demodms.config.environment.DatabaseConfig;
import ru.croc.ctp.cmf.demodms.dictionary.DictionaryConfig;
import ru.croc.ctp.cmf.demodms.document.DocumentConfig;
import ru.croc.ctp.cmf.demodms.security.CmfDemoSedSecurityConfiguration;
import ru.croc.ctp.cmf.dms.audit.DmsAuditConfig;
import ru.croc.ctp.cmf.dms.bookmarks.BookmarksConfig;
import ru.croc.ctp.cmf.dms.client.web.WebClientConfig;
import ru.croc.ctp.cmf.dms.comment.CommentConfig;
import ru.croc.ctp.cmf.dms.commission.CommissionConfig;
import ru.croc.ctp.cmf.dms.content.BaseContentConfig;
import ru.croc.ctp.cmf.dms.dashboard.DmsDashboardConfig;
import ru.croc.ctp.cmf.dms.document.process.DocumentProcessConfig;
import ru.croc.ctp.cmf.dms.integration.IntegrationConfig;
import ru.croc.ctp.cmf.dms.lock.LockConfig;
import ru.croc.ctp.cmf.dms.mail.DmsMailConfig;
import ru.croc.ctp.cmf.dms.regnumber.RegNumberConfig;
import ru.croc.ctp.cmf.dms.relation.RelationConfig;
import ru.croc.ctp.cmf.dms.rendition.AppRenditionConfig;
import ru.croc.ctp.cmf.dms.search.SearchConfig;
import ru.croc.ctp.cmf.dms.task.AppTaskConfig;
import ru.croc.ctp.cmf.sedproject.config.SedProjectConfig;
import ru.croc.ctp.jxfw.core.config.XfwCoreConfig;
import ru.croc.ctp.jxfw.wc.WebClientLoaderConfig;

/**
 * Основной конфигурационный файл приложения.
 * <p/>
 * Сформирован так, чтобы его можно было использовать для тестов.
 *
 * @author Dmitry Malenok
 */
@Configuration
@EnableJpaAuditing
@EnableAsync
@Import({ DatabaseConfig.class,
    XfwCoreConfig.class,
    WebClientLoaderConfig.class,
    NewZonedDateTimeProviderConfig.class,
    CmfJpaServiceConfig.class,
    CmfCoreLockConfig.class,
    BaseContentConfig.class,
    CmfDemoSedSecurityConfiguration.class,
    DocumentProcessConfig.class,
    DataRollOutConfig.class,
    DictionaryConfig.class,
    DocumentConfig.class,
    RegNumberConfig.class,
    AppTaskConfig.class,
    JpaSqlQueryFactoryConfig.class,
    LockConfig.class,
    IntegrationConfig.class,
    AppRenditionConfig.class,
    AppWebSocketConfig.class,
    BookmarksConfig.class,
    CommissionConfig.class,
    SedProjectConfig.class,
    SearchConfig.class,
    CommentConfig.class,
    CmfStoreSpringAuditingConfig.class,
    DmsDashboardConfig.class,
    RelationConfig.class,
    DmsAuditConfig.class,
    DmsMailConfig.class,
    WebClientConfig.class})
public class CmfDemoDmsConfig {

}
