import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = 'IntroPage';

    constructor(public platform: Platform, public splashScreen: SplashScreen,
    public statusBar: StatusBar) {
    platform.ready().then(() => {

      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
}
