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
export class SidebarService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}

  // private remember: boolean = false;
  // private token = localStorage.getItem("token") || "";

  getFicheNotification(): Observable<any> {
    const _lcURL = REST_API_URL + "notificationfiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };

    return this._http2.get(_lcURL, options);
  }

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
  ChangeTelephone(val): Observable<any> {
    console.log("object", localStorage.getItem("token"));
    const _lcURL = REST_API_URL + "fiche" + "/" + val.id;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };

    return this._http2.put(_lcURL, val,options);
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server not responding");
  }
}
