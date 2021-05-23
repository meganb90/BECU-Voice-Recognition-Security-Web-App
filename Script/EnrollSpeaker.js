// status fields and start button in UI
var resultDiv;
var createVoiceProfileButton;
var deleteProfileButton;

// subscription key and region for speech services.
var subscriptionKey = "ebbd248fda6544d09d6b1aeb9f7d1029";
var serviceRegion = "westus";

var SpeechSDK;
var client;
var speechConfig, profile;

var voiceprofileID;

document.addEventListener("DOMContentLoaded", function () {

  createVoiceProfileButton = document.getElementById("createVoiceProfileButton");
  deleteProfileButton = document.getElementById("deleteProfileButton");
  resultDiv = document.getElementById("resultDiv");

  deleteProfileButton.disabled = true;

  createVoiceProfileButton.addEventListener("click", function () {

    createVoiceProfileButton.disabled = true;
    resultDiv.innerHTML = "";

    // if we got an authorization token, use the token. Otherwise use the provided subscription key
    // if (authorizationToken) {
    //   speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, serviceRegion.value);
    // } else {
    //   if (subscriptionKey.value === "" || subscriptionKey.value === "subscription") {
    //     alert("Please enter your Microsoft Cognitive Services Speech subscription key!");
    //     createVoiceProfileButton.disabled = false;
    //     return;
    //   }
    //   speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey.value, serviceRegion.value);
    // }

    speechConfig = SpeechSDK.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);

    speechConfig.setProperty(SpeechSDK.PropertyId.SpeechServiceConnection_TranslationVoice, "en-US");
    client = new SpeechSDK.VoiceProfileClient(speechConfig);

    client.createProfileAsync(
      SpeechSDK.VoiceProfileType.TextDependentVerification,
      "en-us",
      function (result) {
        profile = result;
        window.console.log(result);

        enrollment(result.profileId);

        resultDiv.innerHTML += "Profile created ProfileId: " + result.profileId;
        resultDiv.innerHTML += "\r\n";
        deleteProfileButton.disabled = false;

        /* Create a push stream and write the arraybuffer in the push stream.
        Then, pass the push stream as stream input to create AudioConfig.*/
        let configs = [];
        console.log(audioStream.length);
        for(var i = 0; i < audioStream.length; i++){
          let pushStream = SpeechSDK.AudioInputStream.createPushStream();
          var arrayBuffer = audioStream[i];
          console.log(arrayBuffer);
          pushStream.write(arrayBuffer);
          pushStream.close();
          configs.push(SpeechSDK.AudioConfig.fromStreamInput(pushStream));
        }

        audioStream = [];

        client.enrollProfileAsync(
          profile,
          configs[0],
          function(result) {
            resultDiv.innerHTML += "(Enrollment result) Reason: " + SpeechSDK.ResultReason[result.reason];
            resultDiv.innerHTML += "\n";
            window.console.log(result);
            client.enrollProfileAsync(
              profile,
              configs[1],
              function(result2) {
                resultDiv.innerHTML += "(Enrollment result) Reason: " + SpeechSDK.ResultReason[result2.reason];
                resultDiv.innerHTML += "\n";
                window.console.log(result2);
                client.enrollProfileAsync(
                  profile,
                  configs[2],
                  function(result3) {
                    resultDiv.innerHTML += "(Enrollment result) Reason: " + SpeechSDK.ResultReason[result3.reason];
                    resultDiv.innerHTML += "\n";
                    window.console.log(result3);
                    resultDiv.innerHTML += "The customer's voice profile has been successfully enrolled!";
                    // verifySpeakerButton.disabled = false;
                  },
                  (err) => { resultDiv.innerHTML += "ERROR: " + err; })
              },
              (err) => { resultDiv.innerHTML += "ERROR: " + err; })
          },
          (err) => { resultDiv.innerHTML += "ERROR: " + err; })

        resultDiv.innerHTML += "\r\n";

        createVoiceProfileButton.disabled = false;
      },
      function (err) {
        window.console.log(err);
        resultDiv.innerHTML += "ERROR: " + err;

        createVoiceProfileButton.disabled = false;
      });
  });

  deleteProfileButton.addEventListener("click", function () {
      client.deleteProfileAsync(
        profile,
        function(result) {
          resultDiv.innerHTML += "The customer's voice profile has been successfully deleted!";
          resultDiv.innerHTML += "\r\n";
          deleteProfileButton.disabled = true;
        //   verifySpeakerButton.disabled = true;
        },
        function(err) {
          window.console.log(err);
          resultDiv.innerHTML += "ERROR: " + err;
        }
      );
  });
  if (!!window.SpeechSDK) {
    SpeechSDK = window.SpeechSDK;
    createVoiceProfileButton.disabled = false;

    document.getElementById('content').style.display = 'block';
    document.getElementById('warning').style.display = 'none';

    // in case we have a function for getting an authorization token, call it.
    // if (typeof RequestAuthorizationToken === "function") {
    //     RequestAuthorizationToken();
    // }
  }
});
