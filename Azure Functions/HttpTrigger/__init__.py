import logging
import json
import azure.functions as func
import pyodbc
import datetime
import pytz
##import azure.identity 
##import azure.keyvault.secrets 

CUSTOMER_TABLE = "Customer"
EMPLOYEE_TABLE = "Employee"
SYSTEM_TABLE = "System"
CUSTOMERTEST_TABLE = "Customertest"
SYSTEMTEST_TABLE = "SystemTabletest"

# Check if the employee's username and password matches the information in the employee table
def handle_login(req_body):

    Username = req_body.get('Username')
    Pass = req_body.get('Pass')
    
    conn, cursor = database_connection()

    record = "Username"
    rowcount = exist_record(EMPLOYEE_TABLE, record, Username, cursor)

    if rowcount == 1:
        cursor.execute("SELECT * FROM " + EMPLOYEE_TABLE + " WHERE " + record + " = ?", Username)
        row = cursor.fetchone()
        if Pass == str(row.Pass):
            return {"indicator":True,"message":"Success"}
        else:
            return {"indicator":False,"message":"Password is not correct"}
    else:
        return {"indicator":False,"message":"Username is not correct"}
    


# Add the new user's information to the customer table
def handle_register(req_body):

    current_time = datetime.datetime.now(tz=pytz.timezone("US/Pacific"))
    date = str(current_time.date())

    CustID = req_body.get('CustID')
    
    conn, cursor = database_connection()
    
    record = "CustID"
    rowcount = exist_record(CUSTOMERTEST_TABLE, record, CustID, cursor)
    
    if rowcount == 1:
        return {"indicator":False,"message":"The user is already registered."}
    else:
        Keys = "AccountOpenedDate, LastActive"
        Values = [date, date]
        for index, (key, value) in enumerate(req_body.items()):
            if index > 0:
                Keys = Keys + ", " + key
                Values.append(value)

        cursor.execute("INSERT INTO " + CUSTOMERTEST_TABLE + "(" + Keys + ") values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", Values)
        conn.commit()
        
        return {"indicator":True,"message":"Success"}



# Retrieve the subscription key
def handle_retrieve(req_body):
    
    subscriptionKey = "ebbd248fda6544d09d6b1aeb9f7d1029"

##    credential = azure.identity.DefaultAzureCredential()
##
##    secret_client = azure.keyvault.secrets.SecretClient(vault_url="https://becukey.vault.azure.net", credential=credential)
##    secret = secret_client.get_secret("SpeakerKey")

##    print(secret.name)
##    print(secret.value)
    
    return {"indicator":True,"message":subscriptionKey}
                
    

# Save the user's voice profile id and (3 enrollment wav files) to the customer table
def handle_enrollment(req_body):
    
    CustID = req_body.get('CustID')
    
    conn, cursor = database_connection()

    record = "CustID"
    rowcount = exist_record(CUSTOMERTEST_TABLE, record, CustID, cursor)
    
    if rowcount == 1:
        VoiceProfileID = req_body.get('VoiceProfileID')
        cursor.execute("UPDATE " + CUSTOMERTEST_TABLE + " SET VoiceProfileID = ? WHERE " + record + " = ?", VoiceProfileID, CustID)
        conn.commit()
        return {"indicator":True,"message": VoiceProfileID}
    else:
        return {"indicator":False,"message":"The user does not exist"}

    

# Get the user's full profile from the customer table
def handle_display_profile(req_body):

    Keys = ["AccountNo", "Fname", "Lname", "Gender", "DOB", "SSN", "CustID", "Email", "PhoneNumber", "ResAddress", "VoiceProfileID", "AccountOpenedDate", "LastActive"]

    CustID = req_body.get('CustID')
    
    conn, cursor = database_connection()

    record = "CustID"
    rowcount = exist_record(CUSTOMERTEST_TABLE, record, CustID, cursor)
    
    if rowcount == 1:
        cursor.execute("SELECT * FROM " + CUSTOMERTEST_TABLE + " WHERE " + record + " = ?", CustID)
        row = cursor.fetchone()
        message = {}
        AccountNo_value = str(row.AccountNo)
        Fname_value = str(row.Fname)
        Lname_value = str(row.Lname)
        Gender_value = str(row.Gender)
        DOB_value = str(row.DOB)
        SSN_value = str(row.SSN)
        CustID_value = str(row.CustID)
        Email_value = str(row.Email)
        PhoneNumber_value = str(row.PhoneNumber)
        ResAddress_value = str(row.ResAddress)
        VoiceProfileID = str(row.VoiceProfileID)
        AccountOpenedDate = str(row.AccountOpenedDate)
        LastActive = str(row.LastActive)
        Values = [AccountNo_value, Fname_value, Lname_value, Gender_value, DOB_value, SSN_value, CustID_value, Email_value, PhoneNumber_value, ResAddress_value, VoiceProfileID, AccountOpenedDate, LastActive]
        
        for index in range(0, len(Keys)):
            message[Keys[index]] = Values[index]
            
        return {"indicator":True,"message":message}
    else:
        return {"indicator":False,"message":"The user does not exist"}



