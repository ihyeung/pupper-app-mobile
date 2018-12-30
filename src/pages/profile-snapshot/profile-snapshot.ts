import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ModalController, ViewController } from 'ionic-angular';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { UsersProvider } from '../../providers/http/userProfiles';
import { UtilityProvider } from '../../providers/utility/utilities';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile-snapshot',
  templateUrl: 'profile-snapshot.html',
})
export class ProfileSnapshotPage {

  constructor(public navCtrl: NavController, public globalVars: GlobalVarsProvider,
    public utilService: UtilityProvider, public matchProfService: MatchProfilesProvider,
    public userService: UsersProvider, private modalCtrl: ModalController) {
      this.retrieveMatchProfilesForUser();
    }

    retrieveMatchProfilesForUser(){
      this.utilService.getUserFromStorage().then(user => {
        this.matchProfService.getMatchProfiles(user)
        .subscribe(resp => {
          if (resp['status'] == 200) {
            let jsonResponseObj = JSON.parse((resp['_body']));
            //Check to see whether user has previously created match profiles
            if (null != jsonResponseObj['matchProfiles']) {
              let matchProfileObj = jsonResponseObj['matchProfiles'][0];
              //Store the match profile object for the currently logged in user
              // this.globalVars.setMatchProfileObj(matchProfileObj);
              console.log(matchProfileObj);
              this.utilService.storeMatchProfile(matchProfileObj);
            } else {
              this.utilService.presentDismissableToast("Please create a matching profile to get started.");
              this.navCtrl.push('CreateMatchProfilePage');
            }
          }
        }, error => console.log(error));
      });
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfileSnapshotPage');
    }

    viewMatchProfileModal() {
      let matchProfileModal = this.modalCtrl.create(Profile, { profileType: "match" });
      matchProfileModal.present();
    }

    viewUserProfileModal() {
      let userProfileModal = this.modalCtrl.create(Profile, { profileType: "user" });
      userProfileModal.present();
    }

  }

  @Component({
    templateUrl: 'profile-modal.html',
  })
  export class Profile {
    profile: any = [];
    userProfileLabel: any = ['Name', 'Sex', 'Location', 'Birthdate', 'Marital Status', 'Image'];
    matchProfileLabel: any = ['Name', 'Sex', 'Breed', 'Life Stage', 'Size', 'Birthdate', 'Energy Level', 'About', 'Image'];

    constructor(public viewCtrl: ViewController, public navParams: NavParams,
      public storage: Storage) {
        const type = navParams.get('profileType');
        if (type === undefined) {
          console.log('error: profileType is undefined');
        } else {
          this.storage.get(type).then(val => {
            console.log(val['id']);
            console.log(val['profileImage']);
            // if (type == 'user') {
            this.profile.push({
              name: val['names'],
              sex: val['sex'],
              size: val['size'],
              breed: val['breed']['name'],
              energyLevel: val['energyLevel'],
              aboutMe: val['aboutMe'],
              birthdate: val['birthdate'],
              lifeStage: val['lifeStage'],
              profileImage: val['profileImage'] == null ? 'assets/img/appLogo.png': val['profileImage']
            });
          });
        }
      }

      dismiss() {
        this.viewCtrl.dismiss();
      }
    }
