-- Начальное наполнение справочника типов и подтипов документа Договор.

insert into cmf_documenttype (id, parent_id, dtype, name, deleted, system_name, template_document_entity_name, creation_time, last_modified_time, ts) values ('id_documentType_contractDocument',  'id_documentType_contractDocument', 'type', 'Договор', false, 'DocumentType_Contract', 'ContractDocument', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_documenttype (id, parent_id, dtype, name, deleted, creation_time, last_modified_time, ts) values ('id_documentSubType_contractDocument', 'id_documentType_contractDocument', 'subtype', 'Договор ', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15',  1);
