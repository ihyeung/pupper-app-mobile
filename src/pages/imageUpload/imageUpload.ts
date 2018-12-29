import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-imageUpload',
  templateUrl: 'imageUpload.html'
})
export class ImageUploadPage {
  lastImage: string = null;
  imageFor: string;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public globalVarsProvider: GlobalVarsProvider) {
      this.imageFor = this.navParams.get('profileType');
    }

  public takePicture(sourceType) {
    const cameraDialogOptions = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(cameraDialogOptions).then((imagePath) => {

      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            const path = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            const name = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(path, name);
          });
      } else { //ios
        const name = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        const path = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(path, name);
      }
    }, (err) => console.log(err));
  }

  private copyFileToLocalDir(namePath, currentName) {
    const imageFileName = new Date().toUTCString() + '.jpg';
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, imageFileName)
    .then(() => {
      this.lastImage = imageFileName;
    }, err => console.log(err));
  }

  public pathForImage(img) {
    return img === null ? '' : cordova.file.dataDirectory + img;
  }

  public uploadImage() {
    const fileToUpload = this.pathForImage(this.lastImage);
    const filename = this.lastImage;
    console.log('Image path: ' + fileToUpload);
    console.log('File name: ' + filename);

    const fileData = {
      filePath: fileToUpload,
      filename: filename
    };
    
    if (this.imageFor == 'user') {
      this.navCtrl.push('SignupPage', fileData);
    } else {
      this.navCtrl.push('CreateMatchProfilePage', fileData);
    }
  }

  public selectImageForUpload() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
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
}
