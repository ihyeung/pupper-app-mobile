import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Utilities, MatchProfiles, StorageUtilities } from '../../providers';
import { DEFAULT_IMG } from '../';
import {MatchProfile} from "../../models/match-profile";


@IonicPage()
@Component({
  selector: 'page-match-profile-detail',
  templateUrl: 'match-profile-detail.html',
})
export class MatchProfileDetailPage {

  id: number;
  profilesReady: boolean = false;
  readOnly: boolean = true;
  matchProfilesList: any = []; //Routed from view match profiles button from profile snapshot page, modal will show list of match profiles with active match profile at the top
  matchPreferences: any = [];
  privateView: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public utils: Utilities, public matchProfileService: MatchProfiles,
              public storage: StorageUtilities) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchProfileDetailPage');
    this.init();
  }

  init() {
    this.id = this.navParams.get('matchProfileId');//Only sent from matching page
    this.readOnly = this.navParams.get('readOnly');//Determines whether or not to display edit button
    this.privateView = this.navParams.get('privateView'); //Nav param set when displaying detail page for own match profiles
    const matchProfiles = this.navParams.get('matchProfiles');//List passed from profile snapshot page, otherwise list containing single match profile element when coming from settings, matching, or inbox pages

    if (this.id) {
      this.retrieveProfileData();
    }
    if (matchProfiles) {
      this.matchProfilesList = matchProfiles;
      MatchProfileDetailPage.sortMatchProfileList(matchProfiles);

      this.initProfileData();
    }

    if (this.readOnly !== undefined && !this.readOnly) {
      console.log('not read only, retrieve match preference data');
      this.retrieveMatchPreferences();
    }

  }

  private static sortMatchProfileList(matchProfileList: any) {
    console.log('Sorting match profiles in list (so active match profile precedes any others');

    let sortedList = new Array<MatchProfile>();
    let remainingList = new Array<MatchProfile>();
    for (let profile of matchProfileList) {
      if (profile['isDefault']) {
        console.log('found active match profile in list, break out of for loop');
        sortedList.push(profile);
        break;
      } else {
        remainingList.push(profile);
      }
    }
    sortedList.concat(remainingList);

    return sortedList;
  }

  retrieveMatchPreferences() {
    console.log('retrieving match preferences detail for each match profile in list');
    this.matchProfilesList.forEach(each => {
      this.matchProfileService.getMatchPreferences(each['id'])
        .map(res => res.json())
        .subscribe(response => {
          if (response.isSuccess) {
            console.log('successfully retrieved match preferences for matchProfileId=' + each['id']);
            this.matchPreferences.push(response.matchPreferences);
          }
        }, err => console.error('ERROR: ', JSON.stringify(err)));
    });
  }

  retrieveProfileData() {
    console.log('retrieving match profile detail for ' + this.id);
    this.matchProfileService.getMatchProfileByMatchProfileId(this.id)
      .map(res => res.json())
      .subscribe(response => { //Directly maps to matchProfile object
        console.log('successfully retrieved match profile by id');
        this.matchProfilesList = response;
        this.initProfileData();
      }, err => console.error('ERROR: ', JSON.stringify(err)));
  }

  initProfileData() {
    this.matchProfilesList.forEach(each => {
      each['profileImage'] = this.utils.validateImageUri(each['profileImage'], DEFAULT_IMG);
    });
    this.profilesReady = true;
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

  viewUserProfile() {
    if (this.matchProfilesList != null && this.matchProfilesList.length > 0) {
      const userId = this.matchProfilesList[0]['userProfile']['id'];
      console.log("retrieving user profile with id = " + userId);
      this.navCtrl.push('UserProfileDetailPage', {
        userId: userId,
        readOnly: true,
        privateView: this.privateView
      });
    }
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
