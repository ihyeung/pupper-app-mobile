import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Utilities, StorageUtilities, Users, MatchProfiles} from '../../providers';
import { DEFAULT_USER_IMG } from '../';
import {assert} from "ionic-angular/util/util";

@IonicPage()
@Component({
  selector: 'page-user-profile-detail',
  templateUrl: 'user-profile-detail.html',
})
export class UserProfileDetailPage {

  userProfile: any;
  profileReady: boolean = false;
  readOnly: boolean = true;
  authHeaders: any;
  privateView: boolean = false;
  activeUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storageUtils: StorageUtilities, public utils: Utilities, public users: Users,
              public matchProfService: MatchProfiles) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProfileDetailPage');
    this.readOnly = this.navParams.get('readOnly');
    this.privateView = this.navParams.get('privateView'); //Show edit profile button and hide message user button if privateView
    this.retrieveDataFromStorage();
  }

  retrieveDataFromStorage() {
    this.storageUtils.getDataFromStorage('authHeaders').then(val => {
      if (val) {
        this.authHeaders = val;

        const id = this.navParams.get('userId');
        this.retrieveUserProfile(id);
      }
    });
    //Retrieve the actively logged in user ie the user viewing this user's profile, required for reporting user
    this.storageUtils.getDataFromStorage('user').then(val => {
      if (val) {
        this.activeUser = val;
      } else {
        console.error('Error loading the active user profile data from storage');
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
            this.userProfile = response['userProfiles'][0];
            console.log('profile image: ' + this.userProfile.profileImage);
            this.userProfile.profileImage = this.utils.validateImageUri(this.userProfile['profileImage'], DEFAULT_USER_IMG);
            this.userProfile.lastLogin = this.utils.getHistoricalAgeFromTimestamp(new Date(this.userProfile.lastLogin));

            this.profileReady = true;

            if (this.activeUser && this.userProfile.id === this.activeUser.id) {
              console.log('the retrieved user profile id matches the active user profile id, meaning the logged in user is viewing their own userProfileDetail page');
              assert(this.privateView, 'private view should be true');
              assert(!this.readOnly, 'readOnly flag should be false');
            }
          }

        }, err => console.error('ERROR: ', JSON.stringify(err)));
    } else {
      console.error('userId is undefined caused by userId not passed in navParams, investigate issue');

    }
  }

  editProfile() {
    const profileData = {
      imagePreview: this.userProfile.profileImage,
      formData: this.userProfile,
      isUpdate: true
    };
    this.navCtrl.push('CreateUserProfilePage', profileData);
  }

  viewMatchProfiles() {
    this.matchProfService.getMatchProfilesByUserId(this.userProfile.id)
      .map(res => res.json())
      .subscribe(response => {
        if (response.isSuccess) {
          console.log('match profiles list successfully retrieved for userId');
          console.log(response.matchProfiles);
          this.navCtrl.push('MatchProfileDetailPage', {
            matchProfiles: response.matchProfiles,
            privateView: this.privateView
          });
        } else {
          console.error('error retrieving match profiles for user');
        }

      }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  reportUser() {
    console.log('reporting userId=' + this.userProfile.id + ', reporting of user request initiated by userId=' + this.activeUser.id);
    console.log('NOT IMPLEMENTED YET');
  }

  //TODO: Revisit this later
  messageUser() {
    this.navCtrl.push('UserChatPage', {
      toUser: this.userProfile,
      fromUser: this.activeUser
    });
  }
}
