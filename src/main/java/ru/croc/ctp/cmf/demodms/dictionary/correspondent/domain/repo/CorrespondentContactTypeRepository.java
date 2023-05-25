package ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import ru.croc.ctp.cmf.demodms.dictionary.correspondent.domain.CorrespondentContactType;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Репозиторий доступа к внутреннему справочнику типов контактов.
 * 
 * @author Dmitry Malenok
 */
public interface CorrespondentContactTypeRepository
        extends JpaRepository<CorrespondentContactType, String>, QuerydslPredicateExecutor<CorrespondentContactType> {

    /**
     * Определяет и возвращает тип контакта, соответствующий указанному системному именованному идентификатору.
     * 
     * @param systemName
     *            системный именованный идентификатор, для которого определяется тип
     * @return тип контакта, соответствующий указанному системному именованному идентификатору, или <code>null</code>,
     *         если типа с таким идентификатором нет
     */
    @Nullable
    CorrespondentContactType findOneBySystemName(@Nonnull String systemName);
}
