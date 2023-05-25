package ru.croc.ctp.cmf.demodms.document.outgoing.journal.datasources;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.core.jpa.datasource.AbstractTransformSupportedPagableGeneralDataSourceLoader;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.OutgoingDocumentJournalFilter;
import ru.croc.ctp.cmf.demodms.document.domain.QOutgoingDocument;
import ru.croc.ctp.cmf.demodms.document.domain.QOutgoingDocumentJournalRecord;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.EmployeePositionResolver;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.security.currentuser.CurrentUserDetailsAdapterFactory;
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.Nonnull;

/**
 * Базовый класс загрузчиков данных журналов исходящих документов.
 *
 * @param <T>
 *            тип возвращаемых сущностей
 * @param <S>
 *            тип данных, возвращаемых QueryDSL запросом
 * @author Dmitry Malenok
 */
abstract class AbstractOutgoingDocumentJournalDataSourceLoader<T, S>
        extends AbstractTransformSupportedPagableGeneralDataSourceLoader<T, S, JPQLQuery<S>> {

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

    /**
     * Создаёт и возвращает предикат на основе информации из фильтра журнала исходящих документов.
     *
     * @param loadContext
     *            контекст загрузки
     * @return созданный предикат на основе информации из фильтра журнала исходящих документов
     */
    protected BooleanBuilder createPredicate(final GeneralLoadContext<T, Object> loadContext) {
        final QOutgoingDocument document = QOutgoingDocument.outgoingDocument;
        final OutgoingDocumentJournalFilter filter = getFilter();

        return new BooleanBuilder(ExpressionUtils.allOf(createJournaRecordPredicate(loadContext),
                isEmpty(filter.getRegNumber()) ? null : document.regNumber.containsIgnoreCase(filter.getRegNumber()),
                isEmpty(filter.getIdentifier()) ? null : document.identifier.containsIgnoreCase(filter.getIdentifier()),
                isEmpty(filter.getSummary()) ? null : document.summary.containsIgnoreCase(filter.getSummary()),
                filter.getStatus() == null ? null : document.status.eq(filter.getStatus()),
                filter.getPerformer() == null ? null : document.performer.eq(filter.getPerformer()),
                filter.getCorrespondent() == null
                        ? null
                        : document.addressees.any().correspondent.id.eq(filter.getCorrespondent().getId()),
                filter.getRegDateFrom() == null ? null : document.regDate.goe(filter.getRegDateFrom()),
                filter.getRegDateTo() == null ? null : document.regDate.loe(filter.getRegDateTo()),
                filter.getCreatedFrom() == null ? null : document.creationDate.goe(filter.getCreatedFrom()),
                filter.getCreatedTo() == null ? null : document.creationDate.loe(filter.getCreatedTo()),
                filter.getNomenclatureCase() == null
                        ? null
                        : document.nomenclatureCase.id.eq(filter.getNomenclatureCase().getId())));
    }

    /**
     * Создаёт и возвращает предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя.
     *
     * @param loadContext
     *            контекст загрузки
     * @return предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя
     */
    Predicate createJournaRecordPredicate(final GeneralLoadContext<T, Object> loadContext) {
        final String userId = currentUserDetailsAdapterFactory.currentUserDetailsAdapter(loadContext)
                .getCurrentUserDetails()
                .map(user -> user.getUserId())
                .orElseThrow(() -> new IllegalStateException("Unable to resolve user who requests for documents"));

        @SuppressWarnings("null")
        @Nonnull
        final Set<String> employeePositionIds =
                StreamSupport.stream(employeePositionResolver.resolveIdsByUserId(userId).spliterator(), false)
                        .collect(Collectors.toSet());
        final QOutgoingDocument document = QOutgoingDocument.outgoingDocument;
        final QOutgoingDocumentJournalRecord record = QOutgoingDocumentJournalRecord.outgoingDocumentJournalRecord;
        return jpqlQueryFactory.selectFrom(record)
                .where(document.id.eq(record.id.entityId).and(record.id.participantId.in(employeePositionIds)))
                .exists();
    }

    /**
     * Возвращает фильтр журнала исходящих документов.
     *
     * @return фильтр журнала исходящих документов
     */
    @Override
    public abstract OutgoingDocumentJournalFilter getFilter();

    /**
     * Создаёт и возвращает запрос по получению исходящих документов по заданным критериям.
     * <p/>
     * Делаем здесь, чтобы не создавать наследника у наследника, т.к. там нельзя использовать Q-классы.
     *
     * @param loadContext
     *            контекст загрузки
     * @return запрос по получению входящих документов по заданным критериям
     */
    JPQLQuery<OutgoingDocument> createCommissionQuery(final GeneralLoadContext<T, Object> loadContext) {
        return jpqlQueryFactory.selectFrom(QOutgoingDocument.outgoingDocument).where(createPredicate(loadContext));
    }

}
