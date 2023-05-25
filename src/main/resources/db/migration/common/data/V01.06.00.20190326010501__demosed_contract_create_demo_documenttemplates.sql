-- Начальное наполнение справочника типов и подтипов документа Договор (шаблоны документов).

-- РИК
insert into cmf_acl_composite (acl_id, purpose, child_acl_id, allow, ts) values ('acl_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 'commonAclTemplate', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_acl_parent_2_all_children  (acl_id, child_acl_id, allow, ts) values ('acl_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_document_common (id, dtype, document_type_id, organization_id, identifier, creation_date, author_id, status_id, permission, acl_id, creation_time, last_modified_time, ts) values ('id_ContractDocument_emptyContractDocumentTemplate_ooorik', 'contract', 'id_documentSubType_contractDocument', 'id_org_structure_ooorik', 'template', '2019-03-26', 'id_org_structure_ivanov', 'id_DocumentStatus_Template', 0, 'acl_id_ContractDocument_emptyContractDocumentTemplate_ooorik', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_document_contract (id, urgent, paper, prepared_by_contractor, protocol_disagreements, protocol_approve_disagreements, deal_with_interest, big_deal, greatly_deal, official_registration, property_transfer) values ('id_ContractDocument_emptyContractDocumentTemplate_ooorik', false, true, false, false, false, false, false, false, false, false);

insert into cmf_acl_composite (acl_id, purpose, child_acl_id, allow, ts) values ('acl_approval_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 'approving_object', 'acl_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 2147483647, 1);
insert into cmf_acl_parent_2_all_children  (acl_id, child_acl_id, allow, ts) values ('acl_approval_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_approval_iteration (id, document_id, position, state, acl_id, ts) values ('id_ApprovalIteration_emptyContractDocumentTemplateIteration_ooorik', 'id_ContractDocument_emptyContractDocumentTemplate_ooorik', 0, 0, 'acl_approval_id_ContractDocument_emptyContractDocumentTemplate_ooorik', 1);

insert into cmf_documenttemplate (id, parent_id, company_id, name, deleted, document_id, creation_time, last_modified_time, ts) values ('id_documentTemplate_emptyContractDocument_ooorik', 'id_documentSubType_contractDocument', 'id_org_structure_ooorik', 'Пустой шаблон', false, 'id_ContractDocument_emptyContractDocumentTemplate_ooorik', '2019-03-26 13:14:15', '2019-03-26 13:14:15',  1);


-- ТрансКапиталРазвитие
insert into cmf_acl_composite (acl_id, purpose, child_acl_id, allow, ts) values ('acl_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 'commonAclTemplate', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_acl_parent_2_all_children  (acl_id, child_acl_id, allow, ts) values ('acl_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_document_common (id, dtype, document_type_id, organization_id, identifier, creation_date, author_id, status_id, permission, acl_id, creation_time, last_modified_time, ts) values ('id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 'contract', 'id_documentSubType_contractDocument', 'id_orgstructure_tcr_transcapitalrazvitie', 'template', '2019-03-26', 'id_orgstructure_tcr_kirillova2', 'id_DocumentStatus_Template', 0, 'acl_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_document_contract (id, urgent, paper, prepared_by_contractor, protocol_disagreements, protocol_approve_disagreements, deal_with_interest, big_deal, greatly_deal, official_registration, property_transfer) values ('id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', false, true, false, false, false, false, false, false, false, false);


insert into cmf_acl_composite (acl_id, purpose, child_acl_id, allow, ts) values ('acl_approval_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 'approving_object', 'acl_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 2147483647, 1);
insert into cmf_acl_parent_2_all_children  (acl_id, child_acl_id, allow, ts) values ('acl_approval_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 'id_acl_CommonDocumentTemplate', 2147483647, 1);
insert into cmf_approval_iteration (id, document_id, position, state, acl_id, ts) values ('id_ApprovalIteration_emptyContractDocumentTemplateIteration_transcapitalrazvitie', 'id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 0, 0, 'acl_approval_id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', 1);

insert into cmf_documenttemplate (id, parent_id, company_id, name, deleted, document_id, creation_time, last_modified_time, ts) values ('id_documentTemplate_emptyContractDocument_transcapitalrazvitie', 'id_documentSubType_contractDocument', 'id_orgstructure_tcr_transcapitalrazvitie', 'Пустой шаблон', false, 'id_ContractDocument_emptyContractDocumentTemplate_transcapitalrazvitie', '2019-03-26 13:14:15', '2019-03-26 13:14:15',  1);
