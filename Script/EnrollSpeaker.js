// status fields and start button in UI
var resultDiv;
var createVoiceProfileButton;
// var verifySpeakerButton;
var deleteProfileButton;

// subscription key and region for speech services.
var subscriptionKey = "237760c2cc8246ac9cd9d7917a75a129";
var serviceRegion = "westus";
// var authorizationToken;
var SpeechSDK;
var client;
// var filePicker, testFilePicker,audioFiles, testFile;
var speechConfig, profile;

document.addEventListener("DOMContentLoaded", function () {

  createVoiceProfileButton = document.getElementById("createVoiceProfileButton");
//   verifySpeakerButton = document.getElementById("verifySpeakerButton");
  deleteProfileButton = document.getElementById("deleteProfileButton");
//   subscriptionKey = document.getElementById("subscriptionKey");
//   serviceRegion = document.getElementById("serviceRegion");
  resultDiv = document.getElementById("resultDiv");
//   filePicker = document.getElementById("filePicker");
//   testFilePicker = document.getElementById("testFilePicker");

  deleteProfileButton.disabled = true;
//   verifySpeakerButton.disabled = true;
//   filePicker.addEventListener("change", function () {
//       audioFiles = filePicker.files;
//   });

//   testFilePicker.addEventListener("change", function () {
//       testFile = testFilePicker.files[0];
//   });

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

//   verifySpeakerButton.addEventListener("click", function () {
//     let pushStream = SpeechSDK.AudioInputStream.createPushStream();
//     var arrayBuffer = audioStream[0];
//     audioStream = [];
//     console.log(arrayBuffer);
//     pushStream.write(arrayBuffer);
//     pushStream.close();

//     let testAudioConfig = SpeechSDK.AudioConfig.fromStreamInput(pushStream);
//     // let testAudioConfig = SpeechSDK.AudioConfig.fromWavFileInput(testFile);
//     let recognizer = new SpeechSDK.SpeakerRecognizer(speechConfig, testAudioConfig);
//     let model = SpeechSDK.SpeakerVerificationModel.fromProfile(profile);
//     recognizer.recognizeOnceAsync(
//       model,
//       function(result) {
//         window.console.log(result);
//         let reason = result.reason;
//         resultDiv.innerHTML += "(Verification result) Reason: " + SpeechSDK.ResultReason[reason];
//         resultDiv.innerHTML += "\n";
//         if( reason === SpeechSDK.ResultReason.Canceled ) {
//           let cancellationDetails = SpeechSDK.SpeakerRecognitionCancellationDetails.fromResult(result);
//           resultDiv.innerHTML += "(Verification canceled) Error Details: " + cancellationDetails.errorDetails;
//           resultDiv.innerHTML += "\n";
//           resultDiv.innerHTML += "(Verification canceled) Error Code: " + cancellationDetails.errorCode;
//           resultDiv.innerHTML += "\n";
//         } else {
//           resultDiv.innerHTML += "(Verification result) Profile Id: " + result.profileId;
//           resultDiv.innerHTML += "\n";
//           resultDiv.innerHTML += "(Verification result) Score: " + result.score;
//           resultDiv.innerHTML += "\r\n";
//         }
//       },
//       function(err) {
//         window.console.log(err);
//         resultDiv.innerHTML += "ERROR: " + err;
//       });
//   });

  deleteProfileButton.addEventListener("click", function () {
      client.deleteProfileAsync(
        profile,
        function(result) {
          resultDiv.innerHTML += "The customer's voice profile has been successfully enrolled!";
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