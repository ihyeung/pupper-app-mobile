import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { ActionSheetController, Platform } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';
import { normalizeURL } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-image-upload',
  templateUrl: 'image-upload.html'
})
export class ImageUploadPage {
  imageFor: string;
  profileData: any;
  imageURI: string; //Normalized uri for displaying image on image-upload page after selecting image
  imagePathForUpload: string; //Image path to be used for image upload

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private filePath: FilePath) { }

    ionViewDidLoad() {
      this.imageFor = this.navParams.get('profileType');
      this.profileData = this.navParams.get('formData');
    }

    selectProfileImage(sourceType: any) {
      const options: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: sourceType,
        encodingType: this.camera.EncodingType.JPEG,
        correctOrientation: true,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true //Allows image to be cropped/edit
      };

      this.camera.getPicture(options).then(imagePath => {
        console.log('IMAGE PATH: ' + imagePath);
        if (this.platform.is('ios')){
          console.log('ios');
          this.imagePathForUpload = imagePath;
          this.imageURI = normalizeURL(imagePath);
          // this.imageURI = this.wv.convertFileSrc(imagePath);
          console.log('NORMALIZED IMAGE PATH: ' + this.imageURI);
        }
        else if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
          console.log('Android library');

          this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('Resolved native path: ', filePath);
            this.imageURI = filePath;
            // this.imageURI = this.domSanitizer.bypassSecurityTrustUrl(normalizeURL(imagePath));
            this.imagePathForUpload = filePath;
          }).catch(err => console.error('ERROR: ' + JSON.stringify(err)));
        }
        else if (this.platform.is('android') &&
        sourceType === this.camera.PictureSourceType.CAMERA) {
          console.log('Android camera');
          this.imageURI = imagePath;
          this.imagePathForUpload = imagePath;
          // this.imageURI = this.domSanitizer.bypassSecurityTrustUrl(normalizeURL(imagePath));
        }
      }).catch(err => console.error('ERROR: ' + JSON.stringify(err)));
    }

    passImageUriForUpload() {
      const profileData = {
        filePath: this.imagePathForUpload,
        imagePreview: this.imageURI,
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
