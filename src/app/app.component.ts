import { Component } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { NavController, Events } from '@ionic/angular';
import { user } from './interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  usr: user = new user();

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private navCtrl: NavController,
    private menu: MenuController,
    public events: Events,
    private router: Router
  ) {
    this.initializeApp();
    this.menu.enable(false, 'menu');
    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.menu.enable(true, 'menu');
        this.navCtrl.navigateForward('illustrations');
      }
    });
    this.events.subscribe('emitUserData', (user) => {
      this.usr = user;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  Log_Out() {
    this.storage.remove('user_data').then((message) => {
      this.menu.toggle('menu');
      this.menu.enable(false, 'menu');
      this.navCtrl.navigateBack('session');
    });
  }

  Redirect(option) {
    this.menu.toggle('menu');
    switch (option) {
      case "page3":
        //if (this.router.url != '/home')
          this.navCtrl.navigateForward('illustrations');
        break;
      case "rewards":
        this.navCtrl.navigateForward('rewards');
        break;
      case "profile":
        this.navCtrl.navigateForward('profile');
        break;
      case "statistics":
        this.navCtrl.navigateForward('statistics');
        break;
    }
  }

  hideSideBar() {
    this.menu.toggle('menu');
  }
}
