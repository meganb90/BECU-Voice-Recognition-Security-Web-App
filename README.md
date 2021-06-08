# BECU-Voice-Recognition-Security-Web-App

## Preface
In order to reproduce our static web app the following criterias must be met:
1) You must have a Microsoft Azure account
2) The following recource must be purchased
    - Static Web Apps
    - Cognitive Services (subscription key and region noted)
3) Speech SDK for JavaScript must be obtained (follow instructions here: https://www.npmjs.com/package/microsoft-cognitiveservices-speech-sdk)

In order to create a web application using Microsoft Azure's Static Web App services, refer to the following tutorial: https://docs.microsoft.com/en-us/azure/static-web-apps/getting-started?tabs=vanilla-javascript.

In order to implement text-dependent speaker verification using Microsoft Azure's Cognitive Services, refer to the following tutorial and follow the JavaScript instructions: https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/get-started-speaker-recognition?tabs=script&pivots=programming-language-javascript. The following sample scripts is also a valuable resource: https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/fa6428a0837779cbeae172688e0286625e340942/quickstart/javascript/browser. 

## Explaining the files:

| HTML Files | |
| --- |---|
| index.html | This is the user login page. Index.html is typically the syntax for the "homepage". |
| BECU_Add_New_User.html | In this page, BECU employees enroll new users into our system. Demographic information is written and audio streams are recorded for enrollment. |
| BECU_Customer_Database.html | In this page, BECU employees verify existing users. Security questions are answered and audio streams are recorded for verification. |
| BECU_System_Dashboard.html | In this page, BECU employees can see the overall system performance. |

| Scripts | |
| --- |---|
| Audio&VerifySpeaker.js | Used by the 'BECU_Customer_Database.html' to verify users. |
| AudioCapture.js | Used by the 'BECU_Add_New_User.html' to capture audio streams for enrollment. |
| EnrollSpeaker.js | Used by the 'BECU_Add_New_User.html' to enroll new users into the Microsoft Azure Cognitive Service. |
| functions.js | Used by the 'BECU_Add_New_User.html' to enter in new user's relevant bank account information. |
| speech-processor.js | |
| utils.js | |

| Images | |
| --- |---|
| BECU_Logo.PNG | Used in 'index.html', 'BECU_Add_New_User.html', & 'BECU_Customer_Database.html' in the top left corner. |
| BECU_Voice_Login_Feature.PNG | Used in 'index.html' |
