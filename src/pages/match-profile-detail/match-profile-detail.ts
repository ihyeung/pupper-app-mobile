import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, MatchProfiles, StorageUtilities } from '../../providers';
import { DEFAULT_IMG } from '../';


@IonicPage()
@Component({
  selector: 'page-match-profile-detail',
  templateUrl: 'match-profile-detail.html',
})
export class MatchProfileDetailPage {

  id: number;
  // profile: any;
  profileReady: boolean = false;
  readOnly: boolean = true;
  matchProfiles: any = []; //Routed from view match profiles button from profile snapshot page, modal will show list of match profiles with active match profile at the top
  matchPreferences: any = [];
  // isDefaultForActiveUser: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utils: Utilities, public matchProfileService: MatchProfiles,
    public storage: StorageUtilities) { }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MatchProfileDetailPage');
      this.init();
      //TODO: Display modal pane with match profiles you can swipe through
      //TODO: if matchProfiles nav param is passed, then there should also be a
      // matchProfile param representing the active/default match profile, this should be displayed
      // at the top of the list of profiles
    }

    init() {
      this.id = this.navParams.get('matchProfileId');//Only sent from matching page
      this.readOnly = this.navParams.get('readOnly');//Determines whether or not to display edit button
      this.matchProfiles = this.navParams.get('matchProfiles');//List passed from profile snapshot page, otherwise list containing single match profile element when coming from settings, matching, or inbox pages
      // const matchProfile = this.navParams.get('matchProfile'); //Passed from inbox page, if passed from profile snapshot page, represents first (ie active/default) match profile to display in list

      if (this.id) {
        this.retrieveProfileData();
      }
      if (this.matchProfiles) {
        console.log('User has ' + this.matchProfiles.length + ' match profiles');
        this.initProfileData();

      }
      // else if (matchProfile) {
      //   this.initProfileData(matchProfile);
      // }
      if (this.readOnly !== undefined && !this.readOnly) {
        console.log('not read only, retrieve match preference data');
        this.retrieveMatchPreferences();
      }

    }

    retrieveMatchPreferences() {
      console.log('retrieving match preferences detail for ' + this.id);
      this.matchProfileService.getMatchPreferences(this.id)
      .map(res => res.json())
      .subscribe(response => {
        if (response.isSuccess) {
          console.log('successfully retrieved match preferences');
          this.matchPreferences = response.matchPreferences;
        }
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    retrieveProfileData() {
      console.log('retrieving match profile detail for ' + this.id);
      this.matchProfileService.getMatchProfileByMatchProfileId(this.id)
      .map(res => res.json())
      .subscribe(response => { //Directly maps to matchProfile object
        console.log('successfully retrieved match profile by id');
        this.matchProfiles = response;
        this.initProfileData();
      }, err => console.error('ERROR: ', JSON.stringify(err)));
    }

    // initProfileData(profile: any) {
    initProfileData() {
      // this.profile = profile;
      // this.id = this.profile['id'];
      // this.profile['profileImage'] = this.utils.validateImageUri(this.profile['profileImage'], DEFAULT_IMG);
      // this.isDefaultForActiveUser = this.profile.isDefault;
      // this.profileReady = true;
      this.matchProfiles.forEach(each => {
        each['profileImage'] = this.utils.validateImageUri(each['profileImage'], DEFAULT_IMG);
        this.profileReady = true;
      });

    }

    editMatchProfile(matchProfile: any) {
      console.log("retrieving match profile for edit/update with id = " + matchProfile['id']);

      const profileData = {
        imagePreview: matchProfile['profileImage'],
        formData: matchProfile,
        isUpdate: true,
        matchPreferenceData: this.buildMatchPreferenceMap()
      };
      this.navCtrl.push('CreateMatchProfilePage', profileData);

    }

    viewUserProfile(matchProfile: any) {
      console.log(matchProfile);
      const userId = matchProfile['userProfile']['id'];
      console.log("retrieving user profile with id = " + userId);
      this.navCtrl.push('UserProfileDetailPage', {
        userId: userId,
        readOnly : true
      });
    }

    buildMatchPreferenceMap() {
      if (this.matchPreferences) {

        let sizes = [];
        let ages = [];
        let energies = [];

        this.matchPreferences.forEach(preference => {
          console.log(JSON.stringify(preference));
          switch(preference.preferenceType) {
            case('SIZE'):
            sizes.push(preference.matchingPreference);
            break;
            case('AGE'):
            ages.push(preference.matchingPreference);
            break;
            case('ENERGY'):
            energies.push(preference.matchingPreference);
          }
        });
        const mapper = new Map();
        mapper.set('SIZE', sizes);
        mapper.set('AGE', ages);
        mapper.set('ENERGY', energies);

        return mapper;
      }
    }

    updateActiveMatchProfile() {
      console.log('not implemented yet');
    }

  }
