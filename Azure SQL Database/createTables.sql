--CREATE DATABASE becuCustomerAndAudio;
USE becuCustomerAndAudio;

CREATE TABLE Customer(
    CustID INT IDENTITY(1,1) Primary Key, 
	VoiceProfileID varchar(100) not null,
	Email varchar(100) not null,
    Fname varchar(50) not null, 
    Lname varchar(50) not null,
	AccountNo INT not null,
	Gender varchar(500) not null,
	Age INT not null,
	SSN INT not null,
	DOB date not null,
	DriverLicense INT not null,
	PhoneNumber INT not null,
	FirstLanguage varchar(200) not null,
	NativeEnglishSpeaker varchar(100) not null,
	Nationality varchar(500) not null,
	Ethnicity varchar(500) not null,
	VoiceEquipment varchar(500) not null,
	Environment varchar(500) not null,
	Feedback varchar(500) not null,
	AccountOpenedDate date not null, 
	LastActive date not null, 
	ResAddress varchar(500) not null
);
Go