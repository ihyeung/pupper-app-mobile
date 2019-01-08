import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path'; //For resolving filepath for Android
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  imageTemp: string;
  imageFileName: any;
  uriReady: boolean = false;
  tempReady: boolean = false;



  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform) {
      this.imageFor = this.navParams.get('profileType');
      this.profileData = this.navParams.get('formData');
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ImageUploadPage');
    }

    public selectImageForUpload() {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'Select Image Source',
        buttons: [
          {
            text: 'Load from Library',
            handler: () => {
              this.selectExistingOrTakePhoto(this.camera.PictureSourceType.PHOTOLIBRARY);
            }
          },
          {
            text: 'Use Camera',
            handler: () => {
              this.selectExistingOrTakePhoto(this.camera.PictureSourceType.CAMERA);
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
    }

    private setCameraOptions(sourceType) {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        // saveToPhotoAlbum: true,
        correctOrientation: true,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      return options;
    }

    public selectExistingOrTakePhoto(sourceType) {
      // const cameraDialogOptions : CameraOptions = {
      //   quality: 100,
      //   sourceType: sourceType,
      //   // saveToPhotoAlbum: true,
      //   correctOrientation: true,
      //   destinationType: this.camera.DestinationType.FILE_URI,
      //   encodingType: this.camera.EncodingType.JPEG,
      //   mediaType: this.camera.MediaType.PICTURE
      //   // destinationType: this.camera.DestinationType.FILE_URI
      //
      // };
      const cameraDialogOptions = this.setCameraOptions(sourceType);

      this.camera.getPicture(cameraDialogOptions).then((imagePath) => {
        if (this.platform.is('android') && //If android and select an existing photo
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('file path: ', filePath);

            const path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const name = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            console.log('Path from filePath substring: ' + path);
            console.log('Name from imagePath substring: ' + name);

            this.copyFileToLocalDir(path, name);
          });
        }
        else if (this.platform.is('android') && //If android and take a photo with camera
        sourceType === this.camera.PictureSourceType.CAMERA) {
          console.log("Android platform and photo taken with camera");
        } else { //ios
          console.log("iOS platform");
          const name = imagePath.substr(imagePath.lastIndexOf('/') + 1);
          const path = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
          console.log('Path from filePath substring: ' + path);
          console.log('Name from imagePath substring: ' + name);
          this.copyFileToLocalDir(path, name);
        }
      }, (err) => console.log(err));
    }

    private copyFileToLocalDir(namePath, currentName) {
      const imageFileName = new Date().getTime() + '.jpg';
      this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, imageFileName)
      .then(success => {
        this.lastImage = imageFileName;
        this.imageURI = this.pathForImage(this.lastImage);
        this.uriReady = true;

      }, err => console.error('ERROR', JSON.stringify(err)));
    }

    public pathForImage(img) {
      const path = img === null ? '' : cordova.file.dataDirectory + img;

      if (img !== null) {
        console.log("pathForImage() function, path is " + path);
      }
      return path;
    }

    public uploadImage() {
      const fileToUpload = this.pathForImage(this.lastImage);
      console.log('FilePath for image: ' + fileToUpload);

      const profileData = {
        filePath: fileToUpload,
        formData: this.profileData //Pass data from create profile page back to restore state
      };

      if (this.imageFor == 'user') {
        this.navCtrl.push('CreateUserProfilePage', profileData);
      } else {
        this.navCtrl.push('CreateMatchProfilePage', profileData);
      }
    }
  }
