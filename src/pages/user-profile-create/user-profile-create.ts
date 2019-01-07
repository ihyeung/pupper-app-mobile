import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { Utilities, Users  } from '../../providers';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { DEFAULT_USER_IMG } from '../';

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

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad CreateUserProfilePage');

      this.setDatePickerBounds();

      this.utilService.getAuthHeaders().then(val => {
        this.authHeaders = val;
      });

      this.extractNavParams();
    }

    extractNavParams() {
      //Extract nav params from login/register page
      const email = this.navParams.get('email');
      const pass = this.navParams.get('password');

      if (email && pass) {
        this.userAccount = {
          username: email,
          password: pass
        }
      }

      //Extract nav params from image upload page
      this.imageFilePath = this.navParams.get('filePath');
      this.imageFileName = this.navParams.get('fileName');
      this.userProfileFormData = this.navParams.get('formData');

      console.log(this.imageFilePath);
      console.log(this.imageFileName);
      console.log(this.userProfileFormData);

    }

    createUser() {
      this.createUserAccount();
    }

    createUserAccount() {
      this.userService.createUserAccount(this.userAccount.username, this.userAccount.password)
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        const userAccountObj = response['userAccounts'][0];
        this.userAccount = userAccountObj; //update to reference additional userAccountId field
        this.utilService.storeData('account', userAccountObj);

        this.createUserProfile();
      }, err => console.error('ERROR', err));
    }

    createUserProfile() {
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
        userAccount: this.userAccount,
        activeMatchProfileId: null,
        profileImage: this.filePath ? this.filePath: DEFAULT_USER_IMG
      });

      this.userService.createUserProfile(this.userProfileFormData, this.authHeaders)
      .map(res => res.json())
      .subscribe(result => {
        if (result.isSuccess) {
          this.utilService.presentAutoDismissToast("User Profile Created! Please wait ...");
          const userProfileObj = result['userProfiles'][0];

          this.utilService.storeData('user', userProfileObj);

          //Redirect newly created user to create a new match profile
          this.navCtrl.push('CreateMatchProfilePage');
        }
      }, err => console.error('ERROR', err));
    }

    setDatePickerBounds() {
      this.minDate = new Date('Jan 1, 1930').toISOString();
      const minAgeLim = new Date();
      minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
      this.maxDate = minAgeLim.toISOString();
    }

    addProfileImage() {
      this.navCtrl.push('ImageUploadPage', {
        profileType : 'user',
        formData: this.userProfileFormData //Pass form data so data can be restored upon return
      });

      // addProfileImage() {
      //   const filepath = "/Users/iyeung/School/pupperstuff/CAPSTONE_DEMO_IMG.jpg";
      //   this.filePath.resolveNativePath(filepath)
      //   .then(filePath => {
      //     console.log('file path: ', filePath);
      //   });
      //   let formData = new FormData();
      //   formData.append('name', 'profilePic');
      //   formData.append('filename', filepath);
      //   this.utilService.uploadUserImage(67, formData, this.authHeaders)
      //   .subscribe(res => {
      //     console.log(res);
      //   } , err => console.error('ERROR ', err));
    }
  }
