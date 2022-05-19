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
export class SidebarPostService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}

  getNotificationphoto(): Observable<any> {
    const _lcURL = REST_API_URL + "notificationphoto";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }




  getlistposts(): Observable<any> {
    const _lcURL = REST_API_URL + "last_posts";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(_lcURL, options);
  }

  get_fiche_encours(): Observable<any> {
    const url = REST_API_URL + "etatfiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.get(url, options)
   }
   Addcodegoogle(codegoogle): Observable<any> {
    const url = REST_API_URL + "codegoogle";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, codegoogle, options)
   }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server not responding");
  }

     /************Top *************/
     get_Top_Flop(): Observable<any> {
      const _lcURL = REST_API_URL + "post_classify"
      let headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      });
      let options = {
        headers: headers,
      };
      console.log(headers);
      return this._http2.get(_lcURL,options );
    }
}
