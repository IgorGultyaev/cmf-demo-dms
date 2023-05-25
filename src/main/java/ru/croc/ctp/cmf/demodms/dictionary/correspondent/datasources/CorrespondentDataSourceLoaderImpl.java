package ru.croc.ctp.cmf.demodms.dictionary.correspondent.datasources;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import com.querydsl.jpa.JPQLQuery;
import com.querydsl.jpa.JPQLQueryFactory;
import org.apache.commons.lang3.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.AbstractCorrespondent;
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.QAbstractCorrespondent;
import ru.croc.ctp.jxfw.core.datasource.meta.XFWDataSourceComponent;
import ru.croc.ctp.jxfw.core.load.LoadContext;
import ru.croc.ctp.jxfw.core.load.QueryParams;

/**
 * Имплементация загрузчика данных справочника корреспондентов.
 *
 * @author Dmitry Malenok
 */
@XFWDataSourceComponent
public class CorrespondentDataSourceLoaderImpl extends CorrespondentDataSourceLoader {

    /**
     * Фабрика запросов QueryDsl.
     */
    @Autowired
    JPQLQueryFactory jpqlQueryFactory;

    @Override
    public Predicate createPredicate() {
        return new BooleanBuilder()
                .and(name == null ? null : QAbstractCorrespondent.abstractCorrespondent.name.containsIgnoreCase(name))
                .and(BooleanUtils.isTrue(deleted)
                        ? null
                        : QAbstractCorrespondent.abstractCorrespondent.deleted.isFalse());
    }

    @Override
    public JPQLQuery<AbstractCorrespondent> query(final LoadContext<AbstractCorrespondent> loadContext,
            final BooleanBuilder whereClause,
            final QueryParams<AbstractCorrespondent, String> queryParams) {
        final JPQLQuery<AbstractCorrespondent> query =
                jpqlQueryFactory.selectFrom(QAbstractCorrespondent.abstractCorrespondent)
                        .where(whereClause)
                        .orderBy(QAbstractCorrespondent.abstractCorrespondent.name.asc());
        return query;
    }
}
