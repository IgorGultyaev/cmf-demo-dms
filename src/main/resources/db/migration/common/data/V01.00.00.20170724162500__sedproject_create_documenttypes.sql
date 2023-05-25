-- Начальное наполнение справочника типов и подтипов документов для доверенности.

-- Тип
insert into cmf_documenttype (id, parent_id, dtype, name, deleted, system_name, template_document_entity_name, creation_time, last_modified_time, ts) values ('id_documentType_warrantDocument',  'id_documentType_warrantDocument', 'type', 'Доверенность', false, 'DocumentType_Warrant', 'WarrantDocument', '2017-07-24 16:25:00', '2017-07-24 16:25:00', 1);

-- Подтипы
insert into cmf_documenttype (id, parent_id, dtype, name, deleted, creation_time, last_modified_time, ts) values ('id_documentSubType_warrantDocument', 'id_documentType_warrantDocument', 'subtype', 'Доверенность ', false, '2017-07-24 16:25:00', '2017-07-24 16:25:00',  1);

-- Шаблоны
-- РиК
insert into cmf_document_common (id, dtype, document_type_id, organization_id, identifier, creation_date, author_id, status_id, permission, acl_id, creation_time, last_modified_time, ts) values ('id_WarrantDocument_emptyWarrantDocumentTemplate_ooorik', 'warrant', 'id_documentSubType_warrantDocument', 'id_org_structure_ooorik', 'template', '2018-07-31', 'id_org_structure_ivanov', 'id_DocumentStatus_Template', 0, 'id_acl_CommonDocumentTemplate', '2018-07-31 15:53:23', '2018-07-31 15:53:23', 0);
insert into cmf_document_warrant (id, notarization_required) values ('id_WarrantDocument_emptyWarrantDocumentTemplate_ooorik', false);
insert into cmf_documenttemplate (id, parent_id, company_id, name, deleted, document_id, creation_time, last_modified_time, ts) values ('id_documentTemplate_emptyWarrant_ooorik', 'id_documentSubType_warrantDocument', 'id_org_structure_ooorik', 'Пустой шаблон доверенности', false, 'id_WarrantDocument_emptyWarrantDocumentTemplate_ooorik', '2017-07-24 16:25:00', '2017-07-24 16:25:00',  1);

-- ТрансКапиталРазвитие
insert into cmf_document_common (id, dtype, document_type_id, organization_id, identifier, creation_date, author_id, status_id, permission, acl_id, creation_time, last_modified_time, ts) values ('id_WarrantDocument_emptyOutgoingDocumentTemplate_transcapitalrazvitie', 'warrant', 'id_documentSubType_warrantDocument', 'id_orgstructure_tcr_transcapitalrazvitie', 'template', '2018-07-31', 'id_orgstructure_tcr_kirillova2', 'id_DocumentStatus_Template', 0, 'id_acl_CommonDocumentTemplate', '2018-07-31 15:53:23', '2018-07-31 15:53:23', 0);
insert into cmf_document_warrant (id, notarization_required) values ('id_WarrantDocument_emptyOutgoingDocumentTemplate_transcapitalrazvitie', false);
insert into cmf_documenttemplate (id, parent_id, company_id, name, deleted, document_id, creation_time, last_modified_time, ts) values ('id_documentTemplate_emptyWarrant_transcapitalrazvitie', 'id_documentSubType_warrantDocument', 'id_orgstructure_tcr_transcapitalrazvitie', 'Пустой шаблон доверенности', false, 'id_WarrantDocument_emptyOutgoingDocumentTemplate_transcapitalrazvitie', '2017-07-24 16:25:00', '2017-07-24 16:25:00',  1);
