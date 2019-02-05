import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountValidator } from  '../../validators/account.validator';
import { Utilities, StorageUtilities, Users, MatchProfiles  } from '../../providers';
import { USER_PROFILE_ERROR } from '../';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  errorMessage: string = 'Please verify all fields are completed and are valid.';
  responseData: any;
  email: string;
  password: string;
  userForm: FormGroup;
  loginAttempted: boolean = false;
  userAuthType: string = 'log in';
  authHeaders: any;

  constructor(public navParams: NavParams, public navCtrl: NavController,
    public formBuilder: FormBuilder, public utils: Utilities,
    public storageUtils: StorageUtilities, public userService: Users,
    public matchProfService: MatchProfiles,
    public accountValidator: AccountValidator,
    public loadCtrl: LoadingController) {

      // let username = new FormControl('', accountValidator.isValidEmail);
      // let password = new FormControl('', Validators.required);
      // let confirm = new FormControl('');
      // if (this.userAuthType == 'sign up') {
      //   username = new FormControl('', [accountValidator.isValidEmail, accountValidator.validateUniqueUserEmail.bind(accountValidator)]);
      //   password = new FormControl('', [Validators.required, AccountValidator.isValidPassword]);
      //   confirm = new FormControl('', Validators.required);
      // }
      this.userForm = formBuilder.group({
        email: ['', accountValidator.isValidEmail],
        password: ['', Validators.required],
        confirm: ['']
        // email: username,
        // password: password,
        // confirm: confirm
      });
    }

    ionViewDidLoad() {
      this.storageUtils.getDataFromStorage('authHeaders').then(val => {
        this.authHeaders = val;
      });

      this.userAuthType = this.navParams.get('userAuthType');

      if (ENV.AUTO_FILL) {
        if (this.userAuthType == 'log in') {
          this.email = ENV.VALIDATE_EMAIL_USER;
          this.password = ENV.VALIDATE_EMAIL_PASS;
          this.login();
        } else {
          this.userForm.controls.password.setValue('password');
          this.userForm.controls.confirm.setValue('password');
          this.register();
        }
      }
    }

    authenticateUser() {
      if (ENV.AUTO_PROCEED_FOR_TESTING) {
        this.navCtrl.push('CreateUserProfilePage');
        return;
      }
      if(!this.userForm.valid){
        this.loginAttempted = true;
        return;
      }
      return this.userAuthType == 'log in' ? this.login() : this.register();
    }

    register() {
      //Validate username is available but don't actually register until create user profile page
      this.userService.getUserAccountByEmail(this.email, this.authHeaders)
      .map(res => res.json())
      .subscribe(response => {
        if(response.isSuccess){ //Username is taken
          this.errorMessage = "Please enter a unique email to create a user account."
          this.utils.presentDismissableToast("Email is in use for an existing account.");
        } else {
          this.storageUtils.storeData('email', this.email);
          this.storageUtils.storeData('password', this.password);

          this.navCtrl.push('CreateUserProfilePage');
        }
      }, error => console.error('ERROR: ', JSON.stringify(error)));
    }

    login() {
      this.userService.authenticateUser(this.email, this.password)
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        const authObj = this.storageUtils.extractAndStoreAuthHeaders(response);
        // this.utils.presentAutoDismissToast("Login success! Please wait...");
        let loader = this.loadCtrl.create({
          content: "Login success. Loading user data ..."
        });
        loader.present();
        this.retrieveUserProfile(this.storageUtils.createHeadersObjFromAuth(authObj), loader);

      }, error => {
        console.error('ERROR: ', JSON.stringify(error));
        this.utils.presentDismissableToast("Invalid login credentials, please try again.");
      });
    }

    retrieveUserProfile(headers: any, loader: any) {
      this.userService.getUserProfileByEmail(this.email, headers)
      .map(res => res.json())
      .subscribe(resp => {
        console.log(resp);
        if (!resp.isSuccess) {
          this.dismissLoader(loader);

          //Happens when user created user account but never created user profile (only possible with old flow)
          this.utils.presentDismissableToast(USER_PROFILE_ERROR);

          this.storageUtils.storeData('email', this.email);
          this.storageUtils.storeData('password', this.password);

          this.navCtrl.push('CreateUserProfilePage');
        } else {

          const userProfileObj = resp['userProfiles'][0];
          this.retrieveMatchProfileData(userProfileObj, loader);

        }
      }, err => {
        console.error('ERROR: ', JSON.stringify(err));
        this.dismissLoader(loader);
      });
    }

    updateLastLogin(userProfileObj: any, loader: any) {
      const currentDate = this.utils.currentDateToValidDateFormat();

      // Check if the lastLogin field needs to be updated
      if (userProfileObj.lastLogin != currentDate) {
        this.userService.updateLastLogin(userProfileObj, currentDate)
        .map(res => res.json())
        .subscribe(resp => {
          if (resp.isSuccess) {
            console.log('updated last login');
            const userProfile = resp['userProfiles'][0];

            this.storeUserAndNavToMain(userProfile, loader)//Store user after last login has been updated
          }
        }, err => {
          console.error('ERROR: ', JSON.stringify(err));
          this.dismissLoader(loader);
        });
      } else {
        this.storeUserAndNavToMain(userProfileObj, loader);
      }
    }

    private storeUserAndNavToMain(userProfileObj: any, loader: any) {
      this.storageUtils.storeData('user', userProfileObj); //Store user
      this.navCtrl.push('TabsPage'); //Only proceed after user/match profile data has been stored (for displaying on profile snapshot page)
      this.dismissLoader(loader);

    }

    retrieveMatchProfileData(userProfileObj: number, loader: any) {
      this.matchProfService.getMatchProfilesByUserId(userProfileObj['id'])
      .map(res => res.json())
      .subscribe(resp => {
        console.log(JSON.stringify(resp));
        this.updateLastLogin(userProfileObj, loader); //Regardless of whether the user has match profiles yet, update last login for user profile
        if (resp.isSuccess) {
          console.log(JSON.stringify(resp.matchProfiles));
          const profiles = resp.matchProfiles;
          console.log("USER HAS "  + resp.matchProfiles.length + " MATCH PROFILES");
          this.storageUtils.storeData('profiles', profiles);
        }
      }, err => {
        console.error('ERROR: ', JSON.stringify(err));
        this.dismissLoader(loader);
      });
    }

    private dismissLoader(loader: any) {
      if (loader) {
        loader.dismiss();
        loader = null;
      }
    }
  }
