# pupper-app-mobile

Mobile/Front-end for Pupper application created using Ionic framework.

#### Running Pupper Locally

To start up the application running locally on a live-reload server running in a web browser displaying both iOS and Android views (without Cordova plugin capabilities):

    ionic serve --lab

To start up the application running locally using a Cordova browser platform running in a web browser:

    ionic cordova run browser

To build/run using an iOS simulator:

    ionic cordova build ios
    ionic cordova emulate ios -- --buildFlag="-UseModernBuildSystem=0"
    ionic cordova run ios

 To build/run using an Android simulator:

    ionic cordova build Android
    ionic cordova emulate Android
    ionic cordova run Android

 To build/run as a native app on an Android phone, run the following after connecting your Android device:

    ionic cordova run Android


#### Required Cordova Plugins

Prior to starting the application locally, install the following Cordova plugins:

    ionic cordova plugin add cordova-plugin-statusbar
    ionic cordova plugin add cordova-plugin-splashscreen
    ionic cordova plugin add cordova-plugin-camera
    ionic cordova plugin add cordova-plugin-device
    ionic cordova plugin add cordova-plugin-ios-camera-permissions
    ionic cordova plugin add cordova-plugin-file
    ionic cordova plugin add cordova-plugin-file-transfer
    ionic cordova plugin add cordova-sqlite-storage
