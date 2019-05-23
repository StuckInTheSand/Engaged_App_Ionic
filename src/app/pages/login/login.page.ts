import { Component } from '@angular/core';
import { user } from 'src/app/interfaces/user';
import { NavController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  constructor(private navCtrl: NavController,
    public afAuth: AngularFireAuth,
    public alertController: AlertController,
    private db: AngularFirestore,
    private storage: Storage) { }

  usr = new user();

  cancel() {
    this.navCtrl.navigateBack('session');
  }

  Submit_Form() {
    this.afAuth.auth.signInWithEmailAndPassword(this.usr.email, this.usr.password).then(x => {
      //this.presentAlert('Log In successfull', '', 'You will be redirected');
      this.db.doc('Users/' + x.user.uid).get().subscribe((user: any) => {
        user = user._document.proto.fields;
        this.usr.Name = user.Name.stringValue;
        this.usr.LastName = user.Lastname.stringValue;
        this.usr.Department = user.Department.stringValue;
        this.usr.Picture_url = user.Picture_url.stringValue;
        this.usr.points = parseInt(user.Points.integerValue);
        this.usr.Rol = parseInt(user.Rol.integerValue);
        this.usr.Company_ID = user.Company_ID.stringValue;
        this.usr.Store_ID = user.Store_ID.stringValue;
        this.usr.Grand_Prize = user.Grand_Prize.stringValue;
        this.usr.ID = x.user.uid;
        this.usr.Categories_Selected = user.Category_Selected.stringValue;
        this.storage.set('user_data', this.usr).then(val => {
          this.navCtrl.navigateForward('illustrations');
        });
      });

    }).catch(w => {
      this.presentAlert('Error', '', w.message);
    });
  }

  async presentAlert(header, subheader, message) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subheader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}