import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountValidator } from  '../../validators/account.validator';
import { Utilities, Users  } from '../../providers';

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

  constructor(public navParams: NavParams, public navCtrl: NavController,

    public formBuilder: FormBuilder, public utilService: Utilities,
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

    authenticateUser() {
      // if (ENV.AUTO_FILL) {
      //   console.log('AUTO FILL IS SET');
      //   this.email = ENV.VALIDATE_EMAIL_USER;
      //   this.password = ENV.VALIDATE_EMAIL_PASS;
      //   this.login(false);
      // }
      if(!this.userForm.valid){
        this.loginAttempted = true;
        return;
      }
      return this.userAuthType == 'log in' ? this.login(false) : this.register();
    }

    register() {
      this.userService.createUserAccount(this.email, this.password)
      .map(res => res.json())
      .subscribe(response => {
        console.log(response);
        if (response.responseCode == 409) {
          this.utilService.presentDismissableToast("Email is in use for an existing account.");
          return;
        }

        const userAccountObj = response['userAccounts'][0];
        this.utilService.storeData('account', userAccountObj);
        //login to get authentiation token
        this.login(true);

        this.navCtrl.push('CreateUserProfilePage');
      }, err => console.error('ERROR', err));
    }

    login(isNewUser: boolean) {
      this.userService.authenticateUser(this.email, this.password)
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        if (!isNewUser) {
          this.utilService.presentAutoDismissToast("Login success! Please wait...");
        }

        const authObj = this.utilService.extractAndStoreAuthHeaders(response);

        if (!isNewUser) {
          this.retrieveUserProfile(this.utilService.createHeadersObjFromAuth(authObj));
        }

      }, error => { console.error('ERROR ', error);
      this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
    });
  }

  retrieveUserProfile(headers: any) {
    this.userService.getUserProfileByEmail(this.email, headers)
    .map(res => res.json())
    .subscribe(resp => {
      console.log(resp);
      if (!resp.isSuccess) {
        //Happens when user created user account but never created user profile
        //TODO: Fix this
      } else {
        const userProfileObj = resp['userProfiles'][0];

        //Store the retrieved user profile object
        this.utilService.storeData('user', userProfileObj);

        const currentDate = this.utilService.currentDateToValidDateFormat();
        // Check if the lastLogin field needs to be updated
        if (userProfileObj.lastLogin != currentDate) {
          this.updateLastLogin(userProfileObj, currentDate);
        }
        this.navCtrl.push('TabsPage');
      }
    }, err => console.error('ERROR', err));
  }

  updateLastLogin(userProfileObj, currentDate) {
    this.userService.updateLastLogin(userProfileObj, currentDate)
    .map(res => res.json())
    .subscribe(resp => {
      if (resp.isSuccess) {
        console.log('updated last login');
      }
    }, err => console.error('ERROR', err));
  }
}
