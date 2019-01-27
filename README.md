# pupper-app-mobile

Mobile/Front-end for Pupper application created using Ionic framework.

#### Running Pupper Locally

Access the application on an iOS device via Ionic DevApp (running locally on a live-reload server running in a web browser):

    ionic serve -c

To start up the application running locally on a live-reload server running in a web browser displaying both iOS and Android views (without Cordova plugin capabilities):

    ionic serve --lab

To start up the application running locally using a Cordova browser platform running in a web browser:

    ionic cordova run browser

To build/run using an iOS simulator:

    ionic cordova run ios -- --buildFlag="-UseModernBuildSystem=0"

 To build/run using an Android simulator (specifying the target device):

    ionic cordova run android --target="EMULATOR_DEVICE_NAME"

 To build/run as a native app on an Android phone, run the following after connecting your Android device:

    ionic cordova run android


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
    ionic cordova plugin add cordova-plugin-dialogs
    ionic cordova plugin add cordova-plugin-ionic-webview
