import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//SERVICIO
import { GameProvider } from '../../providers/game/game';
import { AuthProvider } from '../../providers/auth/auth';
//SweetAlert
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
//RXJS
import { Subscription } from 'rxjs/Rx';
import { Observable } from  'rxjs/Observable';
//JQUERY
import * as $ from 'jquery';


@IonicPage({
  name: "game"
})
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  //SWEET ALERT
  public swal: SweetAlert = _swal as any;
  //MODOS DE JUEGO
  public modefacil: boolean;
  public modemedio: boolean;
  public modedificil: boolean;
  public modedemo: boolean;
  //DIFICULTAD
  public selectDificultad: boolean = true;
  //CARGANDO Y ANIMACIÓN
  public cargando: number = 0;
  // 0 --------> NO SE ACTIVA
  // 1 --------> INICIAR CARGANDO
  public animacionBanner: number = 0;
  // 0 --------> NO SE ACTIVA
  // 1 --------> INICIAR CARGANDO

  //INTENTAR DE NUEVO
  retryGame: Subscription;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public gameS: GameProvider,
    public auths: AuthProvider
  ) {
  }

  confirmarTrivia(dificultad: string){
    //VALIDACION SI NO TIENES LOS BITS NECESARIOS
    if (dificultad == 'facil' && this.auths.user.coins < 80){
      swal({
        title: "Error",
        text: "No tienes bits suficientes para este juego",
        icon: "error"
      })
    }
    if (dificultad == 'medio' && this.auths.user.coins < 500){
      swal({
        title: "Error",
        text: "No tienes bits suficientes para este juego",
        icon: "error"
      })
    }
    if (dificultad == 'dificil' && this.auths.user.coins < 1000){
      swal({
        title: "Error",
        text: "No tienes bits suficientes para este juego",
        icon: "error"
      })
    }
    //OPCIONES DE JUEGO
    if (dificultad == 'demo'){
      swal({
        title: "Confirmar",
        text: "MODE: " + "DEMO",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside : false
      })
      .then((willDelete) => {
        if (willDelete) {
          swal({
            title: "Mucha suerte!",
            icon: "success",
            buttons: "Comenzar",
            closeOnClickOutside : false
          })
          .then((value) => {

            this.cargando = 1;
            this.gameS.getTrivias(dificultad).subscribe();
            this.checarTrivia('demo').subscribe();

          });
          
        } else {
          //EL USUARIO CANCELO EL JUEGO
        }
      });
    }

    if (dificultad == 'facil' && this.auths.user.coins >= 80){
      swal({
        title: "Confirmar",
        text: "Dificultad: " + "Fácil (80 bits)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside : false 
      })
      .then((willDelete) => {
        if (willDelete) {
          swal({
            title: "Mucha suerte!",
            icon: "success",
            buttons: "Comenzar",
            closeOnClickOutside : false
          })
          .then((value) => {

            this.cargando = 1;
            this.gameS.updateBits('resta', 80)
            this.gameS.getTrivias(dificultad).subscribe();
            this.checarTrivia('facil').subscribe();

          });

        } else {
          //EL USUARIO CANCELO EL JUEGO
        }
      });

    }
    if (dificultad == 'medio' && this.auths.user.coins >= 500){
      swal({
        title: "Confirmar",
        text: "Dificultad: " + "Media (500 bits)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside : false
      })
      .then((willDelete) => {
        if (willDelete) {

          swal({
            title: "Mucha suerte!",
            icon: "success",
            buttons: "Comenzar",
            closeOnClickOutside : false
          })
          .then((value) => {

            this.cargando = 1;
            this.gameS.updateBits('resta', 500)
            this.gameS.getTrivias(dificultad).subscribe();
            this.checarTrivia('medio').subscribe();

          });
          
        } else {
          //EL USUARIO CANCELO EL JUEGO
        }
      });
      
    }
    if (dificultad == 'dificil' && this.auths.user.coins >= 1000){
      swal({
        title: "Confirmar",
        text: "Dificultad: " + "Dificíl (1000 bits)",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        closeOnClickOutside : false
      })
      .then((willDelete) => {
        if (willDelete) {
          swal({
            title: "Mucha suerte!",
            icon: "success",
            buttons: "Comenzar",
            closeOnClickOutside : false
          })
          .then((value) => {

            this.cargando = 1;
            this.gameS.updateBits('resta', 1000)
            this.gameS.getTrivias(dificultad).subscribe();
            this.checarTrivia('dificil').subscribe();

          });
          
        } else {
          //EL USUARIO CANCELO EL JUEGO
        }
      });
      
    }
  }

  //////////////////////////////////////// OBSERVABLES Y PROMESAS //////////////////////////////////////////
  checarTrivia(dificultad: string): Observable<any> {

    return new Observable( observer => {

    let contador = 0;

    let intervaloTrivia = setInterval( () => {

      contador += 1;

      if (this.gameS.trivias[0] != undefined){

        observer.next();

        //ANIMACION DE SALIDA
        this.animacionBanner = 1;
        //ACTIVA EL AUDIO
        let woosh:any = document.getElementById("woosh");
        woosh.play();
        
        setTimeout(() => {
           // INIZIO EL CONTADOR Y LAS ANIMACIONES
              if(dificultad == 'demo'){
                this.modedemo = true;
              }
              if(dificultad == 'facil'){
                this.modefacil = true;
              }
              if(dificultad == 'medio'){
                this.modemedio = true;
              }
              if(dificultad == 'dificil'){
                this.modedificil = true;
              }
              //IR AL INICIO DE LA PANTALLA
              $("html, body").animate({ scrollTop: 0 }, 500);
              this.selectDificultad = false;
              this.cargando = 0;
              setTimeout(() => {
                this.gameS.contador();
                this.checkRetry().subscribe();
              }, 500);
        }, 650);
       

        clearInterval( intervaloTrivia );
        observer.complete();
        
      }

    }, 1000 );

  })
}

checkRetry(): Observable<any> {

  return new Observable( observer => {

  let contador = 0;

  let intervaloRetry = setInterval( () => {

    contador += 1;

    if (this.gameS.reintentar){
      this.animacionBanner = 0;
      this.selectDificultad = true;
      this.modedemo = false;
      this.modefacil = false;
      this.modemedio = false;
      this.modedificil = false;
      observer.next();
      clearInterval( intervaloRetry );
      observer.complete();
      
    }

  }, 1000 );

})
}

  

}
