-- Создание шаблона регномера для документа Договор

insert into cmf_regnumber_template(id, template, creation_time, last_modified_time, ts, type_id)  values ('id_template_contract_document', 'СЭД-{$НУМОБЩПОДТИП}-{Г}-дог', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1, 'id_documentType_contractDocument');
