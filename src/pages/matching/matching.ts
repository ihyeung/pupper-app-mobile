import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalVarsProvider } from '../../providers/globalvars/globalvars';
import { MatchProfilesProvider } from '../../providers/http/matchProfiles';
import { environment as ENV } from '../../environments/environment';

@IonicPage()
@Component({
  selector: 'page-matching',
  templateUrl: 'matching.html'
})
export class MatchingPage {

  remainingProfiles: number;
  userGeneratedMatchResults: Map<number, boolean>;
  profileCardBatch: any = [];

  nextBatchReady: boolean = false;
  profiles = [];
  cardDirection = "xy";
  cardOverlay: any = {
    like: {
      backgroundColor: '#28e93b'
    },
    dislike: {
      backgroundColor: '#e92828'
    }
  };


  constructor(private sanitizer: DomSanitizer, public alertCtrl: AlertController,
    public navCtrl: NavController, public globalVarsProvider: GlobalVarsProvider,
  public matchProfService: MatchProfilesProvider) {
      console.log('Constructor for matching page');

      this.userGeneratedMatchResults = new Map();
      // this.profileBatch = this.retrieveNextProfileBatch();
      this.retrieveNextProfileBatch();
      this.addRetrievedProfileBatchIntoStack();
    }

    retrieveNextProfileBatch() {
      //Check to make sure a matching profile has been created to start matching
      if (null == this.globalVarsProvider.getMatchProfileObj()) {
        console.log('Please create a matching profile to begin matching.');
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        const matchProfileId = this.globalVarsProvider.getMatchProfileObj()['id'];
        //TODO: Retrieve next batch from database
        this.remainingProfiles = 5;
      }
    }

    // addRetrievedProfileBatchIntoStack(profileBatchObj) {
    addRetrievedProfileBatchIntoStack() {
      // let images = ["assets/img/indy.jpeg", "assets/img/jax.jpg", "assets/img/boston.jpeg", "assets/img/beagle.jpeg",
      // "assets/img/chihua.jpeg", "assets/img/collie.jpeg", "assets/img/doodle.jpeg", "assets/img/maltese.jpeg", "assets/img/sheltie.jpeg"]

      let images = ["https://s3.us-east-1.amazonaws.com/pupper-mobile-app/user_1_bob_2018-12-03T03:02:36Z"];

      // profileBatchObj.forEach( card => {
      //
      // });
      let pupInfo = [new Array("Indy", " Shiba Inu", " Female"), new Array("Jax", " Pomeranian", " Male"), new Array("Boston", " Shiba Inu", " Male")];

      for (let i = 0; i < images.length; i++) {
        this.profiles.push({
          id: i + 1,
          likeEvent: new EventEmitter(),
          destroyEvent: new EventEmitter(),
          image: this.sanitizer.bypassSecurityTrustStyle('url(' + images[i] + ')'),
          info: pupInfo[i]
        });
      }
      this.nextBatchReady = true;
    }

    onProfileMatchResult(event, profile) {

      const listIndex = this.profiles.indexOf(profile);
      console.log('profile card #' + listIndex + ' of stack has been liked/disliked by user');

      if (event.like) {
        console.log("LIKE");
        // const profileId = this.profileBatch
        // this.userGeneratedMatchResults['']
        //TODO: 1. add result to matchResult map to update database
        //2. Check if mutual like
        this.onMutualMatch();
      } else {
        console.log("NOT A LIKE");
      }
      this.remainingProfiles--;

      if (this.remainingProfiles <= 1) { //Retrieve next batch when 5 cards remain
        // this.profileBatch = this.retrieveNextProfileBatch();
        this.nextBatchReady = false;
        this.retrieveNextProfileBatch();
      }
    }

    onMutualMatch() {
      let matchDialog = this.alertCtrl.create({
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
            text: 'Send a message',
            handler: () => {
              console.log('Lets Chat Clicked');
              this.matchProfService.getMatchProfileById(1) //TODO: Figure out how to get the profileId for each card
              .subscribe(resp => {
                  const matchProfileObj = JSON.parse(resp['_body']);
                  this.navCtrl.push('MessagePage', {
                    newMatch: true,
                    matchProfileReceiver: matchProfileObj
                  });
              }, error => console.log(error));
            }
          }
        ]
      });
      matchDialog.present();
    }
  }
