import { Component } from '@angular/core';
import { user } from 'src/app/interfaces/user';
import { NavController } from '@ionic/angular';

import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  usr = new user();
  showInputs: boolean = false;
  showProgress: boolean = false;
  confirmPassword: string;
  listOfCompanies = [];
  listOfStores = [];
  storeDisabled: boolean = true;

  constructor(private navCtrl: NavController,
    private ASController: ActionSheetController,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    public alertController: AlertController) {
    this.usr.Picture_url = "assets/EngagedCircle.png";
    this.db.collection('Company').snapshotChanges().subscribe((data: any) => {
      for (var i in data) {
        let id = data[i].payload.doc._document.proto.name.split('/');
        this.listOfCompanies.push({
          Name: data[i].payload.doc._document.proto.fields.Name.stringValue,
          User_ID: data[i].payload.doc._document.proto.fields.User_ID.stringValue,
          ID: id[id.length - 1]
        });
      }
    });
  }

  changeOption(target) {
    this.listOfStores = [];
    this.db.collection('Store', ref => ref.where('Company_ID', '==', target)).snapshotChanges().subscribe((data: any) => {
      this.storeDisabled = false;
      for (var i in data) {
        let id = data[i].payload.doc._document.proto.name.split('/');
        this.listOfStores.push({
          Name: data[i].payload.doc._document.proto.fields.Name.stringValue,
          Company_ID: data[i].payload.doc._document.proto.fields.Company_ID.stringValue,
          ID: id[id.length - 1]
        });
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success',
      subHeader: '',
      message: 'User created correctly.',
      buttons: ['OK']
    });

    await alert.present();
  }

  redirect(val) {
    if (val == "show") {
      this.showInputs = true;
    }
    else if (val == 'cancel') {
      //this.showInputs = false;
      this.navCtrl.navigateBack('session');
    }
  }

  store_data(uid) {
    let pic = this.usr.Picture_url.substring(this.usr.Picture_url.indexOf(',') + 1, this.usr.Picture_url.length);
    var x = this;
    const fileRef = this.storage.ref('images/profile_picture_' + uid).putString(pic, 'base64').then(function (snapshot) {
      if (snapshot.state == "success") {
        x.storage.ref(snapshot.metadata.fullPath).getDownloadURL().subscribe(url => {
          x.db.collection('Users').doc(uid).set({
            Department: "",
            Lastname: x.usr.LastName,
            Name: x.usr.Name,
            Points: 0,
            Rol: 2,
            Picture_url: url,
            Grand_Prize: "No selected",
            Company_ID: x.usr.Company_ID,
            Category_Selected: "No selected",
            Store_ID: x.usr.Store_ID
          }).then(w => {
            x.showProgress = false;
            x.presentAlert();
            x.navCtrl.navigateBack('session');
          });
        });
      }
    });
  }

  create_account() {
    let validate = this.validateFields();
    //let validate = "";
    if (validate == "") {
      this.showProgress = true;
      this.afAuth.auth.createUserWithEmailAndPassword(this.usr.email, this.usr.password).then(value => {
        this.store_data(value.user.uid);
      }).catch(err => {
        console.log(err.message);
      });
    }
    else
      alert(validate);
  }

  validateFields() {
    let res = "";
    if (this.usr.Name == '' || this.usr.Name == undefined)
      res += 'First name required.\n';
    if (this.usr.LastName == '' || this.usr.LastName == undefined) {
      res += 'Last name required.\n';
    }
    if (this.usr.Picture_url == '' || this.usr.Picture_url == 'assets/EngagedCircle.png') {
      res += 'Picture required.\n';
    }
    if (this.usr.email == '' || this.usr.email == undefined) {
      res += 'email required.\n'
    }
    if (this.usr.password == '' || this.usr.password == undefined) {
      res += 'Password required.\n';
    }
    else if (this.usr.password.length < 6) {
      res += 'Password has to be 6 characters at least.\n';
    }
    if (this.confirmPassword == '' || this.confirmPassword == undefined) {
      res += 'Password required.\n';
    }
    else if (this.confirmPassword.length < 6) {
      res += 'Password has to be 6 characters at least.\n';
    }
    if (this.usr.password != this.confirmPassword) {
      res += 'The passwords are not equal';
    }
    if (this.usr.Company_ID == '' || this.usr.Company_ID == undefined) {
      res += 'You need to select a company.\n';
    }
    if (this.usr.Store_ID == '' || this.usr.Store_ID == undefined)
      res += 'You need to select a store';

    return res;
  }

  async Show_Action_Sheet() {
    const actionSheet = await this.ASController.create({
      header: 'Profile picture',
      buttons: [{
        text: 'Select a picture',
        icon: 'image',
        handler: () => {
          let options: ImagePickerOptions = {
            quality: 100,
            outputType: 1,
            maximumImagesCount: 1
          }
          this.imagePicker.getPictures(options).then((results) => {
            for (var i = 0; i < results.length; i++) {
              this.usr.Picture_url = 'data:image/jpeg;base64,' + results[i];
            }
          }, (err) => {
            console.log("ERROR", JSON.stringify(err));
          });
        }
      }, {
        text: 'Use camera',
        icon: 'camera',
        handler: () => {
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
          }
          this.camera.getPicture(options).then((imageData) => {
            this.usr.Picture_url = 'data:image/jpeg;base64,' + imageData;
          }, (err) => {
            console.log('error' + JSON.stringify(err));
          });
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel'
      }]
    });
    await actionSheet.present();
  }

}
