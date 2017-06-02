import { Component }    from '@angular/core';
import { Platform }     from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar }    from '@ionic-native/status-bar';
import { TabsPage }     from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(private platform:     Platform,
              private splashScreen: SplashScreen,
              private statusBar:    StatusBar) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
