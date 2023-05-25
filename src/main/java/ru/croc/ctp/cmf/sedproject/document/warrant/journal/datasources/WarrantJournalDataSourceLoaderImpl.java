package ru.croc.ctp.cmf.sedproject.document.warrant.journal.datasources;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.EmployeePositionResolver;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.security.currentuser.CurrentUserDetailsAdapterFactory;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.QWarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.domain.WarrantDocument;
import ru.croc.ctp.cmf.sedproject.document.warrant.journal.domain.QWarrantJournalRecord;
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent;
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.Nonnull;

/**
 * Имплементация загрузчика данных для журнала доверенностей.
 *
 * @author Dmitry Malenok
 */
@XFWDataSourceComponent
public class WarrantJournalDataSourceLoaderImpl extends WarrantJournalDataSourceLoader {

    /**
     * Фабрика запросов.
     */
    @Autowired
    JPQLQueryFactory jpqlQueryFactory;

    /**
     * Сервис определения сотрудников в должности.
     */
    @Autowired
    EmployeePositionResolver employeePositionResolver;

    /**
     * Фабрика создания адаптеров получения/установки информации о текущем пользователе.
     */
    @Autowired
    CurrentUserDetailsAdapterFactory<DmsUserDetails> currentUserDetailsAdapterFactory;

    @Override
    protected JPQLQuery<WarrantDocument> createQuery(final GeneralLoadContext<WarrantDocument, Object> loadContext) {
        final QWarrantDocument document = QWarrantDocument.warrantDocument;
        final JPQLQuery<WarrantDocument> query = jpqlQueryFactory.selectFrom(document);

        query.where(createJournaRecordPredicate(loadContext),
                isEmpty(filter.getRegNumber()) ? null : document.regNumber.containsIgnoreCase(filter.getRegNumber()),
                isEmpty(filter.getIdentifier()) ? null : document.identifier.containsIgnoreCase(filter.getIdentifier()),
                filter.getStatus() == null ? null : document.status.eq(filter.getStatus()),
                filter.getStartDate() == null ? null : document.startDate.goe(filter.getStartDate()),
                filter.getOrganization() == null ? null : document.organization.eq(filter.getOrganization()));

        return query;

    }

    /**
     * Создаёт и возвращает предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя.
     *
     * @param loadContext
     *            контекст загрузки
     * @return предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя
     */
    Predicate createJournaRecordPredicate(final GeneralLoadContext<WarrantDocument, Object> loadContext) {
        final String userId = currentUserDetailsAdapterFactory.currentUserDetailsAdapter(loadContext)
                .getCurrentUserDetails()
                .map(user -> user.getUserId())
                .orElseThrow(() -> new IllegalStateException("Unable to resolve user who requests for documents"));

        @SuppressWarnings("null")
        @Nonnull
        final Set<String> employeePositionIds =
                StreamSupport.stream(employeePositionResolver.resolveIdsByUserId(userId).spliterator(), false)
                        .collect(Collectors.toSet());
        final QWarrantDocument document = QWarrantDocument.warrantDocument;
        final QWarrantJournalRecord record = QWarrantJournalRecord.warrantJournalRecord;
        return jpqlQueryFactory.selectFrom(record)
                .where(document.id.eq(record.id.entityId).and(record.id.participantId.in(employeePositionIds)))
                .exists();
    }
}
