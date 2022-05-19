import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../../../constants";

@Injectable({
  providedIn: 'root'
})
export class HorairesFicheService {

  constructor(private _http2: HttpClient) {

  }


  gethoraires(val ): Observable<any> {
    const _lcURL = REST_API_URL + "horairebyfiche ";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(_lcURL,  {fiche_id : val}, options);
  }
  ModifHoraires(horaire): Observable<any> {
    const url = REST_API_URL + "fichehours";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, horaire, options)
   }

   getlistTime( ): Observable<any> {
    const _lcURL = REST_API_URL + "listhoraire";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.get(_lcURL, options);
  }

}
