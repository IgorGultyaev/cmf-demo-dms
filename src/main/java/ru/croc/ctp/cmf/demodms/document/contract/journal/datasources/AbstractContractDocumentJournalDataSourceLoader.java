package ru.croc.ctp.cmf.demodms.document.contract.journal.datasources;

import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.core.jpa.datasource.AbstractTransformSupportedPagableGeneralDataSourceLoader;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.domain.ContractState;
import ru.croc.ctp.cmf.demodms.document.contract.domain.QContractDocument;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.ContractDocumentJournalFilter;
import ru.croc.ctp.cmf.demodms.document.contract.journal.domain.QContractDocumentJournalRecord;
import ru.croc.ctp.cmf.dms.dictionary.orgstructure.EmployeePositionResolver;
import ru.croc.ctp.cmf.dms.security.base.DmsUserDetails;
import ru.croc.ctp.cmf.security.currentuser.CurrentUserDetailsAdapterFactory;
import ru.croc.ctp.jxfw.core.load.GeneralLoadContext;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.annotation.Nonnull;

/**
 * Базовый класс загрузчиков данных журналов документов Договор.
 *
 * @param <T>
 *            тип возвращаемых сущностей
 * @param <S>
 *            тип данных, возвращаемых QueryDSL запросом
 * @author Andrei Dubonos
 * @since 2019.03.21
 */
abstract class AbstractContractDocumentJournalDataSourceLoader<T, S>
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
     * Создаёт и возвращает предикат на основе информации из фильтра журнала документов Договор.
     *
     * @param loadContext
     *            контекст загрузки
     * @return созданный предикат на основе информации из фильтра журнала документов Договор
     */
    protected BooleanBuilder createPredicate(final GeneralLoadContext<T, Object> loadContext) {
        final QContractDocument document = QContractDocument.contractDocument;
        final ContractDocumentJournalFilter filter = getFilter();

        return new BooleanBuilder(ExpressionUtils.allOf(createJournalRecordPredicate(loadContext),
                filter.getOrganization() == null ? null : document.organization.eq(filter.getOrganization()),
                filter.getContractor() == null
                        ? null
                        : document.contractors.any().contractor.id.eq(filter.getContractor().getId()),
                filter.getStatus() == null ? null : document.status.eq(filter.getStatus()),
                filter.getContractState() == null
                        ? null
                        : document.contractState.eq(ContractState.METADATA.convertToInt(filter.getContractState())),
                isEmpty(filter.getSummary()) ? null : document.summary.containsIgnoreCase(filter.getSummary()),
                filter.getCostFrom() == null ? null : document.cost.goe(filter.getCostFrom()),
                filter.getCostTo() == null ? null : document.cost.loe(filter.getCostTo()),
                filter.getCreationDateFrom() == null ? null : document.creationDate.goe(filter.getCreationDateFrom()),
                filter.getCreationDateTo() == null ? null : document.creationDate.loe(filter.getCreationDateTo()),
                filter.getSigningDateFrom() == null ? null : document.signingDate.goe(filter.getSigningDateFrom()),
                filter.getSigningDateTo() == null ? null : document.signingDate.loe(filter.getSigningDateTo()),
                filter.getPerformer() == null ? null : document.performer.eq(filter.getPerformer()),
                filter.getCurator() == null ? null : document.curator.eq(filter.getCurator()),
                filter.getSignatory() == null ? null : document.signatory.eq(filter.getSignatory()),
                filter.getDealWithInterest() == null
                        ? null
                        : document.dealWithInterest.eq(filter.getDealWithInterest()),
                filter.getBigDeal() == null ? null : document.bigDeal.eq(filter.getBigDeal()),
                filter.getGreatlyDeal() == null ? null : document.greatlyDeal.eq(filter.getGreatlyDeal())));
    }

    /**
     * Создаёт и возвращает предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя.
     *
     * @param loadContext
     *            контекст загрузки
     * @return предикат, оставляющий только те документы, для которые есть в журнале текущего пользователя
     */
    Predicate createJournalRecordPredicate(final GeneralLoadContext<T, Object> loadContext) {
        final String userId = currentUserDetailsAdapterFactory.currentUserDetailsAdapter(loadContext)
                .getCurrentUserDetails()
                .map(user -> user.getUserId())
                .orElseThrow(() -> new IllegalStateException("Unable to resolve user who requests for documents"));

        @SuppressWarnings("null")
        @Nonnull
        final Set<String> employeePositionIds =
                StreamSupport.stream(employeePositionResolver.resolveIdsByUserId(userId).spliterator(), false)
                        .collect(Collectors.toSet());
        final QContractDocument document = QContractDocument.contractDocument;
        final QContractDocumentJournalRecord record = QContractDocumentJournalRecord.contractDocumentJournalRecord;
        return jpqlQueryFactory.selectFrom(record)
                .where(document.id.eq(record.id.entityId).and(record.id.participantId.in(employeePositionIds)))
                .exists();
    }

    /**
     * Возвращает фильтр журнала документов Договор.
     *
     * @return фильтр журнала документов Договор
     */
    @Override
    public abstract ContractDocumentJournalFilter getFilter();

    /**
     * Создаёт и возвращает запрос по получению документов Договор по заданным критериям.
     * <p/>
     * Делаем здесь, чтобы не создавать наследника у наследника, т.к. там нельзя использовать Q-классы.
     *
     * @param loadContext
     *            контекст загрузки
     * @return запрос по получению документов Договор по заданным критериям
     */
    JPQLQuery<ContractDocument> createContractQuery(final GeneralLoadContext<T, Object> loadContext) {
        return jpqlQueryFactory.selectFrom(QContractDocument.contractDocument).where(createPredicate(loadContext));
    }

}
