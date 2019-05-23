import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-illustrations',
  templateUrl: './illustrations.page.html',
  styleUrls: ['./illustrations.page.scss'],
})
export class IllustrationsPage {

  constructor(private NavCtrl:NavController) { }

  redirect(){
    this.NavCtrl.navigateForward('home');
  }

}
