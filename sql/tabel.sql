-- arduino DB와 유저 생성(root)에서 실행
-- create database arduino;
-- create user 'arduino'@'localhost' identified by 'arduino';
-- create user 'arduino'@'%' identified by 'arduino';
-- grant all privileges on arduino to 'arduino'@'localhost';
-- grant all privileges on arduino to 'arduino'@'%';
-- FLUSH PRIVILEGES;

-- sessions 테이블이 없어서 오류가 날 때 실행
-- CREATE TABLE IF NOT EXISTS `sessions` (
--   `session_id` varchar(128) COLLATE utf8mb4_bin NOT NULL,
--   `expires` int(11) unsigned NOT NULL,
--   `data` mediumtext COLLATE utf8mb4_bin,
--   PRIMARY KEY (`session_id`)
-- ) ENGINE=InnoDB;


-- 기존 테이블 삭제
drop table if exists member;
drop table if exists alarm;
drop table if exists pill_container;


drop table if exists member;
create table member (
	pkid int primary key auto_increment,
    user_id varchar(20) not null,
    user_pw varchar(20) not null,
    name varchar(50) not null,
    regdate timestamp default current_timestamp
);

drop table if exists alarm;
create table alarm (
	pkid int primary key auto_increment,
    fk_user int not null,
    foreign key (fk_user) references member(pkid),
    pill_id int not null,
    name varchar(50) not null,
    pillA int not null,
    pillB int not null,
    pillC int not null,
    pillD int not null,
    time TIME not null default "00:00:00",
    day varchar(50)
);

-- 약통 이름을 설정하는 테이블 생성
-- 약통 정보 테이블 (약통 이름 및 사출구 이름 설정)
create table pill_container (
    pkid int primary key auto_increment,     -- 약통에 대한 고유 ID
    fk_user int not null,                    -- 사용자 ID (member 테이블과 연결)
    pillA_name varchar(50) not null,         -- 사출구 A 이름 (예: 'A 사출구')
    pillB_name varchar(50) not null,         -- 사출구 B 이름 (예: 'B 사출구')
    pillC_name varchar(50) not null,         -- 사출구 C 이름 (예: 'C 사출구')
    pillD_name varchar(50) not null,         -- 사출구 D 이름 (예: 'D 사출구')
    foreign key (fk_user) references member(pkid)   -- 사용자와 연결
);

insert into member(user_id, user_pw, name) values ('iop0512', '1234', '임예은');
insert into alarm(fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day) values(1, 1, "알람1", 0, 0, 0, 1, "12:00:00", "월요일");
select user_id, user_pw, name from member where user_id = 'iop0512' and user_pw = '1234';
select * from alarm;
select * from member;
select MAX(pill_id) as pill_id from alarm where fk_user = 1;
select fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day from alarm where fk_user = 1;



-- pill_container 테이블에 약통 및 사출구 이름 삽입
insert into pill_container(fk_user, pillA_name, pillB_name, pillC_name, pillD_name) 
values (1, 'A 사출구', 'B 사출구', 'C 사출구', 'D 사출구');

-- 삽입된 데이터 확인
select * from pill_container;