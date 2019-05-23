import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFirestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular';

import { Storage } from '@ionic/storage';
import { user } from 'src/app/interfaces/user';

@Component({
  selector: 'app-reward-detailed',
  templateUrl: './reward-detailed.page.html',
  styleUrls: ['./reward-detailed.page.scss'],
})
export class RewardDetailedPage {

  data: any;
  currentItem: any = {};
  fav: boolean = false;
  usr = new user();

  constructor(private activRoute: ActivatedRoute, private db: AngularFirestore, private NavCtrl: NavController, private storage: Storage) {
    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.usr = val;
      }
    });

    this.data = this.activRoute.snapshot.paramMap.get('data');

    this.db.doc('Gifts/' + this.data).get().subscribe((user: any) => {
      this.currentItem.Name = user._document.proto.fields.Name.stringValue;
      this.currentItem.Description = user._document.proto.fields.Description.stringValue;
      this.currentItem.Pic_url = user._document.proto.fields.Pic_url.stringValue;
      this.currentItem.Price = parseInt(user._document.proto.fields.Price.integerValue);
      this.currentItem.Store_ID = user._document.proto.fields.Store_ID.stringValue;
      this.currentItem.stock = parseInt(user._document.proto.fields.stock.integerValue);
    });
  }

  favorites() {
    this.fav = !this.fav;
  }

  getProduct(itemValue) {
    let resp = "";
    if (itemValue <= this.usr.points)
      resp = 'success';
    else {
      resp = 'error';
      console.log('no te alcanza, necesitas ' + (itemValue - this.usr.points) + 'pts más');
    }
    this.NavCtrl.navigateForward(`message-page/${resp}/${itemValue}/${this.data}/${this.currentItem.stock}`);
  }


}
