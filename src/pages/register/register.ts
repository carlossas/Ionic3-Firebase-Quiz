import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//SERVICIO AUTHENTICATION
import { AuthProvider } from '../../providers/auth/auth';
//INTERFAZ DE USUARIO
import { User } from '../../interfaces/user';



@IonicPage({
  name: "registro"
})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authS: AuthProvider
  ) {
  }

  ionViewDidLoad() {
  }

}
