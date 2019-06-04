import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, StorageUtilities, Users } from '../../providers';
import { DEFAULT_USER_IMG } from '../';

@IonicPage()
@Component({
  selector: 'page-user-profile-detail',
  templateUrl: 'user-profile-detail.html',
})
export class UserProfileDetailPage {

  profile: any;
  profileReady: boolean = false;
  readOnly: boolean = true;
  authHeaders: any;
  privateView: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public storageUtils: StorageUtilities, public utils: Utilities, public users: Users) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad UserProfileDetailPage');
      this.readOnly = this.navParams.get('readOnly');
      this.privateView = this.navParams.get('privateView'); //Show edit profile button and hide message user button if privateView

      this.storageUtils.getDataFromStorage('authHeaders').then(val => {
        if (val) {
          this.authHeaders = val;

          const id = this.navParams.get('userId');
          this.retrieveUserProfile(id);
        }
      });
    }

    retrieveUserProfile(userId: number) {
      if (userId) {
        this.users.getUserProfile(userId, this.authHeaders)
        .map(res => res.json())
        .subscribe(response => {
          console.log(response);
          if (response.isSuccess) {
            console.log('user profile found');
          this.profile = response['userProfiles'][0];
          console.log('proflie image: ' + this.profile.profileImage);
          this.profile.profileImage =
          this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_USER_IMG);
          this.profile.lastLogin = this.utils.getHistoricalAgeFromTimestamp(new Date(this.profile.lastLogin));

          this.profileReady = true;
        }

        }, err => console.error('ERROR: ', JSON.stringify(err)));
      } else {
        console.log('userId is undefined, defaulting to loading user from storage (i.e., the profile for the user logged in)');
        this.storageUtils.getDataFromStorage('user').then(val => {
          if (val) {
            this.profile = val;
            this.profile.profileImage =
                this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_USER_IMG);
            this.profile.lastLogin = this.utils.getHistoricalAgeFromTimestamp(new Date(val.lastLogin));
            this.profileReady = true;
          }
        });
      }
    }

    editProfile() {
      const profileData = {
        imagePreview: this.profile.profileImage,
        formData: this.profile,
        isUpdate: true
      };
      this.navCtrl.push('CreateUserProfilePage', profileData);
    }

    messageUser() {
      this.navCtrl.push('UserChatPage', {
        toUser: this.profile
      });
    }
  }
