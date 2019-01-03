import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountValidator } from  '../../validators/account.validator';
import { Utilities, Users, GlobalVars } from '../../providers';

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
    public globalVars: GlobalVars,
    public formBuilder: FormBuilder, public utilService: Utilities,
    public userService: Users, public accountValidator: AccountValidator,
    private storage: Storage) {

      this.userAuthType = this.navParams.get('userAuthType');
      let username = new FormControl('', accountValidator.isValidEmail);
      let password = new FormControl('', Validators.required);
      let confirm = new FormControl('');
      if (this.userAuthType == 'sign up') {
        username = new FormControl('', [accountValidator.isValidEmail, accountValidator.validateUniqueUserEmail.bind(accountValidator)]);
        password = new FormControl('', [Validators.required, AccountValidator.isValidPassword]);
        confirm = new FormControl('', Validators.required);
      }
      this.userForm = formBuilder.group({
        // email: ['', AccountValidator.isValidEmail, accountValidator.validateUniqueUserEmail],
        // password: ['', accountValidator.isValidPassword],
        // confirm: ['', Validators.required]
        email: username,
        password: password,
        confirm: confirm
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
      .subscribe(response => {
        if (response['status'] == 200) {
          let jsonResponseObj = JSON.parse(response['_body']);
          if (jsonResponseObj['responseCode'] == 409) {
            this.utilService.presentDismissableToast("A user account with your selected username already exists." +
            " Please login as an existing user or create a user profile using a unique username.");
            return;
          }

          const userAccountObj = jsonResponseObj['userAccounts'][0];
          this.utilService.storeUserAccount(userAccountObj);
          //login to get authentiation token
          this.login(true);

          this.navCtrl.push('CreateUserProfilePage');
        }
      }, err => console.error('ERROR', err));
    }

    login(isNewUser: boolean) {
      this.userService.authenticateUser(this.email, this.password)
      .map(res => res.json())
      .subscribe(response => {
        //A response is only received if login is successful (only applies to this specific endpoint)
        this.utilService.presentAutoDismissToast("Login success! Please wait...");

        const authObj = this.utilService.extractAndStoreAuthHeaders(response);

        if (!isNewUser) {
          this.retrieveUserProfile(this.utilService.createHeadersObjFromAuth(authObj));
        }

      }, error => {
        this.utilService.presentDismissableToast("Invalid login credentials, please try again.");
      });
    }

    retrieveUserProfile(headers) {
      this.userService.getUserProfileByEmail(this.email, headers)
      .subscribe(resp => {
        let jsonResponseObj = JSON.parse(resp['_body']);
        let userProfileObj = jsonResponseObj['userProfiles'][0];

        //Store the retrieved user profile object
        this.utilService.storeUserProfile(userProfileObj);

        const currentDate = this.utilService.getCurrentDateInValidFormat();

        //Check if the lastLogin field needs to be updated
        if (userProfileObj['lastLogin'] != currentDate) {
          this.updateLastLogin(userProfileObj, currentDate);
        }
        this.navCtrl.push('TabsPage');
      }, err => console.error('ERROR', err));
    }

    updateLastLogin(userProfileObj, currentDate) {
      this.userService.updateLastLogin(userProfileObj, currentDate)
      .subscribe(resp => {
        if (resp['status'] == 200) {
          console.log('updated last login');
        }
      }, err => console.error('ERROR', err));
    }
  }
