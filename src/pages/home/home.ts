import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
//SUBSCRIPTION, OBSERVABLE, MAP
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
//SweetAlert
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
//SERVICIO
import { AuthProvider } from '../../providers/auth/auth';
import { GamePage } from '../game/game';


@IonicPage({
  name: "home"
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //SWEET ALERT
  public swal: SweetAlert = _swal as any;  

  constructor(
    public authS: AuthProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController

  ) {

    let cont: number = 0;
    let intervaloHome  = setInterval(()=>{
      cont++;
      if(this.authS.sesionActiva == true){
        this.navCtrl.push("game")
        clearInterval( intervaloHome );
      }else{
        if( cont > 30){
          clearInterval( intervaloHome );
        }
      }
      // console.log("CONTADOR", cont);
      
    }, 50);
    
  }

}
