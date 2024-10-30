use mysql;

create database arduino;

create user arduino@localhost identified by 'arduino';

create user arduino@'%' identified by 'arduino';

grant all privileges on arduino.* to arduino@localhost;

grant all privileges on arduino.* to arduino@'%';

flush privileges;

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
    fg_user int not null,
    foreign key (fg_user) references member(pkid),
    dt_id int not null,
    name varchar(50) not null,
    pillA int not null,
    pillB int not null,
    pillC int not null,
    pillD int not null,
    time TIME not null default "00:00:00",
    day varchar(20)
);

insert into member(user_id, user_pw, name) values ('iop0512', '1234', '임예은');
insert into alarm(fg_user, dt_id, name, pillA, pillB, pillC, pillD, time, day) values(1, 1, "알람1", 0, 0, 0, 1, "12:00:00", "월요일");
select user_id, user_pw, name from member where user_id = 'iop0512' and user_pw = '1234';
select * from alarm;
select * from member;