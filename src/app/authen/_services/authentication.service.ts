import { Injectable } from "@angular/core";
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import {HttpClient,HttpErrorResponse,
} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";
@Injectable()
export class AuthenticationService {_http: HttpClient;
  constructor(_http: HttpClient,private router: Router) 
  {
    this._http = _http;
  }
  signinUser(user: any) : Observable<any> {
    const url = REST_API_URL + "login";
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, user)
  }
  signinUserGoogle(emailGoogle) : Observable<any> {
    const url = REST_API_URL + "login";
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, { email: emailGoogle })
  }
  PasswordOublie(mail: any) : Observable<any> {
    const url = REST_API_URL + "resetpassword";
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(url, mail);
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || "Server not responding");
  }
}
