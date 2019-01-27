import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { StorageUtilities } from '../../providers';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { normalizeURL } from 'ionic-angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';


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
  imageURI: string; //Normalized uri for displaying on page after selecting image
  imagePathForUpload: string; //For retrieving the image path for upload
  uriReady: boolean = false;
  headers: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public utils: StorageUtilities,
    private filePath: FilePath,
    private file: File,
    private wv: WebView) { }

    ionViewDidLoad() {
      this.imageFor = this.navParams.get('profileType');
      this.profileData = this.navParams.get('formData');
      if (this.profileData) {
        console.log('profile form data passed from create profile page');
      }
    }

    selectProfileImage(sourceType: any) {
      const saveCopy = sourceType === this.camera.PictureSourceType.CAMERA ? true : false;
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: saveCopy
      };

      this.camera.getPicture(options).then(imagePath => {
        console.log('IMAGE PATH: ' + imagePath);
        this.imagePathForUpload = imagePath;
        // this.imageURI = normalizeURL(imagePath);
        this.imageURI = this.wv.convertFileSrc(imagePath);

        console.log('NORMALIZED IMAGE PATH: ' + this.imageURI);

        if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('Resolved native path: ', filePath);
            this.imagePathForUpload = filePath;
            this.imageURI = this.wv.convertFileSrc(imagePath);

          }).catch(err => console.error('ERROR RESOLVING NATIVE PATH: ' + JSON.stringify(err)));
        } else if (this.platform.is('ios')){
          console.log('ios');
        }
        else if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.CAMERA) {
          console.log('Android camera');
        }

      }).catch(err => console.error('ERROR: ' + JSON.stringify(err)));
    }

    passImageUriForUpload() {
      const profileData = {
        filePath: this.imagePathForUpload,
        formData: this.profileData //Pass data from create profile page back to restore state
      };

      if (this.imageFor == 'user') {
        this.navCtrl.push('CreateUserProfilePage', profileData);
      } else {
        this.navCtrl.push('CreateMatchProfilePage', profileData);
      }
    }

    getImageUploadDialog() {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Select Image Source',
        buttons: [
          {
            text: 'Select Existing From Gallery',
            handler: () => this.selectProfileImage(this.camera.PictureSourceType.PHOTOLIBRARY)
          },
          {
            text: 'Take Photo',
            handler: () => this.selectProfileImage(this.camera.PictureSourceType.CAMERA)
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
    // private copyFileToLocalDir(tempFilePath: string, tempFileName: string) {
    //   const fileNameLocalCopy = new Date().getTime() + '.jpg';
    //   this.file.copyFile(tempFilePath, tempFileName, cordova.file.dataDirectory, fileNameLocalCopy)
    //   .then(success => {
    //     // this.imageURI = this.pathForImage(tempFileName);
    //     // console.log('image URI of file copied to local directory: ' + this.imageURI);
    //     if (this.platform.is('ios')) {
    //       this.imageURI = this.imageURI.replace(/^file:\/\//, '');
    //     }
    //   }, err => console.error('ERROR', JSON.stringify(err)));
    // }

    public pathForImage(img) {
      return img === null ? '' : cordova.file.dataDirectory + img;
    }
  }
