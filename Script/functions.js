function login() {
	var username = document.getElementById("Username").value;
	var password = document.getElementById("Password").value;

	var request_data = {
		"service": "login",
		"Username": username,
		"Pass": password
	};

	var request_str = dict2jsonEncode(request_data);

	httpPost(SERVER_URL, request_str, actions_after_login);
}

function actions_after_login() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);

	if (decode_dict["indicator"] == true) {
		// Switch to BECU_Add_New_User page
		general_switch_page("BECU_Add_New_User.html");
	}
	else {
		// Show alert messages
		alert(decode_dict["message"]);
	}
}

function register() {
	var firstname = document.getElementById("FirstName").value;
	var lastname = document.getElementById("LastName").value;
	var gender = document.getElementById("Gender").value;
	var date_of_birth = document.getElementById("DOB").value;
	var account_number = document.getElementById("AccountNo").value;
	var ssn = document.getElementById("SSN").value;
	var custid = document.getElementById("CustID").value;
	var phone = document.getElementById("Phone").value;
	var address = document.getElementById("Address").value;
	var email = document.getElementById("Email").value;

	var user_input = [firstname, lastname, gender, date_of_birth, account_number, ssn, custid, phone, address, email];
	var incomplete = false;

	for (i = 0; i < user_input.length; i++) {
  	if (user_input[i] == "") {
			incomplete = true;
		}
	}

	if (incomplete) {
		alert("The customer profile is not completed");
	} else {
		var request_data = {
			"service": "register",
			"Fname": firstname,
			"Lname": lastname,
			"Gender": gender,
			"DOB": date_of_birth,
			"AccountNo": account_number,
			"SSN": ssn,
			"CustID": custid,
			"PhoneNumber": phone,
			"ResAddress": address,
			"Email": email
		};

		var request_str = dict2jsonEncode(request_data);

		httpPost(SERVER_URL, request_str, actions_after_register);
	}
}

function actions_after_register() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);

	if (decode_dict["indicator"] == true) {
		var custid = document.getElementById("CustID").value;
		setCookie("CustID", custid);
		var returned_id = getCookie("CustID");
		console.log(returned_id);
	} else {
		setCookie("CustID", 0);
		var returned_id = getCookie("CustID");
		console.log(returned_id);
	}

	alert(decode_dict["message"]);
}

function enrollment(voiceprofileid) {
	var custid = getCookie("CustID");
	console.log(custid);
	console.log(voiceprofileid);

	var request_data = {
		"service": "enrollment",
		"CustID": custid,
		"VoiceProfileID": voiceprofileid
	};

	var request_str = dict2jsonEncode(request_data);

	httpPost(SERVER_URL, request_str, actions_after_enrollment);
}

function actions_after_enrollment() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);
	alert(decode_dict["message"]);
}

function display_profile() {
	var custid = document.getElementById("IDLookUp").value;

	if (custid == "") {
		document.getElementById("AccountNo_Display").innerHTML = "Account Number:";
		document.getElementById("Name_Display").innerHTML = "Name:";
		document.getElementById("Gender_Display").innerHTML = "Gender:";
		document.getElementById("DOB_Display").innerHTML = "Date of Birth";
		document.getElementById("SSN_Display").innerHTML = "SSN:";
		document.getElementById("ID_Display").innerHTML = "User ID:";
		document.getElementById("Email_Display").innerHTML = "Email:";
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number:";
		document.getElementById("Address_Display").innerHTML = "Address:";
		document.getElementById("VoiceProfileID").innerHTML = "Customer Voice ID:";
		document.getElementById("AccountOpenedDate").innerHTML = "Account Opened:";
		document.getElementById("LastActiveDate").innerHTML = "Last Active:";

		alert("Please type in the user ID");
	} else {
		var request_data = {
			"service": "display_profile",
			"CustID": custid
		};

		var request_str = dict2jsonEncode(request_data);

		httpPost(SERVER_URL, request_str, actions_after_display_profile);
	}
}

