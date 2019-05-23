import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-session',
  templateUrl: './session.page.html',
  styleUrls: ['./session.page.scss'],
})
export class SessionPage {

  constructor(private navCtrl: NavController) { }

  redirect(option) {
    if (option == "login")
      this.navCtrl.navigateForward('login');
    else
      this.navCtrl.navigateForward('signup');
  }

}
