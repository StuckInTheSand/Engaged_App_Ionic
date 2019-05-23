import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class RewardsPage {

  rewards: any = [];

  constructor(private NavCtrl: NavController,
    private db: AngularFirestore) {
    this.getRewards();
  }

  getRewards() {
    var suscription=this.db.collection('Gifts').snapshotChanges().subscribe((collection: any) => {
      for (var i in collection) {
        this.rewards.push({
          Name:collection[i].payload.doc._document.proto.fields.Name.stringValue,
          Description:collection[i].payload.doc._document.proto.fields.Description.stringValue,
          Price:parseInt(collection[i].payload.doc._document.proto.fields.Price.integerValue),
          Pic_url:collection[i].payload.doc._document.proto.fields.Pic_url.stringValue,
          Store_ID:collection[i].payload.doc._document.proto.fields.Store_ID.stringValue,
          stock:parseInt(collection[i].payload.doc._document.proto.fields.stock.integerValue),
          ID:collection[i].payload.doc.id
        });
      }
      suscription.unsubscribe();
    });

  }

  details(data) {
    this.NavCtrl.navigateForward(`reward-detailed/${data}`);
  }
}
