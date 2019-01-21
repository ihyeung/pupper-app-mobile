import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountValidator } from  '../../validators/account.validator';
import { Utilities, Users  } from '../../providers';
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
    public userService: Users, public accountValidator: AccountValidator,
    private storage: Storage) {

      this.userAuthType = this.navParams.get('userAuthType');
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
      this.utils.getDataFromStorage('authHeaders').then(val => {
        if (!val) {
          console.log('auth headers not found in storage');
        }
        else {
          console.log('auth headers successfully loaded from storage');
          this.authHeaders = val;
        }
      });
    }

    authenticateUser() {
      if (ENV.AUTO_FILL) {
        console.log('Auto fill flag set');
        this.email = ENV.VALIDATE_EMAIL_USER;
        this.password = ENV.VALIDATE_EMAIL_PASS;
        this.login();
      }
      if(!this.userForm.valid){
        this.loginAttempted = true;
        return;
      }
      return this.userAuthType == 'log in' ? this.login() : this.register();
    }

    register() {
      if (!this.authHeaders) {
        console.log('auth headers undefined');
        return;
      }
      //Validate username is available but don't actually register until create user profile page
      this.userService.getUserAccountByEmail(this.email, this.authHeaders)
      .map(res => res.json())
      .subscribe(response => {
        if(response.isSuccess){ //Username is taken
          this.errorMessage = "Please enter a unique email to create a user account."
          this.utils.presentDismissableToast("Email is in use for an existing account.");
        } else {
          this.utils.storeData('email', this.email);
          this.utils.storeData('password', this.password);

          this.navCtrl.push('CreateUserProfilePage');
        }
      }, error => console.error('ERROR: ', JSON.stringify(error)));
    }

    login() {
      this.userService.authenticateUser(this.email, this.password)
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        const authObj = this.utils.extractAndStoreAuthHeaders(response);
        this.utils.presentAutoDismissToast("Login success! Please wait...");
        this.retrieveUserProfile(this.utils.createHeadersObjFromAuth(authObj));

      }, error => {
        console.error('ERROR: ', error.body);
        this.utils.presentDismissableToast("Invalid login credentials, please try again.");
      });
    }

    retrieveUserProfile(headers: any) {
      this.userService.getUserProfileByEmail(this.email, headers)
      .map(res => res.json())
      .subscribe(resp => {
        console.log(resp);
        if (!resp.isSuccess) {
          //Happens when user created user account but never created user profile (only possible with old flow)
          this.utils.presentDismissableToast(USER_PROFILE_ERROR);
          this.navCtrl.push('CreateUserProfilePage', {
            email: this.email,
            password: this.password
          });
        } else {
          const userProfileObj = resp['userProfiles'][0];
          this.updateLastLogin(userProfileObj);//Update lastLogin if needed and store user object
          this.navCtrl.push('TabsPage');
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    updateLastLogin(userProfileObj: any) {

      const currentDate = this.utils.currentDateToValidDateFormat();
      // Check if the lastLogin field needs to be updated
      if (userProfileObj.lastLogin != currentDate) {
        this.userService.updateLastLogin(userProfileObj, currentDate)
        .map(res => res.json())
        .subscribe(resp => {
          console.log(resp);
          if (resp.isSuccess) {
            console.log('updated last login');
            userProfileObj = resp['userProfiles'][0];
          }
        }, err => console.error('ERROR: ', JSON.stringify(err)));
      }
        this.utils.storeData('user', userProfileObj); //Store user
    }

}
