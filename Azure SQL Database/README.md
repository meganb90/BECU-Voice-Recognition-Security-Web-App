Azure SQL Database is used for this project to store all the inoformation about the Customer, Employee and System.

Customer Table: Stores all the information about the customer including their demographic information
Employee Table: Stores Employee credentials to login to the system
System Table: Stores information about the System use and efficiency

Steps for implementing the Database:
1. Implement the tables in SQL Server Management studio 
2. Create a .BACPAC file by exporting the  Database
3. Create Storgae Account on Microsoft Azure 
4. Create Blob inside storage account and upload the .BACPAC file there
5. Create a Microsft Azure Server
6. Import the database from the storage account into the server
7. Create the Database and conenct to the server
