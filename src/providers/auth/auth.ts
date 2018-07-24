import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//FIREBASE
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
// JQUERY
import * as $ from 'jquery';
//SweetAlert
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';

@Injectable()
export class AuthProvider {

  //SWEET ALERT
  public swal: SweetAlert = _swal as any;

  constructor(
      public http: HttpClient,
      public db: AngularFireDatabase,
      public afs: AngularFirestore
      
  ) {
  }

}
