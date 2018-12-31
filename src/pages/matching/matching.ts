import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MatchingResult } from '../../models/matching-result';
import { GlobalVars, MatchProfiles, Utilities, Matches } from '../../providers';
import { environment as ENV } from '../../environments/environment';

export interface Card {
  profileId: number;
  name: string;
  breedName: string;
  sex: string;
  energyLevel: string;
  lifeStage: string;
  lastActive: string;
  ageWithUnits: string;
  aboutMe: string;
  profileImage: string;
  distance: string;
  numDogs: number;
  isMatch: boolean;
}

@IonicPage()
@Component({
  selector: 'page-matching',
  templateUrl: 'matching.html'
})
export class MatchingPage {

  matchingResults: MatchingResult[];
  nextBatchReady: boolean = false;
  deckOfCards = [];
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
    public navCtrl: NavController, public globalVars: GlobalVars,
    public matchProfService: MatchProfiles, public utilService: Utilities,
  public matchesService: Matches) {

    }

  ionViewDidLoad() {
      console.log('ionViewDidLoad MatchProfilePage');

      this.matchingResults = new Array<MatchingResult>();
      this.retrieveNextProfileBatch();
    }

    retrieveNextProfileBatch() {
      console.log('retrieving next matcher data batch');
      //Check to make sure a matching profile has been created to start matching
      this.utilService.getMatchProfileFromStorage().then(val => {
        if (!val) {
        console.log('Please create a matching profile to begin matching.');
        this.navCtrl.push('CreateMatchProfilePage');
      } else {
        this.matchesService.getNextBatch(val['id']);
        // .subscribe(() => {

        // });
        //TODO: Retrieve next batch from database
      }
    });

    }

    // addRetrievedProfileBatchIntoStack(profileBatchObj) {
    addRetrievedProfileBatchIntoStack(nextBatch: any[]) {
      // let images = ["assets/img/indy.jpeg", "assets/img/jax.jpg", "assets/img/boston.jpeg", "assets/img/beagle.jpeg",
      // "assets/img/chihua.jpeg", "assets/img/collie.jpeg", "assets/img/doodle.jpeg", "assets/img/maltese.jpeg", "assets/img/sheltie.jpeg"]

      let images = ["https://s3.us-east-1.amazonaws.com/pupper-mobile-app/user_1_bob_2018-12-03T03:02:36Z"];

      // profileBatchObj.forEach( card => {
      //
      // });
      let pupInfo = [new Array("Indy", " Shiba Inu", " Female"), new Array("Jax", " Pomeranian", " Male"), new Array("Boston", " Shiba Inu", " Male")];

      // nextBatch.forEach(profile => {
      images.forEach(profile => {
        this.deckOfCards.push({
          id: profile['profileId'],
          name:profile['names'],
          // name: profile['name'],
          likeEvent: new EventEmitter(),
          destroyEvent: new EventEmitter(),
          image: this.sanitizer.bypassSecurityTrustStyle('url(' + profile['profileImage'] + ')'),
          info: profile['aboutMe']
          // likedByProfile: profile['isMatch']
        });
      });

      this.nextBatchReady = true;
    }

    onProfileMatchResult(event, profile) {

      const listIndex = this.deckOfCards.indexOf(profile);
      console.log('profile card #' + listIndex + ' of stack has been liked/disliked by user');

      if (event.like) {
        console.log("LIKE");
        this.matchingResults.push(new MatchingResult({id: profile['id'], isMatch: true}));
        if (profile['likedByProfile']) {
          console.log('active user was preivously liked by this profile, mutual match');
          this.onMutualMatch();
        }
      } else {
        console.log("NOT A LIKE");
        this.matchingResults.push(new MatchingResult({id: profile['id'], isMatch: false}));

      }

      if (this.deckOfCards.length == 1) { //Retrieve next batch when 5 cards remain
        // this.profileBatch = this.retrieveNextProfileBatch();
        console.log('deck of cards has one card remaining');
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
                this.navCtrl.push('ChatPage', {
                  newMatch: true,
                  matchProfileReceiver: matchProfileObj
                });
              }, err => console.error('ERROR', err));
            }
          }
        ]
      });
      matchDialog.present();
    }
  }
