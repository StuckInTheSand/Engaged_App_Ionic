import { Component, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

import { AngularFirestore } from '@angular/fire/firestore';
import { user } from 'src/app/interfaces/user';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage {

  @ViewChild('lineCanvas') lineCanvas;
  lineChart: any;
  dateToday: string;
  data: any;
  usr = new user();
  visible = false;

  constructor(private db: AngularFirestore, private storage: Storage) {
    let today = new Date();
    this.dateToday = today.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' });

    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.usr = val;
        this.GetData();
      }
    });
  }

  GetData() {

    var dat = this.db.collection('Daily_Statistics', ref => ref.where('User_ID', '==', this.usr.ID)).valueChanges().subscribe((data: any) => {
      this.data = data;
      let labels = [];
      let arr = [];
      if (data.length > 1) {
        this.visible = true;
        for (var i = 0; i < this.data.length; i++) {
          if (this.data[i].User_ID == this.usr.ID && i < 7) {
            labels.push(this.data[i].Date);
            arr.push(this.data[i].Time_Engaged / 60);
          }
        }
        this.makecart(labels, arr);
        dat.unsubscribe();
      }
    });
  }

  makecart(labels, data) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {

      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "",
            lineTension: 0.1,
            backgroundColor: "rgb(14, 70, 163,0.4)",
            borderColor: "rgb(14, 70, 163,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgb(14, 70, 163,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(14, 70, 163,1)",
            pointHoverBorderColor: "rgb(14, 70, 163,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: data
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Days'
            },
            gridLines: {
              display: false
            },
            ticks: {
              display: false
            }
          }], yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Minutes'
            },
            gridLines: {
              display: false
            }
          }]
        }
      }
    });
  }
}
