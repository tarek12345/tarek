import { Injectable } from "@angular/core";
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { throwError } from "rxjs";
import { Observable } from "rxjs";

import { Router } from "@angular/router";

import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";

import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: "root",
})
export class NavbarService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}
  getCategorie(val): Observable<any> {
    const _lcURL = REST_API_URL + "gmb-categories" + "?" +"searchTerm="+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }


  getListPays(): Observable<any> {
    const _lcURL = REST_API_URL + "pays";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }
  getAgence(Adresse): Observable<any> {
    const url = REST_API_URL + "gmb-associateadresse";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, Adresse, options)
   }
  AddFranchise(franchise:any) : Observable<any> {
    const url = REST_API_URL + "gmb-createfiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url , franchise , options)
    }

    getEtablissement(Etab): Observable<any> {
    const _lcURL = REST_API_URL + "gmb-etablissement" + "?" +"searchTerm="+Etab;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }



  getdetailsEtablissement(Etab :any): Observable<any> {
    const _lcURL = REST_API_URL + "gmb-googlelocation";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, Etab , options);
  } 
  
  getlocality(Etab :any): Observable<any> {
    const _lcURL = REST_API_URL + "gmb-locality";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, Etab , options);
  } 
  AddPost(post:any) {
    const url = REST_API_URL + "post";
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http2.post(url, post)

  
  }
}
