-- Скрипт по назначению ролей для документа Договор.
-- Здесь же производится и создание всех необходимых для этого объектов.

insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument', 'role#documentProjectCreator#id_org_structure_ooorik#id_documentType_contractDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument', 'role#documentProjectCreator#id_org_structure_ooorik#id_documentSubType_contractDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument', 'role#documentProjectCreator#id_orgstructure_tcr_transcapitalrazvitie#id_documentType_contractDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument', 'role#documentProjectCreator#id_orgstructure_tcr_transcapitalrazvitie#id_documentSubType_contractDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_subtypeContractDocument_typeContractDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument_typeContractDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_typeContractDocument_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_typeContractDocument_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_subtypeContractDocument_petrov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument', 'id_org_structure_petrov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_typeContractDocument_kirillovaLL', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_typeContractDocument_kirillovaLL', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeContractDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeContractDocument');

-- Регистраторы документа Договор
--- ООО РиК
---- Тип Договор
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_ooorik_tContract', 'role#documentRegistrator#id_org_structure_ooorik#id_documentType_contractDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_typeContractDocument_ivanov', 'id_AG_docReg_ooorik_tContract', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_ooorik_tContract');

---- Подтип Договор
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_ooorik_stContract', 'role#documentRegistrator#id_org_structure_ooorik#id_documentSubType_contractDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_subtypeContractDocument_typeContractDocument', 'id_AG_docReg_ooorik_stContract', 'id_AG_docReg_ooorik_tContract', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_subtypeContractDocument_petrov', 'id_AG_docReg_ooorik_stContract', 'id_org_structure_petrov', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AG_docReg_ooorik_tContract', 'id_AG_docReg_ooorik_stContract');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_ooorik_stContract');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_AG_docReg_ooorik_stContract');

--- ТрансКапиталРазвитие
---- Тип Договор
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_tcr_tContract', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentType_contractDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_typeContractDocument_ivanov', 'id_AG_docReg_tcr_tContract', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_typeContractDocument_kirillova2', 'id_AG_docReg_tcr_tContract', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_tcr_tContract');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AG_docReg_tcr_tContract');

---- Подтип Договор
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_tcr_stContract', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentSubType_contractDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_subtypeContractDocument_typeContractDocument', 'id_AG_docReg_tcr_stContract', 'id_AG_docReg_tcr_tContract', 'AccessorsGroup', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AG_docReg_tcr_tContract', 'id_AG_docReg_tcr_stContract');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_tcr_stContract');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AG_docReg_tcr_stContract');
