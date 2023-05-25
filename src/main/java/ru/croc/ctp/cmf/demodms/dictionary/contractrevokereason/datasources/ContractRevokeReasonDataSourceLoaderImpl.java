package ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.datasources;

import static org.apache.commons.lang3.BooleanUtils.isNotTrue;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.ContractRevokeReason;
import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.QContractRevokeReason;
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent;
import ru.croc.ctp.jxfw.core.load.LoadContext;
import ru.croc.ctp.jxfw.core.load.QueryParams;

/**
 * Имплементация загрузчика источника данных причин расторжения/аннулирования договоров.
 *
 * @author Andrei Dubonos
 * @since 2019.04.03
 */
@XFWDataSourceComponent
public class ContractRevokeReasonDataSourceLoaderImpl extends ContractRevokeReasonDataSourceLoader {

    /**
     * Фабрика запросов QueryDsl.
     */
    @Autowired
    JPQLQueryFactory jpqlQueryFactory;

    @Override
    public JPQLQuery<ContractRevokeReason> query(final LoadContext<ContractRevokeReason> loadContext,
            final BooleanBuilder whereClause,
            final QueryParams<ContractRevokeReason, String> queryParams) {
        final JPQLQuery<ContractRevokeReason> query =
                jpqlQueryFactory.selectFrom(QContractRevokeReason.contractRevokeReason)
                        .where(whereClause)
                        .orderBy(QContractRevokeReason.contractRevokeReason.name.asc());
        return query;
    }

    @Override
    public Predicate createPredicate() {
        return new BooleanBuilder()
                .and(isEmpty(searchString)
                        ? null
                        : QContractRevokeReason.contractRevokeReason.name.containsIgnoreCase(searchString))
                .and(!isNotTrue(allowDeleted) ? null : QContractRevokeReason.contractRevokeReason.deleted.isFalse());
    }
}
