import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
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
  userAccount: any;
  userProfileFormData: any;
  authHeaders: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,

    public utils: Utilities,
    public userService: Users,
    private storage: Storage,
    private file: File,
    private filePath: FilePath,
    private loadCtrl: LoadingController) {

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad CreateUserProfilePage');

      this.setDatePickerBounds();

      this.utils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });

      this.extractNavParams();
    }

    extractNavParams() {
      console.log('retrieving email and password from storage');
      this.utils.getDataFromStorage('email').then(val => {
        this.userAccount = {
          username: val,
          password: null
        };
        this.utils.getDataFromStorage('password').then(val => {
          this.userAccount['password'] = val;
        })
      })

    this.userProfileFormData = this.navParams.get('formData');
    if (this.userProfileFormData) {
      console.log("Profile passed back from image upload page");
      this.userAccount = this.userProfileFormData.userAccount;
    }
    //Extract nav params from image upload page
    this.imageFilePath = this.navParams.get('filePath');

    console.log('Extracted nav params: ');
    console.log('Image URI: ' + this.imageFilePath);
    console.log('Profile form data: ' + this.userProfileFormData);

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
      this.utils.storeData('account', userAccountObj);

      this.createUserProfile();
    }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  createUserProfile() {
    let loader = this.loadCtrl.create({
      content: "Creating profile ..."
    });
    loader.present();
    this.userProfileFormData = this.getDataFromInputFields();

    this.userService.createUserProfile(JSON.stringify(this.userProfileFormData), this.authHeaders)
    .map(res => res.json())
    .subscribe(result => {
      if (result.isSuccess) {
        const userProfileObj = result['userProfiles'][0];
        this.uploadProfileImageForUser(userProfileObj);

      }
    }, err => {
      console.error('ERROR: ', err.body);
      loader.dismiss();
    });
  }

  uploadProfileImageForUser(userProfileObj: any) {
    const userId = userProfileObj['id'];
    const imageUrl = this.utils.uploadFile(userId, null, this.imageFilePath);
    console.log('image url: ' + imageUrl);
      // userProfileObj['profileImage'] = val; //Update profileImage field after upload before storing in storage
      // this.utils.storeData('user', userProfileObj);
      // this.utils.presentAutoDismissToast("User Profile Created! Please wait ...");

      //Redirect newly created user to create a new match profile
      // this.navCtrl.push('CreateMatchProfilePage');
    // })
  }

  setDatePickerBounds() {
    this.minDate = new Date('Jan 1, 1930').toISOString();
    const minAgeLim = new Date();
    minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
    this.maxDate = minAgeLim.toISOString();
  }

  addProfileImage() {
    const data = this.userProfileFormData ? this.userProfileFormData :
    this.getDataFromInputFields();

    this.navCtrl.push('ImageUploadPage', {
      profileType : 'user',
      formData: data //Pass form data so data can be restored upon return
    });
  }

  private getDataFromInputFields() {
    const today = this.utils.currentDateToValidDateFormat();

    return {
      firstName: this.firstName,
      lastName: this.lastName,
      birthdate: this.birthdate,
      zip: this.zip,
      maritalStatus: this.maritalStatus,
      sex: this.sex,
      dateJoin: today,
      lastLogin: today,
      userAccount: this.userAccount,
      profileImage: null
    };
  }
}
