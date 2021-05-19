var SERVER_URL = "https://centralserver.azurewebsites.net/api/info"

var SCREEN_WIDTH = window.innerWidth
var SCREEN_HEIGHT = window.innerHeight
if (SCREEN_HEIGHT <= 600) { SCREEN_HEIGHT = 600; }


// Cookie Operations
// ------------------------------------------
function setCookie(cname,cvalue,exdays){
    /*
        This is the function to set the cookie in your browser.

        Input:
        - cname: (string) This is the key of the cookie
        - cvalue: (string) This is the value of the cookie
        - exdays: (Integer) set the expiration day of the cookie  (We recommended 30)
    */

    // This part set the expiration date of the cookie
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expiration_day = "expires="+d.toGMTString();

    // Remember to encode the value component of the cookie key/value pair to ensure there is no error.
    // (and is compatible for all different browsers)
    document.cookie = encodeURIComponent(cname)+"="+encodeURIComponent(cvalue)+"; "+expiration_day;
}

/*
usage: setCookie("user_id",user_id,1)
*/


function getCookie(cname){
    /*
        This is the function to get the cookie in your browser.

        Input:
        - cname: (string) This is the key of the cookie

        Return:
        - cvalue: (string) The cookie value
    */

    // Find the encoded key in the cookie
    var name = encodeURIComponent(cname) + "=";

    // Split the cookie based on ';'
    var ca = decodeURIComponent(document.cookie).split(';');

    // Loop through all cookies, and return the correct value
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }

    // Return an empty string by default
    return "";
}

/*
usage: getCookie("user_id")
*/


// Http Operations
// ------------------------------------------
function httpPost(url, postData, postProcesses){
    /*
        Input:
        - url: (string) the url that you want to send request to
        - postData: (string) This will be sent in the x-www-form-urlencoded format
        - postProcesses: (function) This is the function that should be executed after
            we got the response from the server `
    */
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", postProcesses);
    xmlHttp.open("POST", url);
    // maybe you would like to use json for input!!
    xmlHttp.setRequestHeader("Content-Type", "application/json/;charset=UTF-8");
    xmlHttp.send(postData);
}

/*
function post_register_info(){
    var request_data = {
        "service": "seasonal"
    }

    var request_str = dict2jsonEncode(request_data)
    console.log(request_str)

    httpPost(SERVER_URL, request_str, actions_after_register_post);
}

actions_after_register_post: This function runs after getting response from server.

function actions_after_register_post(){

    var decode_dict = JSON.parse(this.responseText)


    if (decode_dict["indicator"] == true) {

    }

    else {


    }

}

*/



function dict2jsonEncode(dictionary) {
    /*
        This is the helper function that helps change dictionary to
        urlencoded string.
    */
    PostData = JSON.stringify(dictionary)
    return PostData;
}

function replaceAllFunc(string, search, replace) {
    return string.split(search).join(replace);
}


function general_switch_page(page_name){
    window.location.href = page_name
}
