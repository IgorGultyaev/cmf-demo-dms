package ru.croc.ctp.cmf.demodms.dictionary.contractor.datasources;

import static org.apache.commons.lang3.BooleanUtils.isNotTrue;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.Contractor;
import ru.croc.ctp.cmf.demodms.dictionary.contractor.domain.QContractor;
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent;
import ru.croc.ctp.jxfw.core.load.LoadContext;
import ru.croc.ctp.jxfw.core.load.QueryParams;

/**
 * Имплементация загрузчика источника данных контрагентов.
 *
 * @author Andrei Dubonos
 * @since 2019.04.22
 */
@XFWDataSourceComponent
public class ContractorDataSourceLoaderImpl extends ContractorDataSourceLoader {

    /**
     * Фабрика запросов QueryDsl.
     */
    @Autowired
    JPQLQueryFactory jpqlQueryFactory;

    @Override
    public JPQLQuery<Contractor> query(final LoadContext<Contractor> loadContext,
            final BooleanBuilder whereClause,
            final QueryParams<Contractor, String> queryParams) {
        final JPQLQuery<Contractor> query = jpqlQueryFactory.selectFrom(QContractor.contractor)
                .where(whereClause)
                .orderBy(QContractor.contractor.name.asc());
        return query;
    }

    @Override
    public Predicate createPredicate() {
        return new BooleanBuilder()
                .and(isEmpty(searchString)
                        ? null
                        : QContractor.contractor.name.containsIgnoreCase(searchString)
                                .or(QContractor.contractor.shortName.containsIgnoreCase(searchString))
                                .or(QContractor.contractor.ogrn.containsIgnoreCase(searchString))
                                .or(QContractor.contractor.inn.containsIgnoreCase(searchString))
                                .or(QContractor.contractor.kpp.containsIgnoreCase(searchString))
                                .or(QContractor.contractor.comment.containsIgnoreCase(searchString)))
                .and(!isNotTrue(allowDeleted) ? null : QContractor.contractor.deleted.isFalse());
    }
}
