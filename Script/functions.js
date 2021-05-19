// /* user_id for voice profile enrollment and verification,
// and customer information lookup */
// var user_id = 0;

function login(){
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

function actions_after_login(){
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

function register(){
	var firstname = document.getElementById("FirstName").value;
	var lastname = document.getElementById("LastName").value;
	var gender = document.getElementById("Gender").value;
	var date_of_birth = document.getElementById("DOB").value;
	var acount_number = document.getElementById("AccountNo").value;
	var ssn = document.getElementById("SSN").value;
	var id = document.getElementById("ID").value;
	var phone = document.getElementById("Phone").value;
	var address = document.getElementById("Address").value;
	var email = document.getElementById("Email").value;

	var user_input = [firstname, lastname, gender, date_of_birth, acount_number, ssn, id, phone, address, email];
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
			"AccountNo": acount_number,
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

function actions_after_register(){
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
