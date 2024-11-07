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
drop table if exists pill_container;
create table pill_container (
    pkid int primary key auto_increment,         -- 약통에 대한 고유 ID
    fk_user int not null,                        -- 사용자 ID (member 테이블과 연결)
    pillA varchar(20) not null,                          -- 약통 A의 약물 정보
    pillB varchar(20) not null,                          -- 약통 B의 약물 정보
    pillC varchar(20) not null,                          -- 약통 C의 약물 정보
    pillD varchar(20) not null,                          -- 약통 D의 약물 정보
    foreign key (fk_user) references member(pkid)   -- 사용자와 연결
);

insert into member(user_id, user_pw, name) values ('iop0512', '1234', '임예은');
insert into alarm(fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day) values(1, 1, "알람1", 0, 0, 0, 1, "12:00:00", "월요일");
select user_id, user_pw, name from member where user_id = 'iop0512' and user_pw = '1234';
select * from alarm;
select * from member;
select MAX(pill_id) as pill_id from alarm where fk_user = 1;
select fk_user, pill_id, name, pillA, pillB, pillC, pillD, time, day from alarm where fk_user = 1;



-- 예시 데이터 삽입
insert into pill_container(fk_user, pillA, pillB, pillC, pillD) values  (1, '비타민C', '진통제', '항생제', '감기약');    
-- 삽입된 데이터 확인
select * from pill_container;