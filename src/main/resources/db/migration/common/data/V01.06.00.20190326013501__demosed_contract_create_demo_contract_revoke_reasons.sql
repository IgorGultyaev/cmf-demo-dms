-- Скрипт начального наполнения справочника причин расторжения/аннулирования договоров.

insert into cmf_contract_revoke_reason (id, name, deleted, creation_time, last_modified_time, ts) values ('id_ContractRevokeReason_ByPartiesAgreement', 'По соглашению сторон', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_contract_revoke_reason (id, name, deleted, creation_time, last_modified_time, ts) values ('id_ContractRevokeReason_ByJudgment', 'По решению суда', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
insert into cmf_contract_revoke_reason (id, name, deleted, creation_time, last_modified_time, ts) values ('id_ContractRevokeReason_OneSideRefusal', 'Односторонний отказ от исполнения', false, '2019-03-26 13:14:15', '2019-03-26 13:14:15', 1);
