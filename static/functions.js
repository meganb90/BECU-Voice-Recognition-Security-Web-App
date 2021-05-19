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


	}

	else {


	}

}
