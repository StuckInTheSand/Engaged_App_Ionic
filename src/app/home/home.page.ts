import { Component } from '@angular/core';
import { Platform, MenuController, Events } from '@ionic/angular';
import { componentFactoryName } from '@angular/compiler';
import { user } from '../interfaces/user';

import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage{ 

  points: number = 0;
  time: number = 0;
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  btn_text: string = "Start";
  interval;
  usr = new user();
  today: any;
  dateToday: string;
  resources = [{ src: "assets/amazon_30_card.png" },{ src: "assets/gift_card.png" },{ src: "assets/airpods.png" },{ src: "assets/tickets.png" },{ src: "assets/camera.png" },{ src: "assets/money.png" },{ src: "assets/burger.png" },{ src: "assets/candies.png" },{ src: "assets/dave&busters.png" },{ src: "assets/ice_cream.png" },{ src: "assets/amazon_25_card.png" },{ src: "assets/cap.png" },{ src: "assets/vans.png" },{ src: "assets/king_card.png" },{ src: "assets/pizza2.png" },{ src: "assets/pizza.png" },{ src: "assets/time_off.png" },{ src: "assets/blue_beats.png" },{ src: "assets/ps4.png" },{ src: "assets/xbox.png" }, { src: "assets/concert_tickets.png" }, { src: "assets/rayban.png" }, { src: "assets/starbucks_pack.png" }, { src: "assets/gold_stone.png" }];
  weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  constructor(platform: Platform,
    private menu: MenuController,
    private storage: Storage,
    private navCtrl: NavController,
    public events: Events,
    public afAuth: AngularFireAuth,
    private db: AngularFirestore) {
    var weekday = new Array(7);

    this.menu.enable(true, 'menu');
    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.today = new Date();
        this.dateToday = this.today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' });
        this.usr = val;
        this.events.publish('emitUserData', this.usr);

        this.db.collection('Daily_Statistics').doc(this.usr.ID + '_' + ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear()).ref.onSnapshot(value => {
          if (!value.exists) {
            this.db.collection('Daily_Statistics').doc(this.usr.ID + '_' + ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear()).set({
              Date: ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear(),
              Time_Engaged: 0,
              User_ID: this.usr.ID.toString(),
              Points_Today: 0
            });
          }
        });

        this.db.collection('Daily_Statistics', ref => ref.where('User_ID', '==', this.usr.ID).where('Date', '==', ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear())).valueChanges().subscribe((data: any) => {
          this.time = data[0].Time_Engaged;
          this.hours = Math.floor(this.time / 3600);
          this.minutes = Math.floor((this.time - (this.hours * 3600)) / 60);
          this.seconds = (this.time - (this.hours * 3600)) - (this.minutes * 60);
          this.points = data[0].Points_Today;
        });
      }
      else {
        this.navCtrl.navigateBack('session');
      }
    });

    platform.ready().then((e) => {
      platform.pause.subscribe(() => {
        if (this.btn_text == "Stop") {
          this.iniciar();
        }
        //alert('[INFO] App paused');
        //alert(e);
      });

      platform.resume.subscribe(() => {
        console.log('[INFO] App resumed');
        //alert('epale');
      });
    });
  }

  iniciar() {
    //var x = this;
    if (this.btn_text == "Start") {
      this.interval = setInterval(() => {
        this.afAuth.authState
        this.time++;
        var dat = 0;
        if (this.time >= (7200 * (this.points + 1))) {
          this.db.collection('Daily_Statistics').doc(this.usr.ID + '_' + ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear()).update({
            Time_Engaged: this.time,
            Points_Today: Math.trunc((this.time / 7200))
          });
          this.usr.points++;
          this.db.collection('Users').doc(this.usr.ID).update({
            Points: this.usr.points
          });
          this.storage.remove('user_data').then(val => {
            this.storage.set('user_data', this.usr);
          });
        }
        else {
          this.db.collection('Daily_Statistics').doc(this.usr.ID + '_' + ((this.today.getMonth() < 9) ? '0' + (parseInt(this.today.getMonth()) + 1) : (parseInt(this.today.getMonth()) + 1)) + '-' + this.today.getDate() + '-' + this.today.getFullYear()).update({
            Time_Engaged: this.time
          });
        }
        this.hours = Math.floor(this.time / 3600);
        this.minutes = Math.floor((this.time - (this.hours * 3600)) / 60);
        this.seconds = (this.time - (this.hours * 3600)) - (this.minutes * 60);
      }, 1000);
      this.btn_text = "Stop"
    }
    else {
      clearInterval(this.interval);
      this.btn_text = "Start"
    }
  }

}
