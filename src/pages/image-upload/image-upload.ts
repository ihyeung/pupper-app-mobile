import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { normalizeURL } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Utilities } from '../../providers';
import { MAX_IMAGE_BYTES } from '../';


declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadPage {
  imageFor: string;
  profileData: any;
  normalizedImageURI: string; //Normalized uri for displaying image on image-upload page after selecting image
  imagePathForUpload: string; //Image path to be used for image upload
  preferenceData: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    private utils: Utilities) { }

    ionViewDidLoad() {
      this.imageFor = this.navParams.get('profileType');
      this.profileData = this.navParams.get('formData');
      this.preferenceData = this.navParams.get('matchPreferenceData');
    }

    selectProfileImage(sourceType: any) {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true //Allows image to be cropped/edited
      };

      this.camera.getPicture(options).then(imagePath => {
        console.log('IMAGE PATH: ' + imagePath);
        if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          console.log('Android library');

          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('Resolved native path: ', filePath);
            // this.normalizedImageURI = this.domSanitizer.bypassSecurityTrustUrl(normalizeURL(imagePath));
            this.copyFileToLocalDir(filePath, true);
          }).catch(err => console.error('ERROR: ' + JSON.stringify(err)));
        }
        else if (this.platform.is('ios')){
          console.log('ios');
          // this.normalizedImageURI = this.wv.convertFileSrc(imagePath);
          this.copyFileToLocalDir(imagePath, false);

        }
        else if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.CAMERA) {
          console.log('Android camera');
          // this.normalizedImageURI = this.domSanitizer.bypassSecurityTrustUrl(normalizeURL(imagePath));
          this.copyFileToLocalDir(imagePath, false);
        }
      }).catch(err => console.error('ERROR: ' + JSON.stringify(err)));
    }

    private copyFileToLocalDir(imagePath: string, androidPhotoLibrary: boolean) {
      const pathToFile = this.parsePathForFile(imagePath);
      const name = this.parseFileNameForFile(imagePath, androidPhotoLibrary);
      const newFileName = this.createTempFileName();
      this.file.copyFile(pathToFile, name, cordova.file.dataDirectory, newFileName).then(success => {
        const copiedFilePath = cordova.file.dataDirectory + newFileName;
        console.log("Image successfully copied: " + copiedFilePath);
        this.imagePathForUpload = copiedFilePath;
        this.normalizedImageURI = normalizeURL(copiedFilePath);

        this.validateImageSize();
      }, error => {
        console.error('ERROR: ' + JSON.stringify(error));
      });
    }

    validateImageSize() {
      this.file.resolveLocalFilesystemUrl(this.imagePathForUpload)
      .then(fileEntry => {
        fileEntry.getMetadata(metadata => {
          console.log("Image bytes: " + metadata.size);
          if (metadata.size > MAX_IMAGE_BYTES) {
            let alert = this.utils.presentAlert("Selected image exceeds max allowable file size. " +
            "Please select a different image, or crop the photo prior to upload.");
            alert.present();
            alert.onDidDismiss(() => {
              this.imagePathForUpload = null;
              this.normalizedImageURI = null;
            });
          }
        })
      });
    }

    createTempFileName() {
      return this.utils.currentDateToValidDateFormat() + '-' + new Date().getTime() + '.jpg';
    }

    parsePathForFile(completeFilePath: string) {
      return completeFilePath.substr(0, completeFilePath.lastIndexOf('/') + 1);
    }

    parseFileNameForFile(completeFilePath: string, isAndroidPhotoLibrary: boolean) {
      if (isAndroidPhotoLibrary) {
        return completeFilePath.substring(completeFilePath.lastIndexOf('/') + 1, completeFilePath.lastIndexOf('?'));
      }
      return completeFilePath.substr(completeFilePath.lastIndexOf('/') + 1);
    }

    passImageUriForUpload() {
      const profileData = {
        filePath: this.imagePathForUpload, //Pass original image uri for uploading image on create profile page
        imagePreview: this.normalizedImageURI, //Pass normalized uri for displaying image on create profile page
        formData: this.profileData, //Pass data from create profile page back to restore state
        matchPreferenceData: this.preferenceData
      };

      if (this.imageFor == 'user') {
        this.navCtrl.push('CreateUserProfilePage', profileData);
      } else {
        this.navCtrl.push('CreateMatchProfilePage', profileData);
      }
    }

    getImageUploadDialog() {
      const actionSheet = this.actionSheetCtrl.create({
        title: 'UPLOAD A PROFILE IMAGE',
        buttons: [
          {
            text: 'SELECT AN EXISTING PHOTO',
            handler: () => this.selectProfileImage(this.camera.PictureSourceType.PHOTOLIBRARY)
          },
          {
            text: 'TAKE A PHOTO',
            handler: () => this.selectProfileImage(this.camera.PictureSourceType.CAMERA)
          },
          {
            text: 'CANCEL',
            role: 'cancel'
          }
        ]
      });
      actionSheet.present();
    }
  }
