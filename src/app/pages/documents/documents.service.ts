
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
export class DocumentsService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {
 
  }


getDocuments(date_debut , date_fin, cp): Observable<any> {
  const _lcURL = REST_API_URL + "document"
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  console.log(headers);
  return this._http2.post(_lcURL, {date_debut :   date_debut ,   date_fin : date_fin , Page : cp} ,options);
}

}
