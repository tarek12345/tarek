import { Injectable } from '@angular/core';
import { Response, Http, RequestOptions, Headers } from "@angular/http";
import { Observable } from "rxjs";
import {throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from "@angular/common/http";

import { REST_API_URL } from "../../constants";


interface franchise {
  id: string;
}@Injectable()
export class ServiceGlobalService {
  _http:HttpClient;
    constructor(_http: HttpClient,) {this._http=_http;  }

    private token;

InfosFiche( franchise) : Observable<any> {
  const url = REST_API_URL + "modifNum Ads";
  let headers = new Headers({ 'Content-Type': 'application/json' });
  let options = new RequestOptions({ headers: headers });
  
  return this._http.post(url, franchise)
  .pipe(
      map(response => {
          // doSomething 
      }),
      catchError(error => { 
          this.errorHandler(error);
          return error ;
      })
  );

}
deleteBloc(bloc_id: number): Observable<any> {
  const url = REST_API_URL + "delete/Numero";
  let headers = new Headers({ 'Content-Type': 'application/json' });
  let options = new RequestOptions({ headers: headers });
  
  return this._http.post(url, bloc_id)
  .pipe(
      map(response => {
          // doSomething 
      }),
      catchError(error => { 
          this.errorHandler(error);
          return error ;
      })
  );

}









getlistPost(type): Observable<any> {
  const _lcURL = REST_API_URL + "detailspostgmb" ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.post(_lcURL, {type : type}  , options);
}


gethorairesgeneral(): Observable<any> {
  const _lcURL = REST_API_URL + "hourgeneral" ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.get(_lcURL  , options);
}

gethorairesExcep(): Observable<any> {
  const _lcURL = REST_API_URL + "hourgeneralexp" ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.get(_lcURL  , options);
}





getlistTime( ): Observable<any> {
  const _lcURL = REST_API_URL + "listhoraire";
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {headers: headers,};
  return this._http.get(_lcURL, options);
}


deletepost(post_id): Observable<any> {
  const _lcURL = REST_API_URL + "post/"+ post_id  ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.put(_lcURL , {typeaction : "Corbeille"} , options);
}

Supprimerpost(post_id): Observable<any> {
  const _lcURL = REST_API_URL + "deletepost"   ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.post(_lcURL , {post_id:post_id}, options);
}




Restaurerpost(post_id): Observable<any> {
  const _lcURL = REST_API_URL + "post/"+ post_id  ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.put(_lcURL , {typeaction : "Restaurer"} , options);
}


duplicatepost(post_id): Observable<any> {
  const _lcURL = REST_API_URL + "duplicatepostgmb/"+post_id ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.post(_lcURL , options);
}


getAlbums(album): Observable<any> {
  const _lcURL = REST_API_URL + "galerie" ;
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  return this._http.post(_lcURL , {search : album }  , options);
}



errorHandler(error:HttpErrorResponse){
    return throwError(error.message||"Server not responding");
 }
}