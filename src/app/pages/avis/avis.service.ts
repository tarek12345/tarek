import { Injectable } from "@angular/core";
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Router } from "@angular/router";

import {HttpClient,HttpClientModule,HttpErrorResponse,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: "root",

})
export class AvisService {
  trier_plus: boolean = false;
  trier_moin: boolean = false;
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {
 
  }
     /* web service Moyenne globale des avis*/
  getlistAvis(Etiquette ): Observable<any> {
    const _lcURL = REST_API_URL + "global"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
   return this._http2.post(_lcURL,{Etiquette : Etiquette},options );
  }
   /* web service tolat compteur  negatif*/
  getlistAvisNegatif(Etiquette ): Observable<any> {
    const _lcURL = REST_API_URL + "avis_negatif"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Etiquette : Etiquette},options );
  }
   /* web service tolat compteur  positif*/
  getlistAvisPositif(Etiquette ): Observable<any> {
    const _lcURL = REST_API_URL + "avis_postif"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Etiquette : Etiquette},options );
  }
 /* web service modifier la  reponse*/
  getTextreponse(Reply,Code,FicheName,Avis_id, Fiche_id): Observable<any> {
    const _lcURL = REST_API_URL + "reply_update"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Reply : Reply ,Code : Code ,FicheName : FicheName,Avis_id : Avis_id,Fiche_id : Fiche_id,User_id: localStorage.getItem("user_id")},options );
  }

  getReveiwAll(Etiquette,Filtre,Rating,Order,Count): Observable<any> {
    const _lcURL = REST_API_URL + "All_reviews"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Etiquette : Etiquette ,Filtre : Filtre ,Rating : Rating,Order:Order, Count: Count},options );
  }
   /* web service recherche */
  Review_autocompele(Filtre_search): Observable<any> {
    const _lcURL = REST_API_URL + "Review_autocompele"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Filtre_search : Filtre_search},options );
  }
   /* web service wording total*/
  getWordingsUtilisateurs(): Observable<any> {
    const _lcURL = REST_API_URL + "avis_wording"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{User_id:localStorage.getItem("user_id")},options);
  }
   /* web service wording positif*/
  getWordingsUtilisateurpositif(): Observable<any> {
    const _lcURL = REST_API_URL + "avis_wording_positif"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{User_id:localStorage.getItem("user_id")},options);
  }
  /* web service wording negatif*/
  getWordingsUtilisateurnegatif(): Observable<any> {
    const _lcURL = REST_API_URL + "avis_wording_negatif"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{User_id:localStorage.getItem("user_id")},options);
  }
}
