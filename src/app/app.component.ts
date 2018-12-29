import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = 'HomePage';

    constructor(public platform: Platform, public splashScreen: SplashScreen,
      private statusBar: StatusBar) {
      console.log('app component constructor');
      // this.splashScreen.show();

    platform.ready().then(() => {
      this.statusBar.styleDefault();

      console.log('platform ready ');

      this.splashScreen.hide();

    });
  }
}