# Save the time, date, user's name,account number, verificaiton result, and confidence level to the system table
def handle_verification(req_body):
    
    current_time = datetime.datetime.now(tz=pytz.timezone("US/Pacific"))
    time = str(current_time.time())
    date = str(current_time.date())

    conn, cursor = database_connection()
    
    CustID = req_body.get('CustID')
    cursor.execute("UPDATE " + CUSTOMERTEST_TABLE + " SET LastActive = ? WHERE CustID = ?", date, CustID)
    
    Keys = "TimeCol, DateCol"
    Values = [time, date]
    for index, (key, value) in enumerate(req_body.items()):
        if index > 0 and index < (len(req_body.items()) - 1):
            Keys = Keys + ", " + key
            Values.append(value)
    
    cursor.execute("INSERT INTO " + SYSTEMTEST_TABLE + " (" + Keys + ") values (?, ?, ?, ?, ?, ?, ?)", Values)
    conn.commit()
    return {"indicator":True,"message":"Success"}



# Get the activity logs and statistics of the system from the system table 
def handle_system_performance():

    Keys = ["Time", "Date", "Fname", "Lname", "AccountNo", "Result", "Accuracy"]
    
    conn, cursor = database_connection()

    cursor.execute("SELECT * FROM " + SYSTEMTEST_TABLE + " ORDER BY DateCol DESC, TimeCol DESC")
    rows = cursor.fetchall()
    message_list = []
    Further_Verification = 0
    Fail = 0
    Pass = 0
    
    for row in rows:
        message = {}
        Time_value = str(row.TimeCol)
        Date_value = str(row.DateCol)
        Fname_value = str(row.Fname)
        Lname_value = str(row.Lname)
        AccountNo_value = str(row.AccountNo)
        Result_value = str(row.Result)
        Accuracy_value = str(row.Accuracy)
        Values = [Time_value, Date_value, Fname_value, Lname_value, AccountNo_value, Result_value, Accuracy_value]

        for index in range(0, len(Keys)):
            message[Keys[index]] = Values[index]
            
        message_list.append(message)

        if Result_value == 'Further Verification':
            Further_Verification += 1
        elif Result_value == 'Fail':
            Fail += 1
        elif Result_value == 'Pass':
            Pass += 1
        else:
            Fail += 1
            
    result_dict = {"Further_Verification":Further_Verification,"Fail":Fail,"Pass":Pass}

    return {"indicator":True,"message":message_list,"result":result_dict}



# Return the connection string to the database
def database_connection():
    server = 'becuserver.database.windows.net'
    database = 'becuCustomerAndAudio'
    username = 'becuadmin'
    password = 'Devyansh99'   
    driver= '{ODBC Driver 17 for SQL Server}'

    with pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password) as conn:
        with conn.cursor() as cursor:
            return conn, cursor



# Return the number of rows containing the record to indicate if the record exists in the database
def exist_record(table, record, value, cursor):
    cursor.execute("SELECT COUNT (*) FROM " + table + " WHERE " + record + " = ?", value)
    rowcount = cursor.fetchone()[0]
    return rowcount



def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    http_return = {}
    
    req_body = req.get_json()   # req.get_json(): Convert the JSON object into Python data

    service = req_body.get('service')   # .get("x"): returns the value of the item with the specified key
    
    if service == 'login':
        http_return = handle_login(req_body)
    elif service == 'register':
        http_return = handle_register(req_body)
    elif service == 'retrieve':
        http_return = handle_retrieve(req_body)
    elif service == 'enrollment':
        http_return = handle_enrollment(req_body)
    elif service == 'display_profile':
        http_return = handle_display_profile(req_body)
    elif service == 'verification':
        http_return = handle_verification(req_body)
    elif service == 'system_performance':
        http_return = handle_system_performance()
    else:
        http_return = {"indicator":False,"message":"Not supported service"}
   
    json_http_return = json.dumps(http_return)
    return json_http_return
