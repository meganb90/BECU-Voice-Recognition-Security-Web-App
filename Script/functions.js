function login() {
	var username = document.getElementById("Uname").value;
	var password = document.getElementById("Pass").value;

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
		document.getElementById("VoiceProfileID").innerHTML = "Customer Voice ID: " + decode_dict["message"]["VoiceProfile"];
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

	if (correct_answers >= 3) {
		document.getElementById("recordingButton").disabled = false;
		document.getElementById("recordingButton").style.opacity = 1;
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
		if (attempt == 3) {
			document.getElementById("Security").disabled = true;
			document.getElementById("Security").style.opacity = 0.3;
			alert("Fail: No more attempts");
		} else {
			console.log(getCookie("Security_Questions"));
			alert("Fail: Try again");
		}
	}
}

function verification(result, confidence_level) {
	console.log(result);
	console.log(confidence_level);

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

	httpPost(SERVER_URL, request_str, actions_after_verification);
}

function actions_after_verification() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);
	alert(decode_dict["message"]);
}

function authentication() {
	alert("The customer is autenticated!");
}

function GenerateTable() {
    //Build an array containing Customer records.

		var request_data = {
			"service": "system_performance"
		};

		var request_str = dict2jsonEncode(request_data);

		httpPost(SERVER_URL, request_str, actions_after_system_performanc);
}

function actions_after_system_performanc() {
	var decode_dict = JSON.parse(this.responseText);
	console.log(decode_dict);

	var message = decode_dict["message"];
	console.log(decode_dict["message"]);

	var system = [["Time", "Date", "First Name", "Last Name", "Result", "Accuracy"]];

	console.log(message[0]["Time"]);
	console.log(message.length);

	for (i = 0; i < message.length; i++) {
		var system_row = [];
		system_row[0] = message[i]["Time"];
		system_row[1] = message[i]["Date"];
		system_row[2] = message[i]["Fname"];
		system_row[3] = message[i]["Lname"];
		system_row[4] = message[i]["Result"];
		system_row[5] = message[i]["Accuracy"];
		system.push(system_row);
	}

	console.log(system);

	//Create a HTML Table element.
	var table = document.createElement("TABLE");
	table.border = "1";

	//Get the count of columns.
	var columnCount = system[0].length;

	//Add the header row.
	var row = table.insertRow(-1);
	for (var i = 0; i < columnCount; i++) {
			var headerCell = document.createElement("TH");
			headerCell.innerHTML = system[0][i];
			row.appendChild(headerCell);
	}

	//Add the data rows.
	for (var i = 1; i < system.length; i++) {
			row = table.insertRow(-1);
			for (var j = 0; j < columnCount; j++) {
					var cell = row.insertCell(-1);
					cell.innerHTML = system[i][j];
			}
	}

	var dvTable = document.getElementById("dvTable");
	dvTable.innerHTML = "";
	dvTable.appendChild(table);

	var pass_case = decode_dict["result"]["Pass"];
	var sus_case = decode_dict["result"]["Further_Verification"];
	var fail_case = decode_dict["result"]["Fail"];

	document.getElementById("pass").innerHTML = pass_case;
	document.getElementById("suspicious").innerHTML = sus_case;
	document.getElementById("fail").innerHTML = fail_case;

	am4core.ready(function() {

	// Themes begin
	am4core.useTheme(am4themes_animated);
	// Themes end

	// Create chart instance
	var chart = am4core.create("chartdiv", am4charts.PieChart);

	// Add data
	chart.data = [ {
		"Result": "Pass",
		"Case": pass_case
	}, {
		"Result": "Fail",
		"Case": fail_case
	}, {
		"Result": "Suspicious",
		"Case": sus_case
	}];

	// Add and configure Series
	var pieSeries = chart.series.push(new am4charts.PieSeries());
	pieSeries.dataFields.value = "Case";
	pieSeries.dataFields.category = "Result";
	pieSeries.slices.template.stroke = am4core.color("#fff");
	pieSeries.slices.template.strokeWidth = 2;
	pieSeries.slices.template.strokeOpacity = 1;

	// This creates initial animation
	pieSeries.hiddenState.properties.opacity = 1;
	pieSeries.hiddenState.properties.endAngle = -90;
	pieSeries.hiddenState.properties.startAngle = -90;

	}); // end am4core.ready()

}
