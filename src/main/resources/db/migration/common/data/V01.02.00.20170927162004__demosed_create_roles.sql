-- Скрипт по созданию ролей Демо СЭД, относящихся к конкретным видам документов.
insert into cmf_role_descriptor (id, role_name, description, ts) values ('id_RoleDescriptorDefault_supplyForwarder', 'supplyForwarder', 'Экспедитор', 1);
insert into cmf_role_descriptor_param (id, parent_id, param_name, param_type_name, nullable, description, order_value, ts) values ('id_RoleParamDescriptorDefault_supplyForwarder_company', 'id_RoleDescriptorDefault_supplyForwarder', 'Company', 'String', false, 'Организация', 0, 1);
