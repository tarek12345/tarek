import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";
@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(
    _http: HttpClient,
    private router: Router,
    private _http2: HttpClient
  ) {}
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
  getGalerie(fichindividuel,Categ,Count): Observable<any> {
    const _lcURL = REST_API_URL + "get_Gallery"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ fiche_id : fichindividuel, Category: Categ,nbcount:Count},options );
  }
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
    AddGategorieC(fichindividuel,Categ,Photo_file): Observable<any> {
      const _lcURL = REST_API_URL + "add_category"
      let headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      });
      let options = {
        headers: headers,
      };
      // console.log(headers);
      return this._http2.post(_lcURL,{ fiche_id : fichindividuel, Category: Categ,Photo_file:Photo_file,User_id: localStorage.getItem("user_id")},options );
    }
  AviertirGategorieC(Photo_id,fichindividuel,message): Observable<any> {
    const _lcURL = REST_API_URL + "avertir_photo"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    // console.log(headers);
    return this._http2.post(_lcURL,{ fiche_id : fichindividuel,Photo_id:Photo_id,Message:message,User_id: localStorage.getItem("user_id")},options );
  }
  getProfilincomplet(fichindividuel,Count): Observable<any> {
    const _lcURL = REST_API_URL + "profilincomplet";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel ,Count:Count},  options);
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
  getperformance(datedebut, datefin , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "performance";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",

      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {datedebut : datedebut, datefin : datefin , fiche_id : fichindividuel},  options);
  }


  getstorelocatore(fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "storelocatore";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",

      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel},  options);
  }



  getlistAvis(fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "globalbyid"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel}  ,options );
  }






  getlastAvis(fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "gloabalrep"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel} , options );
  }


  getlistsuggestions(fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "suggestion "
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel} , options );
  }



  detailssuggestion(type , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "detailsuggestion "
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { type : type , fiche_id : fichindividuel}, options );
  }


  sendlogo(photo ,listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichephoto"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { photo : photo , listfiche : listfiche , fiche_id : fichindividuel}, options );
  }


  sendRDV(listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updateficherendezvous"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {listfiche , fiche_id : fichindividuel}, options );
  }
  sendSite(listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updateficheurlsite"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { listfiche , fiche_id : fichindividuel}, options );
  }

  sendNumero(listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichephone"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {listfiche , fiche_id : fichindividuel}, options );
  }

  sendHoraire(horaire , listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehoraire"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { horaire , listfiche , fiche_id : fichindividuel}, options );
  }


  sendservices(listServices , listfiche ,fichindividuel ): Observable<any> {
    const _lcURL = REST_API_URL + "updateficheservice"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { listServices , listfiche ,  fiche_id : fichindividuel}, options );
  }


  SendHoraireExceptional(Listhoraireexexceptionnels , listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehorairexecep"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };

    return this._http2.post(_lcURL, { Listhoraireexexceptionnels , listfiche , fiche_id : fichindividuel}, options );
  }
  onChangecategorie(cat  ): Observable<any> {
    const _lcURL = REST_API_URL + "listeserivce"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { id_cat : cat }, options );
  }


  getlistraccourcis(fichindividuel , total): Observable<any> {
    const _lcURL = REST_API_URL + "raccourci"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel , total : total}  ,options );
  }


  sendraccourcis(raccourcis): Observable<any> {
    const _lcURL = REST_API_URL + "raccourcifiche"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { raccourcis}  ,options );
  }


  raccourcishoraires(horaire, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehoraire"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { horaire : horaire ,fiche_id : fichindividuel}  ,options );
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
    return this._http2.post(_lcURL, { Listhoraireexexceptionnels : horaire ,fiche_id : fichindividuel}  ,options );
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
    return this._http2.post(_lcURL, { listServices  ,fiche_id : fichindividuel}  ,options );
  }
  UploadPhoto(fichindividuel,form_values): Observable<any> {
    const url = REST_API_URL + "upload_photo";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url,{fiche_id : fichindividuel, data:form_values,User_id:localStorage.getItem("user_id")} ,options)
   }
  raccourciphotos (form_values, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichephotos"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel,data:form_values,User_id:localStorage.getItem("user_id")}  ,options );
  }

  produitsraccourcis (prod, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "post"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { prod  ,fiche_id : fichindividuel}  ,options );
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
    return this._http2.post(_lcURL, { listeAttributs  ,fiche_id : fichindividuel}  ,options );
  }

  liensraccourcis(liens, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updateficherendezvous"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { liens  ,fiche_id : fichindividuel}  ,options );
  }

  validernotifs(typesnotifs, fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "validenotifs"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, { typesnotifs  ,fiche_id : fichindividuel}  ,options );
  }

  getnotifs(fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "notificationbyfiche"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };
    return this._http2.post(_lcURL, {fiche_id : fichindividuel}  ,options );
  }
}
