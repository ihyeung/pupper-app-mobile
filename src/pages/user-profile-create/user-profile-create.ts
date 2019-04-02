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
  authHeaders: any;
  imagePreview: string;
  uploadButtonLabel: string = 'Upload profile image';
  createButtonLabel: string = 'Create profile';


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
      if (this.navParams.get('isUpdate')) {
        this.uploadButtonLabel = 'Select a new profile image';
        this.createButtonLabel = 'Update profile';
      }
      const userData = this.navParams.get('formData');
      if (userData) {
        this.userAccount = userData.userAccount;

        this.repopulateInputFieldData(userData);
      }
      //Extract nav params from image upload page
      this.imageFilePath = this.navParams.get('filePath');

      //Extract imageURI from image-upload page formatted correctly for displaying on page
      this.imagePreview = this.navParams.get('imagePreview');
    }

    createUser() {
      if (ENV.AUTO_PROCEED_FOR_TESTING) {
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        this.createUserAccount();
      }
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

      const userData = this.getDataFromInputFields();

      this.userService.createUserProfile(JSON.stringify(userData), this.authHeaders)
      .map(res => res.json())
      .subscribe(result => {
        if (result.isSuccess) {
          const userProfileObj = result['userProfiles'][0];
          console.log('User Profile created successfully');
          //TODO: use loader/spinner
          if (this.imageFilePath) {
            this.uploadProfileImageForUser(userProfileObj, loader);
          } else {
            console.log('No image file uploaded, skip profile image upload logic');
            this.dismissLoader(loader);
            this.storeUserAndProceedToNextPage(userProfileObj);
          }
        }
      }, err => {
        console.error('ERROR: ', JSON.stringify(err));
        this.dismissLoader(loader);
      });
    }

    async uploadProfileImageForUser(userProfileObj: any, loader: any) {

      const userId = userProfileObj['id'];
      let response;
      try {
        response = await this.storageUtils.uploadFile(userId, null, this.imageFilePath);
      } catch(err) {
        console.error(JSON.stringify(err));
        this.dismissLoader(loader);

        let alert = this.utils.presentAlert('Error uploading profile image: please select a smaller image');
        alert.present();
      }
      console.log('response from file upload: ' + JSON.stringify(response));
      this.dismissLoader(loader);

      const responseObj = JSON.parse(response.response);
      if (responseObj.isSuccess) {
        this.utils.presentToast("Image upload success");
        const profileImage = responseObj.imageUrl;
        userProfileObj['profileImage'] = profileImage; //Update profile image field
        this.storeUserAndProceedToNextPage(userProfileObj);
      }
    }

    private storeUserAndProceedToNextPage(userProfileObj: any) {
      this.storageUtils.storeData('user', userProfileObj);
      console.log("User Profile Created! Please wait ...");
      this.navCtrl.push('CreateMatchProfilePage', {
        isNewUser: true  //If new user, don't retrieve match profiles list on create match profile page
      });
    }

    setDatePickerBounds() {
      this.minDate = new Date('Jan 1, 1900').toISOString();
      const minAgeLim = new Date();
      minAgeLim.setDate(minAgeLim.getDate() - (13 * 365)); //User must be at least 13 years old
      this.maxDate = minAgeLim.toISOString();
    }

    addProfileImage() {
      this.navCtrl.push('ImageUploadPage', {
        profileType : 'user',
        formData: this.getDataFromInputFields() //Pass form data so data can be restored upon return
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

    repopulateInputFieldData(profile: any) {
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.birthdate = profile.birthdate;
      this.zip = profile.zip;
      this.maritalStatus = profile.maritalStatus;
      this.sex = profile.sex;
    }

    private dismissLoader(loader: any) {
      if (loader) {
        loader.dismiss();
        loader = null;
      }
    }
  }
