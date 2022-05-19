import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private _http: HttpClient) {}


  getlistetiquette(selectedfiche): Observable<any> {
    const _lcURL = REST_API_URL + "listdetails" ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http.post(_lcURL, {fiche_id : selectedfiche} , options);
  }
  

  

AddPost(post , selectedfiche): Observable<any> {
  const url = REST_API_URL + "postgmb"
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.post(url,   {post , fiche_id : selectedfiche} , options)
 }


}
