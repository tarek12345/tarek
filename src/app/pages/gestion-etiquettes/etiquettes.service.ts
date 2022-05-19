import { Injectable } from '@angular/core';
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { Router } from "@angular/router";
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";
@Injectable({
  providedIn: 'root'
})
export class EtiquettesService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}
  getlistgroupe( ): Observable<any> {
    const _lcURL = REST_API_URL + "groupetiquette";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }
  sendListgroupe(listgroupe): Observable<any> {
    const url = REST_API_URL + "groupe";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {listgroupe : listgroupe}, options)
   }
   deplaceretiquette(etiquette , Enciengroupe , nouveaugroupe ): Observable<any> {
    const url = REST_API_URL + "deplacement";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url,  {listgroupe : {"etiquette" : etiquette , "Enciengroupe" : Enciengroupe  ,"nouveaugroupe" : nouveaugroupe }}, options)
   }
   deletetiquette(etiquette): Observable<any> {
    const url = REST_API_URL + "deletetiquette";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {"etiquette" : etiquette}, options)
   }



   deletegroupe(groupe): Observable<any> {
    const url = REST_API_URL + "deletegroupe";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {"groupe" : groupe}, options)
   }


   Restaureretiquette(etiquette): Observable<any> {
    const url = REST_API_URL + "restaurer";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {"etiquette" : etiquette}, options)
   }


   deletetdefinitivement(etiquette): Observable<any> {
    const url = REST_API_URL + "deletetdefinitivement";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {"etiquette" : etiquette}, options)
   }

}
