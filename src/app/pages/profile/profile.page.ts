import { Component, ɵConsole } from '@angular/core';

import { Storage } from '@ionic/storage';
import { user } from 'src/app/interfaces/user';
import { Events } from '@ionic/angular';

import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { _document } from '@angular/platform-browser/src/browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  usr = new user();
  updated: boolean = false;
  company: any = {};

  constructor(private storage: Storage,
    public events: Events,
    private camera: Camera,
    private ASController: ActionSheetController,
    private imagePicker: ImagePicker,
    private storageFire: AngularFireStorage,
    private db: AngularFirestore, ) {
    this.storage.get('user_data').then((val) => {
      if (val != null) {
        this.usr = val;

        this.db.doc('Company/' + this.usr.Company_ID).get().subscribe((company: any) => {
          this.company.Name = company._document.proto.fields.Name.stringValue;
          this.company.user_ID = company._document.proto.fields.User_ID.stringValue;
        });

      }
    });
  }

  async Change_picture() {
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
              this.updated = true;
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
            this.updated = true;
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

  Update_picture() {
    let pic = this.usr.Picture_url.substring(this.usr.Picture_url.indexOf(',') + 1, this.usr.Picture_url.length);
    var x = this;
    this.storageFire.ref('images/profile_picture_' + this.usr.ID).putString(pic, 'base64').then(function (snapshot) {
      if (snapshot.state == "success") {
        x.storageFire.ref(snapshot.metadata.fullPath).getDownloadURL().subscribe(url => {
          x.db.collection('Users').doc(x.usr.ID).update({
            Picture_url: url
          }).then(w => {
            alert('Image upload Successful');
          });
        });

      }
    });
  }

}
