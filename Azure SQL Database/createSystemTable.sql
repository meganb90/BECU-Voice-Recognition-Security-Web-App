USE becuCustomerAndAudio;

CREATE TABLE SystemTable(
	Fname varchar(100) not null,
	Lname varchar(100) not null, 
	BECUaccountNo int not null, 
	TimeCol time not null, 
	DateCol date not null, 
	Result varchar(100) not null, 
	Accuracy int not null, 
	Accept varchar(100) not null, 
	Reject varchar(100) not null, 
	FurtherVerification varchar(500) not null
);
Go