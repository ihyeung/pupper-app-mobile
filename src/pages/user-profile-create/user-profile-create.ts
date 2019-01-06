import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { Utilities, Users  } from '../../providers';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';

@IonicPage()
@Component({
  templateUrl: 'user-profile-create.html',
  selector: 'page-user-profile-create'
})

export class CreateUserProfilePage {
  firstName: string;
  lastName: string;
  birthdate: string;
  zip: string;
  maritalStatus: any;
  sex: any;
  minDate: string;
  maxDate: string;
  imageFilePath: string;
  imageFileName: string;
  userAccount: any;
  userProfileFormData: any;
  authHeaders: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,

    public utilService: Utilities,
    public userService: Users,
    private storage: Storage,
    private file: File,
    private filePath: FilePath) {

      this.imageFilePath = navParams.get('filePath');
      this.imageFileName = navParams.get('filename');

      this.userProfileFormData = navParams.get('formData');
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad CreateUserProfilePage');

      this.setDatePickerBounds();

      this.utilService.getDataFromStorage('account')
      .then(val => {
        this.userAccount = val;
      });

      this.utilService.getAuthHeaders().then(val => {
        this.authHeaders = val;
      })
    }

    createUserProfile() {
      if(this.userAccount && this.authHeaders) { //Only proceed if userAccount has been loaded

        const today = this.utilService.currentDateToValidDateFormat();
        this.userProfileFormData = JSON.stringify({
          firstName: this.firstName,
          lastName: this.lastName,
          birthdate: this.birthdate,
          zip: this.zip,
          maritalStatus: this.maritalStatus,
          sex: this.sex,
          dateJoin: today,
          lastLogin: today,
          userAccount: this.userAccount
        });

        this.userService.createUserProfile(this.userProfileFormData, this.authHeaders)
        .map(res => res.json())
        .subscribe(result => {
          if (result['isSuccess']) {
            this.utilService.presentAutoDismissToast("User Profile Created! Please wait ...");
            const userProfileObj = result['userProfiles'][0];

            this.utilService.storeData('user', userProfileObj);

            //Redirect newly created user to create a new match profile
            this.navCtrl.push('CreateMatchProfilePage');
          }
        }, err => console.error('ERROR', err));
      }
    }

    setDatePickerBounds() {
      this.minDate = new Date('Jan 1, 1930').toISOString();
      const minAgeLim = new Date();
      minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
      this.maxDate = minAgeLim.toISOString();
    }

    // addProfileImage() {
    // this.navCtrl.push('ImageUploadPage', {
    //   profileType : 'user',
    //   formData: this.userProfileFormData //Pass form data so data can be restored upon return
    // });

    addProfileImage() {
      const filepath = "/Users/iyeung/School/pupperstuff/CAPSTONE_DEMO_IMG.jpg";
      this.filePath.resolveNativePath(filepath)
      .then(filePath => {
        console.log('file path: ', filePath);
      });
      let formData = new FormData();
      formData.append('name', 'profilePic');
      formData.append('filename', filepath);
      this.utilService.uploadUserImage(67, formData, this.authHeaders)
      .subscribe(res => {
        console.log(res);
      } , err => console.error('ERROR ', err));
    }
  }

//     private processImageUpload(file: any) {
//
//       const reader = new FileReader();
//
//       reader.onloadend = () => {
//
//         const formData = new FormData();
//
//         const blobFile = new Blob([reader.result], {type: file.type});
//
//         formData.append('profilePic', blobFile);
//
//         // POST formData call
//
//       },
//
//       error => { }
//
//     );
//
//   };
//
//   reader.readAsArrayBuffer(file);