function actions_after_display_profile() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);

	if (decode_dict["indicator"] == true) {
		setCookie("VoiceProfileID", decode_dict["message"]["VoiceProfileID"]);
		var voiceprofileid = getCookie("VoiceProfileID");
		console.log(voiceprofileid);

		setCookie("Fname", decode_dict["message"]["Fname"]);
		var fname = getCookie("Fname");
		console.log(fname);

		setCookie("Lname", decode_dict["message"]["Lname"]);
		var lname = getCookie("Lname");
		console.log(lname);

		setCookie("AccountNo", decode_dict["message"]["AccountNo"]);
		var accountno = getCookie("AccountNo");
		console.log(accountno);

		document.getElementById("AccountNo_Display").innerHTML = "Account Number: " + decode_dict["message"]["AccountNo"];
		document.getElementById("Name_Display").innerHTML = "Name: " + decode_dict["message"]["Fname"] + " " + decode_dict["message"]["Lname"];
		document.getElementById("Gender_Display").innerHTML = "Gender: " + decode_dict["message"]["Gender"];
		document.getElementById("DOB_Display").innerHTML = "Date of Birth: " + decode_dict["message"]["DOB"];
		document.getElementById("SSN_Display").innerHTML = "SSN: " + decode_dict["message"]["SSN"];
		document.getElementById("ID_Display").innerHTML = "User ID: " + decode_dict["message"]["CustID"];
		document.getElementById("Email_Display").innerHTML = "Email: " + decode_dict["message"]["Email"];
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number: " + decode_dict["message"]["PhoneNumber"];
		document.getElementById("Address_Display").innerHTML = "Address: " + decode_dict["message"]["ResAddress"];
		document.getElementById("VoiceProfileID").innerHTML = "Customer Voice ID: " + decode_dict["message"]["VoiceProfileID"];
		document.getElementById("AccountOpenedDate").innerHTML = "Account Opened: " + decode_dict["message"]["AccountOpenedDate"];
		document.getElementById("LastActiveDate").innerHTML = "Last Active: " + decode_dict["message"]["LastActive"];
	} else {
		setCookie("VoiceProfileID", 0);
		var voiceprofileid = getCookie("VoiceProfileID");
		console.log(voiceprofileid);

		document.getElementById("AccountNo_Display").innerHTML = "Account Number:";
		document.getElementById("Name_Display").innerHTML = "Name:";
		document.getElementById("Gender_Display").innerHTML = "Gender:";
		document.getElementById("DOB_Display").innerHTML = "Date of Birth:";
		document.getElementById("SSN_Display").innerHTML = "SSN:";
		document.getElementById("ID_Display").innerHTML = "User ID:";
		document.getElementById("Email_Display").innerHTML = "Email:";
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number:";
		document.getElementById("Address_Display").innerHTML = "Address:";
		document.getElementById("VoiceProfileID").innerHTML = "Customer Voice ID:";
		document.getElementById("AccountOpenedDate").innerHTML = "Account Opened:";
		document.getElementById("LastActiveDate").innerHTML = "Last Active:";
		alert(decode_dict["message"]);
	}
}

function security_questions() {
	var account_number_checkbox = document.getElementById("AccountNo_Checkbox").checked;
	var dob_checkbox = document.getElementById("DOB_Checkbox").checked;
	var ssn_checkbox = document.getElementById("SSN_Checkbox").checked;
	var phone_number_checkbox = document.getElementById("PhoneNumber_Checkbox").checked;
	var email_checkbox = document.getElementById("Email_Checkbox").checked;
	var address_checkbox = document.getElementById("Address_Checkbox").checked;

	var questions = [account_number_checkbox, dob_checkbox, ssn_checkbox, phone_number_checkbox, email_checkbox, address_checkbox];
	var correct_answers = 0;
	var fail_attempts = parseInt(getCookie("Security_Questions"));
	console.log(fail_attempts);

	for (i = 0; i < questions.length; i++) {
		if (questions[i] == true) {
			correct_answers++;
		}
	}

	if (fail_attempts == 3) {
		document.getElementById("Security").disabled = true;
		alert("Fail: No more attempts");
	} else {
		if (correct_answers >= 3) {
			setCookie("Security_Questions", 0);
			alert("Success: Proceed to voice verification");
		} else {
			var attempt = getCookie("Security_Questions");
			console.log(attempt);
			if (attempt == "") {
				setCookie("Security_Questions", 1);
			} else {
				attempt = parseInt(attempt) + 1;
				setCookie("Security_Questions", attempt);
			}
			console.log(getCookie("Security_Questions"));
			alert("Fail: Try again");
		}
	}
}

function verification(result, confidence_level) {
	var fname = getCookie("Fname");
	console.log(fname);

	var lname = getCookie("Lname");
	console.log(lname);

	var accountno = getCookie("AccountNo");
	console.log(accountno);

	var request_data = {
		"service": "verification",
		"Fname": fname,
		"Lname": lname,
		"AccountNo": accountno,
		"Result": result,
		"Accuracy": confidence_level
	};

	var request_str = dict2jsonEncode(request_data);

	httpPost(SERVER_URL, request_str, actions_after_login);
}

function actions_after_verification() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);
	alert(decode_dict["message"]);
}
