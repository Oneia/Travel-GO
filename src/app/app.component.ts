import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform,
              private splashScreen: SplashScreen,
              private statusBar: StatusBar,
              private menu: MenuController) {
    //this.splashScreen.show();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
