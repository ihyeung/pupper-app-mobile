import { Component, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { CreateMatchProfilePage } from '../createMatchProfile/createMatchProfile';
import { environment as ENV } from '../../environments/environment';

@Component({
  selector: 'page-matching',
  templateUrl: 'matching.html'
})
export class MatchingPage {
  aboutMe: string;
  ageWithUnits: string;
  breedName: string;
  distance: string;
  lastActive: string;
  location: string;
  name: string;
  profileId: any;
  profileImage: string
  sex: string;
  matchProfileObj: any;
  profileCard: any;
  remainingProfiles: any;
  userGeneratedMatchResults: any;


  ready = false;
  attendants = [];
  cardDirection = "xy";
  cardOverlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };


  constructor(private sanitizer: DomSanitizer, public navParams: NavParams, public alertCtrl: AlertController,
    public navCtrl: NavController, public globalVarsProvider: GlobalVarsProvider) {
      console.log('Constructor for matching page');

      this.retrieveNextProfileBatch();
      this.grabCards();
    }

    retrieveNextProfileBatch() {
      //Check to make sure a matching profile has been created to start matching
      if (null == this.globalVarsProvider.getMatchProfileObj()) {
        console.log('Please create a matching profile to begin matching.');
        this.navCtrl.push(CreateMatchProfilePage);
      } else {
        const matchProfileId = this.globalVarsProvider.getMatchProfileObj()['id'];
        //TODO: Retrieve next batch from database
        this.remainingProfiles = 10;
      }
    }

    grabCards() {
      // let images = ["assets/imgs/indy.jpeg", "assets/imgs/jax.jpg", "assets/imgs/boston.jpeg", "assets/imgs/beagle.jpeg",
      // "assets/imgs/chihua.jpeg", "assets/imgs/collie.jpeg", "assets/imgs/doodle.jpeg", "assets/imgs/maltese.jpeg", "assets/imgs/sheltie.jpeg"]

      let pupInfo = [new Array("Indy", " Shiba Inu", " Female"), new Array("Jax", " Pomeranian", " Male"), new Array("Boston", " Shiba Inu", " Male")];

      let images = ["https://s3.us-east-1.amazonaws.com/pupper-mobile-app/user_1_bob_2018-12-03T03:02:36Z"];
      for (let i = 0; i < images.length; i++) {
        this.profileCard = pupInfo[0];
        this.attendants.push({
          id: i + 1,
          likeEvent: new EventEmitter(),
          destroyEvent: new EventEmitter(),
          asBg: this.sanitizer.bypassSecurityTrustStyle('url(' + images[i] + ')')
        });
      }
      this.ready = true;
    }

    onProfileMatchResult(event) {
      if (event.like) {
        console.log("LIKE");
        //TODO: 1. add result to matchResult map to update database
        //2. Check if mutual like
      } else {
        console.log("NOT A LIKE");
      }
      this.remainingProfiles--;

      if (this.remainingProfiles <= 5) { //Retrieve next batch when 5 cards remain
        this.retrieveNextProfileBatch();
      }
    }

    onProfileDestroy(event) {

    }

    onMutualMatch() {
      let alertConfirm = this.alertCtrl.create({
        title: 'It\'s a match!',
        message: 'Would you like to send this pup a message?',
        buttons: [
          {
            text: 'Continue',
            handler: () => {
              console.log('Continue Clicked');
            }
          },
          {
            text: 'Let\'s Chat!',
            handler: () => {
              console.log('Lets Chat Clicked');
              console.log("Match profile details from matching page " + this.matchProfileObj);
              this.navCtrl.push(MessagePage, { matchProfileDetails: this.matchProfileObj });
            }
          }
        ]
      });
      alertConfirm.present();
    }
  }
