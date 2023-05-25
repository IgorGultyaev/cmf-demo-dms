-- Скрипт по назначению в роли.
-- Здесь же производится и создание всех необходимых для этого объектов.

insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_businessAdministrator', 'role#businessAdministrator', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_businessAdministrator_ivanov', 'id_AccessorsGroup_businessAdministrator', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_businessAdministrator_petrov', 'id_AccessorsGroup_businessAdministrator', 'id_org_structure_petrov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_businessAdministrator_kirillovaLL', 'id_AccessorsGroup_businessAdministrator', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);

insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_businessAdministrator', 'id_AccessorsGroup_businessAdministrator');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_businessAdministrator');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_AccessorsGroup_businessAdministrator');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_businessAdministrator');

insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument', 'role#documentProjectCreator#id_org_structure_ooorik#id_documentType_outgoingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument', 'role#documentProjectCreator#id_org_structure_ooorik#id_documentSubType_outgoingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument', 'role#documentProjectCreator#id_orgstructure_tcr_transcapitalrazvitie#id_documentType_outgoingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument', 'role#documentProjectCreator#id_orgstructure_tcr_transcapitalrazvitie#id_documentSubType_outgoingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_subtypeOutgoingDocument_typeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument_typeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_typeOutgoingDocument_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_subtypeOutgoingDocument_petrov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument', 'id_org_structure_petrov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_ooorik_typeOutgoingDocument_kirillovaLL', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument_kirillovaLL', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_ooorik_typeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_typeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_ooorik_subtypeOutgoingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentProjectCreator_transcapitalrazvitie_subtypeOutgoingDocument');

insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument', 'role#documentRegistrator#id_org_structure_ooorik#id_documentType_incomingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentRegistrator_ooorik_subtypeIncomingDocument', 'role#documentRegistrator#id_org_structure_ooorik#id_documentSubType_incomingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentType_incomingDocument', 1);
insert into cmf_accessors_group (id, name, ts) values ('id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentSubType_incomingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_subtypeIncomingDocument_typeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_ooorik_subtypeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument_typeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_typeIncomingDocument_ivanov', 'id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_transcapitalrazvitie_typeIncomingDocument_ivanov', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_typeIncomingDocument_kirillovaLL', 'id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_transcapitalrazvitie_typeIncomingDocument_kirillovaLL', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_ooorik_subtypeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentRegistrator_ooorik_typeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_typeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentRegistrator_ooorik_subtypeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentRegistrator_ooorik_subtypeIncomingDocument');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AccessorsGroup_documentRegistrator_transcapitalrazvitie_subtypeIncomingDocument');

-- Регистраторы исходящего документа
--- ООО РиК
---- Тип Исходящий
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_ooorik_tOutgoing', 'role#documentRegistrator#id_org_structure_ooorik#id_documentType_outgoingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_typeOutgoingDocument_ivanov', 'id_AG_docReg_ooorik_tOutgoing', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_ooorik_tOutgoing');

---- Подтип Исходящий
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_ooorik_stOutgoing', 'role#documentRegistrator#id_org_structure_ooorik#id_documentSubType_outgoingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_subtypeOutgoingDocument_typeOutgoingDocument', 'id_AG_docReg_ooorik_stOutgoing', 'id_AG_docReg_ooorik_tOutgoing', 'AccessorsGroup', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_ooorik_subtypeOutgoingDocument_petrov', 'id_AG_docReg_ooorik_stOutgoing', 'id_org_structure_petrov', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AG_docReg_ooorik_tOutgoing', 'id_AG_docReg_ooorik_stOutgoing');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_ooorik_stOutgoing');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_AG_docReg_ooorik_stOutgoing');

