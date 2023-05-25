package ru.croc.ctp.cmf.demodms.dictionary.contractrevokereason;

import ru.croc.ctp.cmf.demodms.dictionary.DictionaryControllerApiPath;

/**
 * Пути к внешнему API работы со справочником причин расторжения/аннулирования договоров.
 *
 * @see DictionaryControllerApiPath
 * @author Andrei Dubonos
 * @since 2019.04.03
 */
public class ContractRevokeReasonControllerApiPath {

    /**
     * Путь контроллера справочника причин расторжения/аннулирования договоров.
     */
    private static final String CONTRACT_REVOKE_REASON_CONTROLLER = "/contract_revoke_reason";

    /**
     * Полный путь до контроллера справочника причин расторжения/аннулирования договоров.
     */
    public static final String BASE_CONTRACT_REVOKE_REASON_DICTIONARY_PATH =
            DictionaryControllerApiPath.PATH_DICTIONARY + CONTRACT_REVOKE_REASON_CONTROLLER;

    /**
     * Относительный путь до контроллера справочника причин расторжения/аннулирования договоров.
     */
    public static final String DATASOURCE_CONTRACT_REVOKE_REASON_DICTIONARY_PATH =
            DictionaryControllerApiPath.DATASOURCE_BASE_DICTIONARY + CONTRACT_REVOKE_REASON_CONTROLLER;

}
