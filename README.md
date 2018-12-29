# Pupper Mobile App

#### Running Pupper Locally

To start up the application locally in a web browser displaying both iOS and Android views:

 ```ionic serve --lab```

To build/run using an iOS simulator:

 ```ionic cordova build ios```
 ```ionic cordova emulate ios -- --buildFlag="-UseModernBuildSystem=0"```
 ```ionic cordova run ios```

 To build/run using an Android simulator:

 ```ionic cordova build Android```
 ```ionic cordova emulate Android```
 ```ionic cordova run Android```

 To build/run as a native app on an Android phone, run the following after connecting your Android device:

 ```ionic cordova run Android```


#### Cordova Plugins

Prior to starting the application locally, install the following Cordova plugins:

```ionic cordova plugin add cordova-plugin-statusbar```
```ionic cordova plugin add cordova-plugin-splashscreen```
```ionic cordova plugin add cordova-plugin-camera```
```ionic cordova plugin add cordova-plugin-ios-camera-permissions``
```ionic cordova plugin add cordova-plugin-file```
```ionic cordova plugin add cordova-plugin-file-transfer```
