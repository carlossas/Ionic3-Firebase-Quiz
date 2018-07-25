import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//FIREBASE
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators/switchMap';
import { of } from 'rxjs';
//SweetAlert
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
//INTERFAZ DE USUARIO
import { User } from '../../interfaces/user';
//NAV
import { NavController } from 'ionic-angular';
import { App } from "ionic-angular";

@Injectable()
export class AuthProvider {
  //NAV
  private navCtrl: NavController;
  //SWEET ALERT
  public swal: SweetAlert = _swal as any;
  // COLECCION DE USUARIOS
  private usersCollection: AngularFirestoreCollection<User>;
  // DETECTALA SESION ACTIVA
  public sesionActiva: boolean;
  // USUARIO FUNCTION
  public userMap: Observable<User>;
  //USUARIO LOGEADO
  public user: User;

  constructor(
      public http: HttpClient,
      public afs: AngularFirestore,
      public afauth: AngularFireAuth,  
      private app: App 
  ) {
    //NAV
    this.navCtrl = app.getActiveNav();
    //DETECTA SI LA SESION ESTA ACTIVA
    this.detectSesion();
    //FUNCTION AUTH
    this.authFunction();
    //USER HEREDA LOS DATOS DEL USUARIO AUTENTIFICADO
    this.userMap.subscribe(doc=>{
      if(doc != null){
      this.user = doc;
      console.log(this.user);
      
      }
    }); 
  }

  detectSesion(){
    this.afauth.auth.onAuthStateChanged( sesion =>{
      // console.log(sesion);
      if (sesion != null){
        this.sesionActiva = true;        
      }else{
        this.sesionActiva = false;
      }
      console.log(this.sesionActiva);
      
    });
  }

  authFunction(){
    this.userMap = this.afauth.authState.pipe(
      switchMap(user => {
        if  ( user ) {
              this.afs.doc<User>("users/" + user.uid).ref.get().then(x=>{
                let user = x.data() as User;
              })
              return this.afs.doc<User>("users/"+ user.uid).valueChanges();
            } else {
              return of(null);
            }
      })
    )
  }

  emailSignUp(email:string, pass:string, username: string) {
     username = username.trim();   
     username = username.toLowerCase();
     if(username !== undefined && username !== ''){
     this.afauth.auth.createUserWithEmailAndPassword(email, pass).then((val) => {
     this.updateUserEmailSignup(val.user.uid, username, email);
      
     }).catch(err =>{
        console.log("emailSignUpLogin", err);
        swal("Alerta!", "Hubo un error con sus credenciales.", "warning");
     });
    }else{
        swal("Alerta!", "¡Debes llenar el nombre de manera correcta!", "warning");
    }

   }

   updateUserEmailSignup(uid, username: string, email) {
      // console.log("lo que recibe el usuario", uid);
      
      swal("Perfecto!", "Tu registro fue exitoso.", "success");
      //Obtener la información de usuario y pasarla a firestore desde login
      let userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${uid}`);       
       
      let data: User = {
         username: username,
         uid: uid,
         email: email,
         coins: 0,
         roles: 1
       };
       //NAVEGA AL JUEGO
       this.navCtrl.push("game");

       // pasamos la información sin sobreescribirla
       return userRef.set(data); 
      
  }

  emailSignIn(email, pass) {
    this.afauth.auth.signInWithEmailAndPassword(email,pass).then((credential) => {
      swal("Bienvenido", "", "success")
      this.navCtrl.push("game");
    })
    .catch((error) => {
      console.log("emailSignIn", error);
       swal("Alerta!", "Hubo un error con sus credenciales: " + error.message, "warning")     
    });
  }

  signOut() {
  //OFFLINE
  this.navCtrl.setRoot("home");
  this.afauth.auth.signOut();
 }

}