--- ТрансКапиталРазвитие
---- Тип Исходящий
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_tcr_tOutgoing', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentType_outgoingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_typeOutgoingDocument_ivanov', 'id_AG_docReg_tcr_tOutgoing', 'id_org_structure_ivanov', 'EmployeePosition', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_typeOutgoingDocument_kirillova2', 'id_AG_docReg_tcr_tOutgoing', 'id_orgstructure_tcr_kirillova2', 'EmployeePosition', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_tcr_tOutgoing');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AG_docReg_tcr_tOutgoing');

---- Подтип Исходящий
insert into cmf_accessors_group (id, name, ts) values ('id_AG_docReg_tcr_stOutgoing', 'role#documentRegistrator#id_orgstructure_tcr_transcapitalrazvitie#id_documentSubType_outgoingDocument', 1);
insert into cmf_accessors_group_item (id, group_id, accessor_id, accessor_type, ts) values ('id_AccessorsGroupItem_documentRegistrator_tcr_subtypeOutgoingDocument_typeOutgoingDocument', 'id_AG_docReg_tcr_stOutgoing', 'id_AG_docReg_tcr_tOutgoing', 'AccessorsGroup', 1);
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_AG_docReg_tcr_tOutgoing', 'id_AG_docReg_tcr_stOutgoing');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_AG_docReg_tcr_stOutgoing');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_AG_docReg_tcr_stOutgoing');


-- Денормализованная иерархия для сотрудников в должности
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_ivanov', 'id_org_structure_ivanov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_org_structure_petrov', 'id_org_structure_petrov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_karpov', 'id_orgstructure_tcr_karpov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova', 'id_orgstructure_tcr_kirillova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_maslova', 'id_orgstructure_tcr_maslova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_muhina', 'id_orgstructure_tcr_muhina');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_zaicev', 'id_orgstructure_tcr_zaicev');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_fedoseeva', 'id_orgstructure_tcr_fedoseeva');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_zaharova', 'id_orgstructure_tcr_zaharova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_ustinov', 'id_orgstructure_tcr_ustinov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_turov', 'id_orgstructure_tcr_turov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_komarov', 'id_orgstructure_tcr_komarov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_ponomarev', 'id_orgstructure_tcr_ponomarev');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_turova', 'id_orgstructure_tcr_turova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_ustinov2', 'id_orgstructure_tcr_ustinov2');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_lebedev', 'id_orgstructure_tcr_lebedev');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_romanova', 'id_orgstructure_tcr_romanova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_haritonova', 'id_orgstructure_tcr_haritonova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_vorobyeva', 'id_orgstructure_tcr_vorobyeva');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_terentieva', 'id_orgstructure_tcr_terentieva');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_orehov', 'id_orgstructure_tcr_orehov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_rukin', 'id_orgstructure_tcr_rukin');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_chernov', 'id_orgstructure_tcr_chernov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_belov', 'id_orgstructure_tcr_belov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_popov', 'id_orgstructure_tcr_popov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_vasilyeva', 'id_orgstructure_tcr_vasilyeva');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_zykova', 'id_orgstructure_tcr_zykova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirillova2', 'id_orgstructure_tcr_kirillova2');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_stepanova', 'id_orgstructure_tcr_stepanova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_izumova', 'id_orgstructure_tcr_izumova');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_brynskih', 'id_orgstructure_tcr_brynskih');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_fetisov', 'id_orgstructure_tcr_fetisov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kostin', 'id_orgstructure_tcr_kostin');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_rozhkov', 'id_orgstructure_tcr_rozhkov');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_subbotin', 'id_orgstructure_tcr_subbotin');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_sablina', 'id_orgstructure_tcr_sablina');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_zamyatnina', 'id_orgstructure_tcr_zamyatnina');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_sokovnina', 'id_orgstructure_tcr_sokovnina');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_andrienko', 'id_orgstructure_tcr_andrienko');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_kirilyk', 'id_orgstructure_tcr_kirilyk');
insert into cmf_accessor_container_info (child_id, parent_id) values ('id_orgstructure_tcr_shipnevskaya', 'id_orgstructure_tcr_shipnevskaya');
