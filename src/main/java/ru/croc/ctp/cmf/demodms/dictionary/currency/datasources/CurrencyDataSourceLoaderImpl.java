package ru.croc.ctp.cmf.demodms.dictionary.currency.datasources;

import static org.apache.commons.lang3.BooleanUtils.isNotTrue;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.demodms.dictionary.currency.domain.Currency;
import ru.croc.ctp.cmf.demodms.dictionary.currency.domain.QCurrency;
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent;
import ru.croc.ctp.jxfw.core.load.LoadContext;
import ru.croc.ctp.jxfw.core.load.QueryParams;

/**
 * Имплементация загрузчика источника данных валют.
 *
 * @author Andrei Dubonos
 * @since 2019.04.01
 */
@XFWDataSourceComponent
public class CurrencyDataSourceLoaderImpl extends CurrencyDataSourceLoader {

    /**
     * Фабрика запросов QueryDsl.
     */
    @Autowired
    JPQLQueryFactory jpqlQueryFactory;

    @Override
    public JPQLQuery<Currency> query(final LoadContext<Currency> loadContext,
            final BooleanBuilder whereClause,
            final QueryParams<Currency, String> queryParams) {
        final JPQLQuery<Currency> query = jpqlQueryFactory.selectFrom(QCurrency.currency)
                .where(whereClause)
                .orderBy(QCurrency.currency.name.asc());
        return query;
    }

    @Override
    public Predicate createPredicate() {
        return new BooleanBuilder()
                .and(isEmpty(searchString)
                        ? null
                        : QCurrency.currency.name.containsIgnoreCase(searchString)
                                .or(QCurrency.currency.codeAlfa.containsIgnoreCase(searchString))
                                .or(QCurrency.currency.codeNumber.containsIgnoreCase(searchString)))
                .and(!isNotTrue(allowDeleted) ? null : QCurrency.currency.deleted.isFalse());
    }
}
