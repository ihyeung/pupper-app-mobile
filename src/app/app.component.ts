import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class AppComponent {
  rootPage: any = HomePage;

    constructor(platform: Platform) {

    platform.ready().then(() => {
    });
  }
}
