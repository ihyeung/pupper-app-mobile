import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController } from 'ionic-angular';
import { Utilities, Users, StorageUtilities } from '../../providers';

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
  maritalStatus: string;
  sex: string;
  minDate: string;
  maxDate: string;
  imageFilePath: string; //Image URI
  userAccount: any;
  userProfileFormData: any;
  authHeaders: any;

  constructor (
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageUtils: StorageUtilities,
    public utils: Utilities,
    public userService: Users,
    private loadCtrl: LoadingController) { }

    ionViewDidLoad() {
      this.setDatePickerBounds();

      this.loadDataFromStorage();
      this.extractNavParams();
    }

    loadDataFromStorage() {
      this.storageUtils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });

      console.log('retrieving email and password from storage');
      this.storageUtils.getDataFromStorage('email').then(val => {
        this.userAccount = {
          username: val,
          password: null
        };
        this.storageUtils.getDataFromStorage('password').then(val => {
          this.userAccount['password'] = val;
        })
      })

    }

    extractNavParams() {
      this.userProfileFormData = this.navParams.get('formData');
      if (this.userProfileFormData) {
        console.log("Profile passed back from image upload page");
        this.userAccount = this.userProfileFormData.userAccount;

        this.repopulateInputFieldData();
      }
      //Extract nav params from image upload page
      this.imageFilePath = this.navParams.get('filePath');

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
        console.log(JSON.stringify(response));
        if (response.isSuccess) {
          const userAccountObj = response['userAccounts'][0];
          this.userAccount = userAccountObj; //update to reference additional userAccountId field
          this.storageUtils.storeData('account', userAccountObj);

          this.createUserProfile();
        }
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
          this.uploadProfileImageForUser(userProfileObj, loader);
        }
      }, err => {
        console.error('ERROR: ', JSON.stringify(err));
        loader.dismiss();
      });
    }

    async uploadProfileImageForUser(userProfileObj: any, loader: any) {
      const userId = userProfileObj['id'];
      let response = await this.storageUtils.uploadFile(userId, null, this.imageFilePath);
      console.log('response from file upload: ' + JSON.stringify(response));
      loader.dismiss();
      if (response.response['isSuccess']) {
        const profileImage = response.response['imageUrl'];
        userProfileObj['profileImage'] = profileImage; //Update profile image field
        this.storageUtils.storeData('user', userProfileObj);

        this.utils.presentAutoDismissToast("User Profile Created! Please wait ...");

        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        //Profile image was not successfully uploaded and updated in database
        this.utils.presentDismissableToast('Error uploading profile image');

      }
    }

    setDatePickerBounds() {
      this.minDate = new Date('Jan 1, 1900').toISOString();
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

    repopulateInputFieldData() {
      const profile = this.userProfileFormData;
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.birthdate = profile.birthdate;
      this.zip = profile.zip;
      this.maritalStatus = profile.maritalStatus;
      this.sex = profile.sex;
    }
  }
