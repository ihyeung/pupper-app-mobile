import { Component, EventEmitter } from '@angular/core';
import { NavController, AlertController, IonicPage } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { MatchingResult } from '../../models/matching-result';
import { MatchProfiles, Utilities, Matches } from '../../providers';
import { environment as ENV } from '../../environments/environment';
import { DEFAULT_IMG } from '../';

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

  matchProfileObj: any = [];
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
    public navCtrl: NavController,
    public matchProfService: MatchProfiles, public utilService: Utilities,
    public matchesService: Matches) {

    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad MatchProfilePage');

      this.matchingResults = new Array<MatchingResult>();
      this.utilService.getMatchProfileFromStorage().then(val => {
        if (!val) {
          console.log('Please create a matching profile to begin matching.');
          this.navCtrl.push('CreateMatchProfilePage');
        } else {
          this.matchProfileObj = val;

          this.retrieveNextProfileBatch();
        }
      });
    }

    retrieveNextProfileBatch() {
      //Check to make sure a matching profile has been created to start matching
      const matchProfileId = this.matchProfileObj['id'];
      this.matchesService.getNextBatch(matchProfileId)
      .map(res => res.json())
      .subscribe(resp => {
        this.addToDeck(resp);
      }, err => console.error('ERROR', err));
    }

    addToDeck(nextBatch: any) {

      nextBatch.forEach(profile => {
        console.log(profile);
        let imageStr = profile['profileImage'];
        if (!imageStr || !imageStr.startsWith('https://') || !imageStr.startsWith('http://')) {
          imageStr = DEFAULT_IMG;
        }
        console.log(imageStr);
        this.deckOfCards.push({
          id: profile['profileId'],
          name:profile['name'],
          likeEvent: new EventEmitter(),
          destroyEvent: new EventEmitter(),
          // image: this.sanitizer.bypassSecurityTrustStyle('url(' + imageStr + ')'),
          image: imageStr,
          info: profile['aboutMe'],
          isMatch: profile['isMatch'],
          userId: profile['userId']
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
        if (profile['isMatch']) {
          console.log('active user was preivously liked by this profile, mutual match');
          this.onMutualMatch(profile['id'], profile['userId']);
        }
      } else {
        console.log("NOT A LIKE");
        this.matchingResults.push(new MatchingResult({id: profile['id'], isMatch: false}));

      }

      if (this.deckOfCards.length == 1) { //Retrieve next batch when 5 cards remain
        console.log('deck of cards has one card remaining');
        this.nextBatchReady = false;
        this.retrieveNextProfileBatch();
      }
    }

    submitMatchingResults() {

    }

    onMutualMatch(profileId: number, userId: number) {
      let matchDialog = this.alertCtrl.create({
        title: 'It\'s a match!',
        message: 'Would you like to send this pup a message?',
        buttons: [
          {
            text: 'Keep Matching',
            handler: () => {
              console.log('Continue Clicked');
            }
          },
          {
            text: 'Send A Message',
            handler: () => {
              console.log('Lets Chat Clicked');
              this.matchProfService.getMatchProfileById(profileId, userId)
              .map(res => res.json())
              .subscribe(resp => {
                if (resp['matchProfiles']) {
                  this.navCtrl.push('ChatPage', {
                    newMatch: true,
                    matchProfileReceiver: resp['matchProfiles'][0]
                  });
                }

              }, err => console.error('ERROR', err));

            }
          }
        ]
      });
      matchDialog.present();
    }
  }
