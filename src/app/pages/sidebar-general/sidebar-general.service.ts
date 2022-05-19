import { Injectable } from "@angular/core";
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { throwError } from "rxjs";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import {HttpClient,HttpClientModule,HttpErrorResponse,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: 'root'
})
export class SidebarGeneralService {

  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}

  getListFichesAdministrees(searchFiche , datafiltre , Modification): Observable<any> {
    const url = REST_API_URL + "ficheadministre";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url, {searchFiche : searchFiche , datafiltre : datafiltre , Modification : Modification}, options)
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

   get_fiche(state): Observable<any> {
    const url = REST_API_URL + "listficheencours";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(url, {'state' : state} , options)
   }
   
   
  raccourcishoraires(horaire, listfiche): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehoraire"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { horaire : horaire ,listfiche : listfiche}  ,options );
  }
 
  raccourcishorairesExcep(horaire, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehorairexecep"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { Listhoraireexexceptionnels : horaire ,listfiche : fichindividuel}  ,options );
  }
  UploadPhoto(fichindividuel,form_values): Observable<any> {
    const url = REST_API_URL + "sidbar_ficheadmin";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url,{listfiche : fichindividuel, data:form_values,User_id:localStorage.getItem("user_id")} ,options)
   } 
  raccourcisservices  (listServices, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updateficheservice"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { listServices  ,listfiche : fichindividuel}  ,options );
  }

  attributsraccourcis(listeAttributs , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "attribute"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { listeAttributs  ,listfiche : fichindividuel}  ,options );
  }

  liensraccourcis(liens, listfiche): Observable<any> {
    const _lcURL = REST_API_URL + "updateficherendezvous"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { liens  ,listfiche : listfiche}  ,options );
  }

}
