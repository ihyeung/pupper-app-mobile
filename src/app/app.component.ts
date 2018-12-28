import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
// import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = HomePage;

    constructor(platform: Platform) {

    platform.ready().then(() => {
      // this.splashscreen.hide();

    });
  }
}
