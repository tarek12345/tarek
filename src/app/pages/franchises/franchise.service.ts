import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient,HttpHeaders,} from "@angular/common/http";
import { REST_API_URL } from "../../../constants";

@Injectable({
  providedIn: "root",
})
export class FranchiseService {
  constructor(private _http2: HttpClient) {}
  public notify = new BehaviorSubject<any>('');

  notifyObservable$ = this.notify.asObservable();
  public notifyOther(data: any) {
    if (data) {
        this.notify.next(data);
    }
}
  getFranchise(val ,search ,Ordrefiche ,plusrecent,drapeaux ): Observable<any> {
    const _lcURL = REST_API_URL + "franchise"+ "?" +"idfiche="+val ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(_lcURL,{val:val ,search:search ,Ordrefiche:Ordrefiche ,plusrecent:plusrecent, drapeaux:drapeaux}, options);
  }
  SendHoraireExceptional(horairexceptionnels , listfiche , fichindividuel): Observable<any> {
    const _lcURL = REST_API_URL + "updatefichehorairexecep"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = {
      headers: headers,
    };

    return this._http2.post(_lcURL, { horairexceptionnels , listfiche , fiche_id : fichindividuel}, options );
  }
  getfichebyid(idfiche ,idfranchise  ): Observable<any> {
    const _lcURL = REST_API_URL + "fichebyid"+ "?" +"idfiche="+idfiche + "&" +"idfranchise="+idfranchise;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get(_lcURL, options);
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
  ModifEtablissement(non ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put(url, {id_fiche :localStorage.getItem("idfiche_encours") ,locationName : non }, options)
   }
   AddPhoto(non): Observable<any> {
    const url = REST_API_URL + "photo";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url, non, options)
   }
   ModifNumero(non ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, non, options)
   }
   Modifproprietaire(fiche_id , type ,userid , email ,lastname): Observable<any> {
    const url = REST_API_URL + "updaterole";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.post(url,  { fiche_id :fiche_id , type : type , userid : userid , email :email , lastname:lastname }, options)
   }
   Modifsite(urlsite ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, {websiteUrl : urlsite}, options)
   }

   Modiflienrdv(lien ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, {lien : lien}, options)
   }

   ModifCode(code ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, {storeCode : code}, options)
   }
   ModifLibelle(Libelle ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put(url, Libelle, options)
   }
   ModifAdwPhone(phoneAwd ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, phoneAwd, options)
   }
   Modifdescription(description ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, {description : description}, options)
   }
   Modifdateouverture(ouverture ,val): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = {headers: headers,};
    return this._http2.put(url, {OpenInfo_opening_date : ouverture}, options)
   }
   AddProduit(phoneAwd): Observable<any> {
    const url = REST_API_URL + "post"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, phoneAwd, options)
   }
   Modifcategorie(cat): Observable<any> {
    const url = REST_API_URL + "categorieup"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, cat, options)
   }
   getCategorie(Etab ): Observable<any> {
    const _lcURL = REST_API_URL + "gmb-categories" + "?" +"searchTerm="+Etab;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get(_lcURL, options);
  }
   AddCategorie(cat): Observable<any> {
    const url = REST_API_URL + "categorie"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, cat, options)
   }

   deleteCategorie(fiche_id, cat): Observable<any> {
    const url = REST_API_URL + "delete"+ "?" +"categorie="+cat+ "&" +"idfiche="+fiche_id ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, {cat,fiche_id}, options)
   }
   
   delete_service(service, categorie , fiche_id): Observable<any> {
    const url = REST_API_URL + "delete"+ "?" +"categorie="+categorie+ "&" +"idfiche="+fiche_id + "&" +"service="+service ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url,{categorie,fiche_id,service}, options)
   }
   onChangecategorie( fiche_id,cat): Observable<any> {
    const _lcURL = REST_API_URL + "servicecategorie"+"?" +"id_cat="+ cat + "&" +"idfiche="+fiche_id ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get(_lcURL, options);
  }
  getservicesCat( fiche_id,cat): Observable<any> {
    const _lcURL = REST_API_URL + "servicecategorie"+"?" +"id_cat="+ cat + "&" +"idfiche="+fiche_id ;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get(_lcURL, options);
  }
  detailService(service): Observable<any> {
    const _lcURL = REST_API_URL + "service/" +service;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get(_lcURL, options);
  }
  ModifService(service ,id ): Observable<any> {
    const url = REST_API_URL + "service/"+id;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put(url, service, options)
   }
   AddServicePerso(cat): Observable<any> {
    const url = REST_API_URL + "categorie"
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, cat, options)
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
   get_Categorie(fiche): Observable<any> {
    const url = REST_API_URL + "gmb-horaire";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, fiche, options)
   }
   gethoraires(hoursTypeId): Observable<any> {
    const url = REST_API_URL + "horaires";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, hoursTypeId, options)
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
   deletehoraires(HorairesSupp): Observable<any> {
    const url = REST_API_URL + "deletehoraires";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post(url, HorairesSupp, options)
   }
   Fermer_fiche_temporaire ( val ,CLOSED_TEMPORARILY): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put (url,  {OpenInfo_status: CLOSED_TEMPORARILY }, options)
   }
   Fermer_fiche_definitivement ( val ,CLOSED_PERMANENTLY): Observable<any> {
    const url = REST_API_URL + "fiche"+  "/"+val;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put (url,  {OpenInfo_status: CLOSED_PERMANENTLY }, options)
   }
   getlistproduits ( val ,index): Observable<any> {
    const url = REST_API_URL + "listbycategory";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url,  {fiche_id : val, id_Categorie: index }, options)
   }
   getlistcategories (val): Observable<any> {
    const url = REST_API_URL + "listcategory";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url, {fiche_id: val },options)
   }
   selectfiche(val , etiquetteselectedstat): Observable<any> {
    const url = REST_API_URL + "etiquettegroupe ";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url, {fiche_id: val , etiquettegroupe :etiquetteselectedstat},options)
   }

   deleteEtiquette(val , id_groupe2 ,etiquettegroupe2 ): Observable<any> {
    const url = REST_API_URL + "etiquettegroupe ";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url, {fiche_id: val , id_groupe : id_groupe2  , etiquettegroupe : etiquettegroupe2 , status:false},options)
   }
   getListzonedesservies(fiche_id , zone  ): Observable<any> {
    const url = REST_API_URL + "zonedesservies";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url, {fiche_id: fiche_id , ville : zone },options)
   }
   onChangezone(fiche_id , zone  ): Observable<any> {
    const url = REST_API_URL + "servicearea";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url, {fiche_id: fiche_id , zone : zone },options)
   }
   deleteproduit(fiche_id , id_produit  ): Observable<any> {
    const url = REST_API_URL + "post"+ "/"+id_produit;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.delete (url, options)
   }
   getAdresselocality(fiche_id): Observable<any> {
    const url = REST_API_URL + "fiche"+"/"+fiche_id;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.get (url, options)
   }
   sendAdresse(fiche_id ,adresse): Observable<any> {
    const url = REST_API_URL + "fiche"+ "/"+fiche_id;
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.put (url,adresse , options)
   }
   getListAttributs(fiche_id ,searchAttribut  ): Observable<any> {
    const url = REST_API_URL + "gmb-attribute";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url ,  {fiche_id: fiche_id , searchAttribut : searchAttribut} , options)
   }
   sendAttribut(fiche_id  , listeAttributs , user_id): Observable<any> {
    const url = REST_API_URL + "attribute";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url ,  {fiche_id: fiche_id , listeAttributs : listeAttributs , user_id : user_id} , options)
   }
   add_user(fiche_id  , email , role): Observable<any> {
    const url = REST_API_URL + "userfiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url ,  {fiche_id: fiche_id , email : email , pendingInvitation : true, role : role} , options)
   }
   DissocierFiche(fiche_id  , user_id ): Observable<any> {
    const url = REST_API_URL + "dissocierfiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url ,  {fiche_id: fiche_id , user_id : user_id} , options)
   }
   Deleteuser(fiche_id  , user_id ): Observable<any> {
    const url = REST_API_URL + "deletefiche";
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("token"),
    });
    let options = { headers: headers,};
    return this._http2.post (url ,  {fiche_id: fiche_id , user_id : user_id} , options)
   }
}
