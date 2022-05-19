import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../../../constants";
@Injectable({
  providedIn: 'root'
})
export class HoraireSuppService {

  constructor(private _http2: HttpClient) {}

  get_Categorie(fiche): Observable<any> {
    const url = REST_API_URL + "gmb-horaire";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, fiche, options)
   }


   deletehoraires(HorairesSupp): Observable<any> {
    const url = REST_API_URL + "deletehoraires";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, HorairesSupp, options)
   }

   HorairesSupp(HorairesSupp): Observable<any> {
    const url = REST_API_URL + "horaires";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, HorairesSupp, options)
   }

}
