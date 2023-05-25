-- Создание связей между типами и видами документов

-- Исходящий документ
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_Application');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_Letter');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_CoveringLetter');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_Ref');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_Notification');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_LetterOfGuarantee');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_outgoingDocument', 'id_DocumentKind_Notice');

-- Входящий документ
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_Application');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_Letter');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_CoveringLetter');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_Ref');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_Notification');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_LetterOfGuarantee');
insert into cmf_documenttypes_documentkinds (documenttype_id, documentkind_id) values ('id_documentType_incomingDocument', 'id_DocumentKind_Notice');