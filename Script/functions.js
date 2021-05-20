function login() {
	// var request_data = {
	// 	"service": "seasonal",
	// 	"operation": "get_program_information",
	// 	"carpark_id": getCookie("carpark_id")
	// }
	var username = document.getElementById("Username").value;
	var password = document.getElementById("Password").value;

	var request_data = {
		"service": "login",
		"Fname": username,
		"Lname": password
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
	var id = document.getElementById("ID").value;
	var phone = document.getElementById("Phone").value;
	var address = document.getElementById("Address").value;
	var email = document.getElementById("Email").value;

	var user_input = [firstname, lastname, gender, date_of_birth, account_number, ssn, id, phone, address, email];
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
			"CustID": id,
			"Phone": phone,
			"Address": address,
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
		var id = document.getElementById("ID").value;
		setCookie("CustID", id, 30);
		var returned_id = getCookie("CustID");
		console.log(returned_id);
	} else {
		setCookie("CustID", 0, 30);
		var returned_id = getCookie("CustID");
		console.log(returned_id);
	}

	alert(decode_dict["message"]);
}

function display_profile() {
	var id = document.getElementById("IDLookUp").value;

	if (id == "") {
		document.getElementById("AccountNo_Display").innerHTML = "Account Number:";
		document.getElementById("Name_Display").innerHTML = "Name:";
		document.getElementById("Gender_Display").innerHTML = "Gender:";
		document.getElementById("DOB_Display").innerHTML = "Date of Birth";
		document.getElementById("SSN_Display").innerHTML = "SSN:";
		document.getElementById("ID_Display").innerHTML = "User ID:";
		document.getElementById("Email_Display").innerHTML = "Email:";
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number:";
		alert("Please type in the user ID");
	} else {
		var request_data = {
			"service": "display_profile",
			"CustID": id
		};

		var request_str = dict2jsonEncode(request_data);

		httpPost(SERVER_URL, request_str, actions_after_display_profile);
	}
}

function actions_after_display_profile() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);

	if (decode_dict["indicator"] == true) {
		var id = document.getElementById("IDLookUp").value;
		setCookie("CustID", id, 30);
		var returned_id = getCookie("CustID");
		console.log(returned_id);

		document.getElementById("AccountNo_Display").innerHTML = "Account Number: " + decode_dict["message"]["AccountNo"];
		document.getElementById("Name_Display").innerHTML = "Name: " + decode_dict["message"]["Fname"] + " " + decode_dict["message"]["Lname"];
		document.getElementById("Gender_Display").innerHTML = "Gender: " + decode_dict["message"]["Gender"];
		document.getElementById("DOB_Display").innerHTML = "Date of Birth: " + decode_dict["message"]["DOB"];
		document.getElementById("SSN_Display").innerHTML = "SSN: " + decode_dict["message"]["SSN"];
		document.getElementById("ID_Display").innerHTML = "User ID: " + decode_dict["message"]["CustID"];
		document.getElementById("Email_Display").innerHTML = "Email: " + decode_dict["message"]["Email"];
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number: " + decode_dict["message"]["PhoneNumber"];

	} else {
		setCookie("CustID", 0, 30);
		var returned_id = getCookie("CustID");
		console.log(returned_id);
		document.getElementById("AccountNo_Display").innerHTML = "Account Number:";
		document.getElementById("Name_Display").innerHTML = "Name:";
		document.getElementById("Gender_Display").innerHTML = "Gender:";
		document.getElementById("DOB_Display").innerHTML = "Date of Birth:";
		document.getElementById("SSN_Display").innerHTML = "SSN:";
		document.getElementById("ID_Display").innerHTML = "User ID:";
		document.getElementById("Email_Display").innerHTML = "Email:";
		document.getElementById("PhoneNumber_Display").innerHTML = "Phone Number:";
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
			setCookie("Security_Questions", 0, 30);
			alert("Success: Proceed to voice verification");
		} else {
			var attempt = parseInt(getCookie("Security_Questions"));
			console.log(attempt);
			if (attempt == "" || attempt == 0) {
				setCookie("Security_Questions", 1, 30);
			} else {
				setCookie("Security_Questions", attempt++, 30);
				console.log(getCookie("Security_Questions"));
			}
			alert("Fail: Try again");
		}
	}
}
