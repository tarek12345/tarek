import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import {HttpClient,HttpClientModule,HttpErrorResponse,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";
@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor(
     _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
    ) { }
    
 /* web service Visibilité par date.*/ 
    getVisibilitePhotos(listTags,Date_debut , Date_fin): Observable<any> {
      const _lcURL = REST_API_URL + "photo_stats"
      let headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      });
      let options = {
        headers: headers,
      };
      console.log(headers);
      return this._http2.post(_lcURL, {Ettiquets:listTags,Date_debut :   Date_debut ,   Date_fin : Date_fin } ,options);
    }

   /* Web service Stats Photos.*/ 
 
  Review_autocompele(Filtre_search): Observable<any> {
    const _lcURL = REST_API_URL + "Review_autocompele"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Filtre_search : Filtre_search},options );
  }
  PhotoMissing(): Observable<any> {
    const url = REST_API_URL + "photo_missing";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.get(url, options)
   }

  UploadPhoto(Fiche_id,form_values): Observable<any> {
    const url = REST_API_URL + "upload_photo";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url,{Fiche_id:Fiche_id, data:form_values,User_id:localStorage.getItem("user_id")} ,options)
   } 
   getGalerie(Fiche_id,Categ,Count): Observable<any> {
    const _lcURL = REST_API_URL + "get_Gallery"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ Fiche_id:Fiche_id, Category: Categ,Count:Count},options );
  }

  AddGategorieC(Fiche_id,Categ,Photo_file): Observable<any> {
    const _lcURL = REST_API_URL + "add_category"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ Fiche_id:Fiche_id, Category: Categ,Photo_file:Photo_file,User_id: localStorage.getItem("user_id")},options );
  }
    // Debut web service    Supprimer photos  //
DeleteGategorieC(Photo_id): Observable<any> {
    const _lcURL = REST_API_URL + "delete_photo"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ Photo_id:Photo_id},options );
  }
    // Fin  web service    Supprimer photos  //

  // Debut web service    Aviertir photos  //
  AviertirGategorieC(Photo_id,Fiche_id,message): Observable<any> {
    const _lcURL = REST_API_URL + "avertir_photo"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ Fiche_id:Fiche_id,Photo_id:Photo_id,Message:message,User_id: localStorage.getItem("user_id")},options );
  }
    // Fin  web service    Aviertir photos  //

//  Debut web service  Ajouter des photos fiter //

Recherche_photo(Filtre_search): Observable<any> {
  const _lcURL = REST_API_URL + ""
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  // console.log(headers);
  return this._http2.post(_lcURL,{Filtre_search : Filtre_search},options );
}
// Fin web service Ajouter des photos fiter //

//  Debut web service  Dernières photos fiter //

 autocomplete_photo (Filtre_search): Observable<any> {
    const _lcURL = REST_API_URL + "photo_autocompele"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Filtre_search : Filtre_search},options );
  }
  // Fin web service  Dernières photos fiter //

// Debut  web service  Dernières photos client + Dernières photos propriétaire //
  Dernier_photoP_C(fiche): Observable<any> {
    const _lcURL = REST_API_URL + "dernier_photo"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{Fiches:fiche},options );
  }

//Fin web service  Dernières photos client + Dernières photos propriétaire  //

// Debut web service  Signalier photos  //
SignalierGategorieC(Photo_id): Observable<any> {
  const _lcURL = REST_API_URL + "signalier_photo"
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  // console.log(headers);
  return this._http2.post(_lcURL,{Photo_id:Photo_id,User_id: localStorage.getItem("user_id")},options );
}
// Fin web service  Signalier photos  //



Getfilter_Localisation (): Observable<any> {
  const _lcURL = REST_API_URL + "get_localisation_service"
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  // console.log(headers);
  return this._http2.get(_lcURL,options );
}
autocomplete_Ajouterphoto (Filtre_search,Location,Services): Observable<any> {
  const _lcURL = REST_API_URL + "add_photo_autocompele"
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token"),
  });
  let options = {
    headers: headers,
  };
  // console.log(headers);
  return this._http2.post(_lcURL,{Filtre_search : Filtre_search,Location:Location,Services:Services},options );
}

// Debut web service  Ajouter des photos  devant  bloc carousell //
UploadAdd_Photo(Fiches,form_values): Observable<any> {
  const url = REST_API_URL + "add_photo";
  let headers = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("token"),
  });
  let options = {headers: headers,};
  return this._http2.post(url,{Fiches:Fiches, data:form_values,User_id:localStorage.getItem("user_id")} ,options)
 } 
}
// Fin web service  Ajouter des photos  devant  bloc carousell //