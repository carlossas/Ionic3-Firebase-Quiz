import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//FIREBASE
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
//JQUERY & BOOTSTRAP
import * as $ from 'jquery';
//SweetAlert
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
//INTERFAZ
import { User } from '../../interfaces/user';
//AUTH
import { AuthProvider } from '../auth/auth';
//RXJS
import { switchMap, map } from 'rxjs/operators';




@Injectable()
export class GameProvider {

  //SWEET ALERT
  public swal: SweetAlert = _swal as any;
  //DOCUMENTO DE USUARIO
  userDoc: AngularFirestoreDocument<User>;
  // COLECCION TRIVIAS
  public triviasCollection: AngularFirestoreCollection<any>;
  // DOCUMENTO TRIVIA DE TIPO INTERFAZ TRIVIA
  public triviaDoc: AngularFirestoreDocument<any>;
  // OBJETO TRIVIAS ALEATORIAS
  public triviaAleatoria: any [] = [];
  // OBJETO TRIVIAS DONDE RECIBO EL ARREGLO DE EQUIPOS PARA MOSTRAR TODOS
  public trivias: any [] = [];
  // POSICION DE LA TRIVIA
  public position: number = 0;
  // CONTADOR DE LAS TRIVIAS
  public contadorTrivia: number = 5;
  // CONTADOR DE LAS TRIVIAS
  public intervaloTrivia: any;
  // BOTON QUE DECIDE EL ORDENAMIENTO DE LA RESPUESTA
  public buttonRandom: number = 0;
  // BOTIN ACUMULADO PROXIMO A SUMAR
  public acumulado: number = 0;
  // BOTIN ACTUAL TOTAL
  public loot: number = 0;
  // MONTO 
  public monto: number = 0;
  //REINICIAR JUEGO
  public reintentar: boolean = false;

  constructor(
    public http: HttpClient,
    public afs: AngularFirestore,
    public auth: AuthProvider
  ) {
    //INICIALIZO LA COLLECCION DE TIRIVAS
    this.triviasCollection = this.afs.collection<any>('trivia')
  }

  getTrivias(dificultad: string){
    //ORDENAR LOS BOTONES RANDOM
    this.ordenarBotones(dificultad);
    //CALCULAR EL MONTO A JUGAR
    this.calcularMonto(dificultad);
    //QUITO LA VARIABLE DE REINTENTO
    this.reintentar = false;

    //CONSULTA TRIVIAS
    this.trivias = [];
    this.triviaAleatoria = [];

    if (dificultad != "demo"){
      return this.afs.collection<any>('trivia')
      .valueChanges().pipe(
        map( (resultado:any)=>{
       
  
      let total: number = resultado.length;

      for (let i = 0; i < total; i++) {
  
        let aleatorio = Math.floor(Math.random()*(resultado.length));
        var seleccion = resultado[aleatorio];
        resultado.splice(aleatorio, 1);
    
        if (i <= 4){
          this.triviaAleatoria.push(seleccion);
        }
  
      }
      
      this.trivias.push(this.triviaAleatoria[0])
      
      }));
  
    }else{
      return this.afs.collection<any>('trivia', ref => ref.where("dificultad", "==", "demo"))
      .valueChanges().pipe(
        map( (resultado:any)=>{
       
      let total: number = resultado.length;

      for (let i = 0; i < total; i++) {
  
        let aleatorio = Math.floor(Math.random()*(resultado.length));
        var seleccion = resultado[aleatorio];
        resultado.splice(aleatorio, 1);
    
        if (i <= 4){
          this.triviaAleatoria.push(seleccion);
        }
  
      }
      
      this.trivias.push(this.triviaAleatoria[0])
      
      }));
      
    }
    
  }

  calcularMonto(dificultad:string){
    if (dificultad == 'demo'){
      this.monto = 0;
    }
    if (dificultad == 'facil'){
      this.monto = 800;
    }
    if (dificultad == 'medio'){
      this.monto = 5000;
    }
    if (dificultad == 'dificil'){
      this.monto = 10000;
    }
  }

  updateBits(operacion:string, cantidad: number){
    let uid: string = this.auth.user.uid;
    let newCoins: number = 0;

    if(operacion == 'suma'){
      newCoins = this.auth.user.coins + cantidad;
      // console.log("NUEVOS BITS", newBits);
      this.userDoc = this.afs.doc(`users/${uid}`);
        this.userDoc.update({
          coins: newCoins,
      });
      
    }
    
    if(operacion == 'resta'){
      if(this.auth.user.coins >= cantidad){
        newCoins = this.auth.user.coins - cantidad;
        // console.log("NUEVOS BITS", newBits);
        this.userDoc = this.afs.doc(`users/${uid}`);
        this.userDoc.update({
          coins: newCoins,
        });
      }   
    }

  }

