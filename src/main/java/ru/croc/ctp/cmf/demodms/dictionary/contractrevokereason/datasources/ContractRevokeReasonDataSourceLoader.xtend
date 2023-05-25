package ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.datasources

import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.ContractRevokeReasonControllerApiPath
import ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason.domain.ContractRevokeReason
import ru.croc.ctp.jxfw.core.generator.meta.XFWDataSource
import ru.croc.ctp.jxfw.jpa.datasource.PagingJpaDataSourceLoader

/**
 * Загрузчик источника данных причин расторжения/аннулирования договоров.
 */
@XFWDataSource(ContractRevokeReasonControllerApiPath.DATASOURCE_CONTRACT_REVOKE_REASON_DICTIONARY_PATH)
abstract class ContractRevokeReasonDataSourceLoader extends PagingJpaDataSourceLoader<ContractRevokeReason, String> {

    /**
     * Подстрока, по которой производится фильтрация причин расторжения/аннулирования договоров (по всем полям).

     */
    protected String searchString;

    /**
     * Флаг, указывающий необходимость выдачи удалённых сущностей.
     */
    protected Boolean allowDeleted;
}
