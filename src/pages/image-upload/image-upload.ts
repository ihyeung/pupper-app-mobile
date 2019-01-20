import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
// import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Utilities  } from '../../providers';
import { environment as ENV } from '../../environments/environment';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadPage {
  lastImage: string = null;
  imageFor: string;
  profileData: any = [];
  imageURI: string;
  uriReady: boolean = false;
  tempReady: boolean = false;
  headers: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private file: File,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public utils: Utilities) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ImageUploadPage');

      this.imageFor = this.navParams.get('profileType');
      console.log('Routed from create profile page for ' + this.imageFor);
      this.profileData = this.navParams.get('formData');
      if (this.profileData) {
        console.log('profile form data passed from create profile page');
      }
    }

    selectExistingImage() {
      const options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      }

      this.camera.getPicture(options).then(imageData => {
        this.imageURI = imageData;
        console.log("IMAGE URI FROM LIBRARY: '" + this.imageURI + "'");
      }, err => console.error('ERROR: ' + err.body));
    }

    takePhoto() {
      const options: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: this.camera.PictureSourceType.CAMERA
      }

      this.camera.getPicture(options).then((imageData) => {
        this.imageURI = imageData;
        console.log("IMAGE URI FROM CAMERA: '" + this.imageURI + "'");
      }, err => console.error('ERROR: ' + err.body));
    }

    passImageUriForUpload() {
      console.log('Passing image uri back to create profile page');
      console.log(this.imageURI);

      const profileData = {
         filePath: this.imageURI,
         formData: this.profileData //Pass data from create profile page back to restore state
       };

       if (this.imageFor == 'user') {
         this.navCtrl.push('CreateUserProfilePage', profileData);
       } else {
         this.navCtrl.push('CreateMatchProfilePage', profileData);
       }
     }
      // let loader = this.loadingCtrl.create({
      //   content: "Uploading..."
      // });
      // loader.present();
      // const fileTransfer: FileTransferObject = this.transfer.create();
      //
      // let options: FileUploadOptions = {
      //   fileKey: 'profilePic',
      //   fileName: 'test.jpg',
      //   chunkedMode: false,
      //   mimeType: "image/jpeg",
      //   headers: this.headers,
      //   httpMethod: 'PUT'
      // }
      //
      // const userId = 6;
      // const url = `${ENV.BASE_URL}/user/${userId}/upload`;
      // const enc = encodeURI(url);
      // console.log("Encoded url: " + enc);
      // fileTransfer.upload(this.imageURI, enc, options)
      // .then(data => {
      //   console.log(data.response);
      //   const response = JSON.parse(data.response);
      //   if (response.isSuccess) {
      //     console.log("Uploaded Successfully");
      //     this.imageFileName = response.imageUrl;
      //     this.lastImage = this.imageFileName;
      //     console.log(response.imageUrl);
      //   } else {
      //     console.log("Upload failed, " + response.statusCode + ", message: " + response.description);
      //   }
      //   loader.dismiss();
      //   // this.utils.presentAutoDismissToast("Image uploaded successfully");
      // }, (err) => {
      //   console.log("ERROR response body: " + err.body);
      //
      //   console.log(err);
      //   loader.dismiss();
      //   this.utils.presentAutoDismissToast(err);
      // });


    public selectImageForUpload() {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Select Image Source',
        buttons: [
          {
            text: 'Select existing from library',
            handler: () => this.selectExistingImage()
          },
          {
            text: 'Take photo',
            handler: () => this.takePhoto()
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
    }

    // private setCameraOptions(sourceType) {
    //   const options: CameraOptions = {
    //     quality: 50,
    //     sourceType: sourceType,
    //     // saveToPhotoAlbum: true,
    //     correctOrientation: true,
    //     destinationType: this.camera.DestinationType.FILE_URI,
    //     encodingType: this.camera.EncodingType.JPEG,
    //     mediaType: this.camera.MediaType.PICTURE,
    //     allowEdit: true
    //   };
    //   return options;
    // }
    //
    // public selectExistingOrTakePhoto(sourceType) {
    //   // const cameraDialogOptions : CameraOptions = {
    //   //   quality: 100,
    //   //   sourceType: sourceType,
    //   //   // saveToPhotoAlbum: true,
    //   //   correctOrientation: true,
    //   //   destinationType: this.camera.DestinationType.FILE_URI,
    //   //   encodingType: this.camera.EncodingType.JPEG,
    //   //   mediaType: this.camera.MediaType.PICTURE
    //   //   // destinationType: this.camera.DestinationType.FILE_URI
    //   //
    //   // };
    //   const cameraDialogOptions = this.setCameraOptions(sourceType);
    //
    //   this.camera.getPicture(cameraDialogOptions).then((imagePath) => {
    //     if (this.platform.is('android') && //If android and select an existing photo
    //     sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
    //       this.filePath.resolveNativePath(imagePath)
    //       .then(filePath => {
    //         console.log('file path: ', filePath);
    //
    //         const path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
    //         const name = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
    //         console.log('Path from filePath substring: ' + path);
    //         console.log('Name from imagePath substring: ' + name);
    //
    //         this.copyFileToLocalDir(path, name);
    //       });
    //     }
    //     else if (this.platform.is('android') && //If android and take a photo with camera
    //     sourceType === this.camera.PictureSourceType.CAMERA) {
    //       console.log("Android platform and photo taken with camera");
    //     } else { //ios
    //       console.log("iOS platform");
    //       const name = imagePath.substr(imagePath.lastIndexOf('/') + 1);
    //       const path = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
    //       console.log('Path from filePath substring: ' + path);
    //       console.log('Name from imagePath substring: ' + name);
    //       this.copyFileToLocalDir(path, name);
    //     }
    //   }, (err) => console.log(err));
    // }
    //
    // private copyFileToLocalDir(namePath, currentName) {
    //   const imageFileName = new Date().getTime() + '.jpg';
    //   this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, imageFileName)
    //   .then(success => {
    //     this.lastImage = imageFileName;
    //     this.imageURI = this.pathForImage(this.lastImage);
    //     this.uriReady = true;
    //
    //   }, err => console.error('ERROR', JSON.stringify(err)));
    // }

    public pathForImage(img) {
      const path = img === null ? '' : cordova.file.dataDirectory + img;
      if (img !== null) {
        console.log("pathForImage() function, path is " + path);
      }
      return path;
    }
  }