  nextTrivia(dificultad: string){
    if (this.position >= this.triviaAleatoria.length){
      
    }else{

      if (this.position == this.triviaAleatoria.length - 1){
        this.contadorTrivia = 0;
        this.position = 5;
        clearInterval(this.intervaloTrivia)
        //DINERO GANADO
        this.loot = this.loot + this.monto*0.375;
        this.acumulado = this.monto*0.375;
        //ACTUALIZAR BITS DEL USUARIO
        this.updateBits('suma', this.loot);

        //USUARIO GANO
        setTimeout(() => {

          //ANIMACIONES Y AUDIO DEL GANADOR
          $("html, body").animate({ scrollTop: 0 }, 500);
          $('#startConfetti').click();
          let aplausos:any = document.getElementById("aplausos");
          aplausos.play(); 
          swal({
            title: 'Congratulations!',
            text: 'WIN: ' + this.loot + ' BITS',
            icon: 'success',
            buttons: {
              retirarse: {
                text: "Go to my panel",
                value: "retirarse",
              },
              retry: {
                text: "Play again",
                value: "retry",
              }
            },
            closeOnClickOutside : false
          })
          .then((value) => {
            switch (value) {
           
              case "retry":
              this.confettiStop();
              this.retryGame();
                break;
              case "retirarse":
              this.retryGame();
              this.confettiStop();
              setTimeout(() => {
                // this.router.navigate(['/mipanel']);
              }, 300);
                break;
            }
          });
            }, 200);
        
      } else{
        //DETENGO EL TIMER
        clearInterval(this.intervaloTrivia)
        
          //SWITCH CASE DE LAS POSIBLES GANANCIAS DEL JUGADOR
            switch(this.position) {
              case 0:
              this.loot = this.acumulado + this.monto*0.05;
              this.acumulado = this.monto*0.05;
                  break;
              case 1:
              this.loot = this.loot + this.monto*0.125;
              this.acumulado = this.monto*0.125;
                  break;
              case 2:
              this.loot = this.loot + this.monto*0.20;
              this.acumulado = this.monto*0.20;
                  break;
              case 3:
              this.loot = this.loot + this.monto*0.25;
              this.acumulado = this.monto*0.25;
                  break;              
            }
          
          //IMPRIMO EL ACUMULABLE
          // console.log("SE ACUMULA +", this.acumulado);
          // console.log("LOOT", this.loot);

          //ACTIVA EL AUDIO
          let winning:any = document.getElementById("winning");
          winning.play();

          //PREGUNTA SI DESEA SEGUIR JUGANDO
          swal({
            title: 'Do you want to continue?',
            text: 'Loot: ' + this.loot,
            buttons: {
              retirarme: {
                text: "Fold",
                value: "Retirarme",
              },
              continuar: {
                text: "Next",
                value: "Continuar",
              }
            },
            closeOnClickOutside : false
          })
          .then((value) => {
            switch (value) {
           
              case "Continuar":
              this.ordenarBotones(dificultad);
              this.position ++;
              this.trivias = [];
              this.trivias.push(this.triviaAleatoria[this.position])
              this.contador();
                break;
           
              case "Retirarme":
              //AUDIO
              let coins:any = document.getElementById("coins");
              coins.play();

              this.updateBits('suma', this.loot)
              setTimeout(() => {
                this.retryGame()
              }, 1000);
                break;
            }
          });
      }
    }
    
  }

  contador(){
    this.contadorTrivia = 5;

    this.intervaloTrivia = setInterval( () => {

      this.contadorTrivia--;
        if(this.contadorTrivia == 0){
          
          setTimeout(() => {
            //AUDIO
            let error:any = document.getElementById("error");
            error.play();

            swal({
              title: "Upps!",
              text: "Time is over",
              icon: "error",
              button: true,
              closeOnClickOutside : false
            }).then((value) => {
              this.retryGame();
            });
            clearInterval(this.intervaloTrivia);
          }, 200);
        }
    }, 1000 );
  }

  ordenarBotones(dificultad){

    if(dificultad == 'demo'){

      let random = Math.floor(Math.random()*(1+1));
      // console.log("aleatorio", random);
      this.buttonRandom = random;

    }

    if(dificultad == 'facil'){

      let random = Math.floor(Math.random()*(1+1));
      // console.log("aleatorio", random);
      this.buttonRandom = random;

    }

    if(dificultad == 'medio'){

      let random = Math.floor(Math.random()*(2+1));
      // console.log("aleatorio", random);
      this.buttonRandom = random;
      
    }

    if(dificultad == 'dificil'){

      let random = Math.floor(Math.random()*(3+1));
      // console.log("aleatorio", random);
      this.buttonRandom = random;
      
    }

  }

  answerFail(){
    //DETENGO EL TIMER
    clearInterval(this.intervaloTrivia);
    //AUDIO
    let error:any = document.getElementById("error");
    error.play();
    swal({
      title: "Upps!",
      text: "Wrong answer",
      icon: "error",
      button: true,
      closeOnClickOutside : false
    }).then((value) => {
      this.retryGame();
    });

  }

  confettiStop(){
    $('#stopConfetti').click();
  }

  retryGame(){
      ////////////////////////REINICIO DE TODAS LAS VARIABLES//////////////////////////
    //VARIABLE DE REINTENTAR JUEGO
    this.reintentar = true;
    // OBJETO TRIVIAS ALEATORIAS
    this.triviaAleatoria = [];
    // OBJETO TRIVIAS DONDE RECIBO EL ARREGLO DE EQUIPOS PARA MOSTRAR TODOS
    this.trivias = [];
    // POSICION DE LA TRIVIA
    this.position = 0;
    // CONTADOR DE LAS TRIVIAS
    this.contadorTrivia = 5;
    // BOTON QUE DECIDE EL ORDENAMIENTO DE LA RESPUESTA
    this.buttonRandom = 0;
    // BOTIN ACUMULADO PROXIMO A SUMAR
    this.acumulado = 0;
    // BOTIN ACTUAL TOTAL
    this.loot = 0;
    // MONTO 
    this.monto = 0;
  }

}
