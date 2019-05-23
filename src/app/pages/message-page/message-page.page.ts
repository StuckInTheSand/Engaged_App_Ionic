import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { user } from 'src/app/interfaces/user';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-message-page',
  templateUrl: './message-page.page.html',
  styleUrls: ['./message-page.page.scss'],
})
export class MessagePagePage {

  option: string = 'error';
  itemPrice: number;
  usr = new user();
  ItemID: string;
  stock: number;

  constructor(private storage: Storage, private NavCtrl: NavController, private activRoute: ActivatedRoute, private db: AngularFirestore) {
    this.option = this.activRoute.snapshot.paramMap.get('status');
    this.itemPrice = parseFloat(this.activRoute.snapshot.paramMap.get('price'));
    this.ItemID = this.activRoute.snapshot.paramMap.get('item');
    this.stock = parseInt(this.activRoute.snapshot.paramMap.get('stock'));
    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.usr = val;
      }
    });
  }

  BuyItem() {
    if (this.stock > 0) {
      this.usr.points = this.usr.points - this.itemPrice;
      this.db.collection('Users').doc(this.usr.ID).update({
        Points: this.usr.points
      }).then(w => {
        let sto = this.stock - 1;
        this.db.collection('Gifts').doc(this.ItemID).update({
          stock: sto
        }).then(w => {
          this.db.collection('Orders').doc(this.db.createId()).set({
            Price_ID: this.ItemID,
            User_ID: this.usr.ID
          }).then(w => {
            alert('Successful Request');
            this.NavCtrl.navigateBack('rewards');
            this.storage.remove('user_data').then(x => {
              this.storage.set('user_data',this.usr);
            });
          });
        });
      });
    }
  }


}
