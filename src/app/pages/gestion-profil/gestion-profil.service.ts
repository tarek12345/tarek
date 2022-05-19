import { Injectable } from '@angular/core';
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: 'root'
})
export class GestionProfilService {

  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) { }


  Createprofil(profil ): Observable<any> {
    const _lcURL = REST_API_URL + "register ";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL,  {'profil' : profil , 'franchise_id' : localStorage.getItem("franchise_id")} ,  options);
  }


  getlistuser( ): Observable<any> {
    const _lcURL = REST_API_URL + "listprofil";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL,  {'franchise_id' : localStorage.getItem("franchise_id") , 'role_id' : localStorage.getItem("role_id") } ,  options);
  }

  getinfos( user_id): Observable<any> {
    const _lcURL = REST_API_URL + "user"+"/"+user_id
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL ,  options);
  }


  ModifUser22(profil ,user_id  ): Observable<any> {
    const _lcURL = REST_API_URL + "user"+"/"+user_id
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.put(_lcURL,  {'profil' : profil , 'franchise_id' : localStorage.getItem("franchise_id")} ,  options);
  }


  ModifUser(profil ,user_id  ): Observable<any> {
    const _lcURL = REST_API_URL + "user"+"/"+user_id
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.put(_lcURL,  {'profil' : profil , 'franchise_id' : localStorage.getItem("franchise_id")} ,  options);
  }

  deleteprofil(user_id  ): Observable<any> {
    const _lcURL = REST_API_URL + "userdelete"+"/"+user_id
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL ,  { 'franchise_id' : localStorage.getItem("franchise_id")} ,  options);
  }


}
