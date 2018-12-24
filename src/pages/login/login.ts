import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Http, Headers } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { GlobalvarsProvider } from '../../providers/globalvars/globalvars';
import { environment as ENV } from '../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountValidator } from  '../../validators/account';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData: any;
  email: string;
  password: string;
  userAccountForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(public navCtrl: NavController,
    public http: Http,
    private toastCtrl: ToastController,
    public globalVarsProvider: GlobalvarsProvider,
    public formBuilder: FormBuilder) {
      this.userAccountForm = formBuilder.group({
        email: ['', AccountValidator.isValidEmail],
        password: ['', Validators.required]
      });
  }

  login() {
    if(!this.userAccountForm.valid){
      this.submitAttempt = true;
      console.log("Validation failed!")
      console.log(this.userAccountForm.value);
      return;
    }

      const headers = new Headers({ 'Content-Type': 'application/json' });

      let loginData = JSON.stringify({
        username: this.email,
        password: this.password
      });

      const loginUrl = ENV.BASE_URL + '/login';

      this.http.post(loginUrl, loginData, { headers: headers })
        .subscribe(response => {
            //A response is only received if login is successful (only applies to this specific endpoint)
            this.presentToast("Login success! Happy Puppering.");
            this.extractAuthHeadersFromLoginSuccessResponse(response);
            this.retrieveUserProfileForLastLoginUpdate();
        },
          error => {
            this.presentToast("Invalid login credentials, please try again.");
          }
        );
  }

  extractAuthHeadersFromLoginSuccessResponse(response) {
    const jwtAccessToken = response.headers.get("Authorization");
    let headers = new Headers({ 'Content-Type': 'application/json', 'Authorization': jwtAccessToken });
    this.globalVarsProvider.setAuthHeaders(headers);

  }

  retrieveUserProfileForLastLoginUpdate() {
    const retrieveUserProfileUrl = ENV.BASE_URL + '/user?email=' + this.email;
    this.http.get(retrieveUserProfileUrl,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(resp => {
        if (resp['status'] == 403) {
          this.presentToast("Your session has expired. Please log in again.");
          return;
        }
        else if (resp['status'] == 400 || resp['status'] == 404 || resp['status'] == 422) {
          this.presentToast("Error loading User Profile data.");
          return;
        }
        else if (resp['status'] == 200) {
          let jsonResponseObj = JSON.parse((resp['_body']));
          let userProfileData = jsonResponseObj['userProfiles'][0];

          //Store the retrieved user profile object in global vars
          this.globalVarsProvider.setUserProfileObj(userProfileData);

          //Check if the lastLogin field needs to be updated
          if (userProfileData['lastLogin'] != this.getCurrentDateInValidFormat()) {
            this.updateLastLoginTimestampForUserProfile(userProfileData);
          }
          this.navCtrl.push(TabsPage);
        }
      }, error => console.log(error)
      );
  }

  updateLastLoginTimestampForUserProfile(userProfileObj) {

    const updateLastLoginUrlString = ENV.BASE_URL +
      "/user/" + userProfileObj['id'] + "?lastLogin=" + this.getCurrentDateInValidFormat();
    this.http.put(updateLastLoginUrlString, userProfileObj,
      { headers: this.globalVarsProvider.getAuthHeaders() })
      .subscribe(resp => {
      }, error => console.log(error));
  }

  presentToast(msgToDisplay) {
    let toast = this.toastCtrl.create({
      message: msgToDisplay,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  getCurrentDateInValidFormat() {
    const today = new Date();
    //Months are 0 indexed so increment month by 1
    const monthVal = today.getMonth() + 1;
    const monthString = monthVal < 10 ? "0" + monthVal : monthVal;
    const dayString = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    return today.getFullYear() + "-" + monthString + "-" + dayString;
  }
}
