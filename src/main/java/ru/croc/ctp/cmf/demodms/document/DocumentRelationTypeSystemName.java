package ru.croc.ctp.cmf.demodms.document;

/**
 * Системные идентификаторы типов связей документов.
 * 
 * @author Dmitry Malenok
 * @see ru.croc.ctp.cmf.dms.relation.domain.RelationType
 */
public final class DocumentRelationTypeSystemName {

    /**
     * Связь "В ответ на" от входящего к исходящему.
     */
    public static final String DRTSN_IN_RESPONSE_TO_STR = "id_RelationType_InResponseTo_straight";

    /**
     * Связь "В ответ на" от исходящего к входящему.
     */
    public static final String DRTSN_IN_RESPONSE_TO_REV = "id_RelationType_InResponseTo_reverse";
}
