import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
//import { AuthService } from '../../providers/auth-service/auth-service';

import { AuthProvider } from '../../providers/auth/auth';
import { FirebaseDbProvider } from '../../providers/firebase-db/firebase-db';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  createSuccess = false;
  registerCredentials = { email: '', password: '', team: '' }; //registerCredentials
  teams;

  constructor(private nav: NavController, private auth: AuthProvider, private db:FirebaseDbProvider, private alertCtrl: AlertController) { 
    this.teams = [];
    this.db.getTeams().subscribe(equipos=>{
      for(var i = 0; i < equipos.length; i++){
        this.teams.push(equipos[i].nombre);
      }
    });
  }
 
  public register() {
    this.auth.registerUser(this.registerCredentials)
    .then((user) => {
    	this.showPopup("Success", "Account created.");
    })
    .catch(err=>{
    	this.showPopup("Error", "Problem creating account.");
    });
  }

  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }
}