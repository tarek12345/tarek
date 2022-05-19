import { Component,ElementRef,OnInit,ViewChild,ViewChildren} from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpErrorResponse,} from "@angular/common/http";
import {NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import {Router } from "@angular/router";
import { FranchiseService } from "../franchises/franchise.service";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { GenericValidator } from "src/app/shared/generic-validator.service";
import * as L from "leaflet";
import { LayerGroup } from "leaflet";
import { NotificationsService } from "angular2-notifications";
import { TransfereServiceService } from "../transfere-service.service";
import { path } from "../../../constants";
import { exit } from "process";
import { datepickerAnimation } from "ngx-bootstrap/datepicker/datepicker-animations";
@Component({
  selector: "app-franchises",
  templateUrl: "./franchises.component.html",
  styleUrls: ["./franchises.component.css"],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class FranchisesComponent implements OnInit {
  isMobile: boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  user
  FicheDissocier : boolean = false
  public res;
  horairessup = [];
  detailsfiche = [] ;
  typeaction
  categorie= [];
  Listservices= [];
  fichindividuel
  showaddProdform : boolean = false
  path = path
  Detailshorairessup = [];
  imageURL: string;
  options: L.MapOptions = {
    zoom: 5,
    center: L.latLng(44.7716019, -0.6322578),
    layers: [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 10,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }),
    ],
  };
  map: L.Map;
  pathimage="https://api-wallpost.b-forbiz.com/public/app/public/photos/"
  selectedTimer: "";
  productlength
  markersLayer = new L.LayerGroup();
  sMarkersLayer: LayerGroup;
  zoomLevel =5;
  Catprincipal
  categorieprincipal
  etatvalidationcatp
  selectedcategories : any
   iconUrl = "../assets/Fiche/marker-icon-2x.png";
  stations = [];
  Annee
  Jours
  Mois
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.largeWidth;

  }
  openblock(contentblock){
    this.modalService
      .open(contentblock, { size: "content_md photos" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  fermerpro() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
  createStations() {
    this.sMarkersLayer = new L.LayerGroup();
    for (const s of this.stations) {
      let icon;
      icon = new L.DivIcon({
        html: `<img src='${this.iconUrl}'/> <span>${s.name}</span>`,
      });
      const marker = L.marker([s.lat, s.lng], { icon });
      this.sMarkersLayer.addLayer(marker);
    }
    this.markersLayer.addLayer(this.sMarkersLayer);
  }
  onMapReady(map: L.Map) {
    setTimeout(() => {
      map.invalidateSize();
      this.map = map;
      map.addLayer(this.markersLayer);
    }, 200);
  }
  idfiche;
  locationName;
  adresse;
  telephone =[]
  urlsite;
  codemagasin;
  libelles;
  service;
  nbfrachise;
  statuts
  photo;
  imageList;
  files: File[] = [];
  TypeUsers = [];
  description
  listTimes = [];
  adwPhone;
  email;
  google;
  produits
  etatsm
  ouverture
  maps;
  OpenInfo_status
  fermeturefiche : boolean = false
  OpenInfo_canreopen
  lienrdv
  /*******service */
  lengthtotal = 0
  listattributes = []
  currentService;
  PrixService;
  DescriptionService;
  typeservice = "Aucun prix";
  current_Service_Cat_Id;
  current_Service_Id;
  Service_value;
  listServices = [];
  CurrentnameCat;
  CurrentIdCat;
  /*******fin */
  catselected ="new"
 
  @ViewChild("txtInput") txtInput: ElementRef;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  change;
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  etat;
  private numerotel;
  private listlibelle;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.France, CountryISO.Tunisia];
  countryCode = "fr";
  phone = "";
  editable: boolean = false;
  selectedOption = "";
  files_dropped: File[] = [];
  public checklist: any[];
  public photos: any;
  Ajoutuser: boolean = true;
  Detailshoriares: boolean = false;
  Currentcategoriehoraire: boolean = false;
  Detailshoriare: boolean = false;
  setSelected = "";
  searchFiche
  recent
  listligne
  isDisabled: boolean = false;
  post_localisation
  post_specifite: boolean = false;
  isDisabledSpec: boolean = false;
  AddPostForm: FormGroup;
  AddPhotoForm: FormGroup;
  ModifNumeroForm: FormGroup;
  ModifInfosE: FormGroup;
  ModifLibelleForm: FormGroup;
  DateouvertureForm: FormGroup;
  HorairesForm: FormGroup;
  HorairesSuppForm: FormGroup;
  HorairesdetailsForm: FormGroup;
  ServicePersoForm: FormGroup;
  CategorieForm: FormGroup;
  ModifServiceForm: FormGroup;
  ProduitForm: FormGroup;
  ZonesForm: FormGroup;
  AttributsForm: FormGroup;
  AdresseForm: FormGroup;
  CatForm: FormGroup;
  currentCategorie;
  currentdisplayName;
  CurrentCat;
  public listficheLocalisation = [];
  public listficheSpec = [];
  public AutreListSpec = [];
  public AutreList = [];
  horaire_debut;
  horaire_fin;
  listHoraires = [];
  public Groupe_categorie = [];
  public Groupe_horscategorie = [];
  public listFranchises = [];
  public listusers = [];
  public horaires = [];
  public horairessupp = []
  public horairexceptionnels = []
  TypePhotos = [
    { type: "INTERIOR", name: "Intérieur" },
    { type: "EXTERIOR", name: "Couverture" },
  ];
  listGroupe = [];
  role_id
  /******************service***** */
  zonedesservies= [];
  CategorieServices = [];
  servicesCat = [];
  services = [];
  detailsService = [
    { id: 1, name: "Aucun prix" },
    { id: 2, name: "Gratuit" },
    { id: 3, name: "Fix" },
    { id: 4, name: "A partir de " },
  ];
  addservice: boolean = false;
  add_Cat: boolean = false;
  delete_Cat: boolean = false;
  showdetailS: boolean = false;
  selected = "Aucun prix";
  disabled: boolean = false;
  /******************fin service***** */

  /**************produit***********/
  valueChange = false;
  private DataLogo: string = '0';
  photo_produit: string = '';
  file_produit
  calltoaction ="Aucun"
  id_produit
  Nom_produit;
  Description_produit;
  Categorie_produit;
  Prix_maximal;
  Prix_minimal;
  Prix_produit;
  lien_produit
  setOffre = "Aucun"
  gamme_prix : boolean =false
  listcategories = []
  listcategoriesproduits = [
    {
    Categorie_produit: 'Tous les produits',
    active: true,
    id_Categorie : 0
  },
  ]
  listcategoriesp= [];
  listproduits= [];
  Offres = [
    { calltoaction: "Aucun", selected: false },
    { calltoaction: "Commander en ligne", selected: false },
    { calltoaction: "Acheter", selected: false },
    { calltoaction: "En savoir plus", selected: false },
    { calltoaction: "Profiter de l'offre", selected: false },
  ];
  /**********fin produit************/
  /***********adress *****/
  showdeletetext: boolean = false;
  public currentAdress;
  public currentpays;
  public currentCodePostal;
  public currentVille;
  /*********fin adresse */
   /*********Ouverture */
   ListMois= [
    { Mois: "Janvier" , value :"1" },
    { Mois: "Février" , value :"2"},
    { Mois: "Mars" , value :"3"},
    { Mois: "Avril" , value :"4"},
    { Mois: "Mai" , value :"5"},
    { Mois: "Juin"  , value :"6"},
    { Mois: "Juillet" , value :"7"},
    { Mois: "Aout" , value :"8"},
    { Mois: "Septembre" , value :"9"},
    { Mois: "Octobre" , value :"10"},
    { Mois: "Novembre" , value :"11"},
    { Mois: "Décembre" , value :"12"},
  ];
  listJours= [
    "1" , "2","3", "4", "5", "6" , "7", "8","9","10","11","12", "13" ,"14","15","16", "17", "18" ,"19", "20","21","22", "23","24","25","26","27","28","29","30","31",
  ];
  closeResult = "";
  public index = 0;
  TypeGroupe;
  TypeModif;
  listUploadImages: any[];
  etiquetteselected
  actionfermeture
  open(content3, type , etiquetteselected) {
    this.etiquetteselected = etiquetteselected
    this.TypeGroupe = type;
    this.modalService
      .open(content3, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openfermeture (contentfermeture , type){
  this.actionfermeture = type
  this.modalService.open(contentfermeture, { size: "sm" }).result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
  );
}
  ModifContentInfos(contentInfos, type) {
    this.TypeModif = type;
    this.modalService
      .open(contentInfos, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Modifproduitsfiche(contentInfos, type) {
    this.TypeModif = type;
    this.modalService
      .open(contentInfos, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
      this.getlistcategories()
  }
  AddPhotos(contentP) {
    this.modalService
      .open(contentP, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openpopupadduser(contentadduser, type , etiquetteselected) {
    this.etiquetteselected = etiquetteselected
    this.TypeGroupe = type;
    this.modalService
      .open(contentadduser, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Opensuppression(contentsupp, user , FicheDissocier) {

    if(user)
    {
      this.user = user
    }

    if(FicheDissocier != '')
    {
      this.FicheDissocier = true
    }
    this.modalService.open(contentsupp, { size: "sm" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  specification = [ ];
  /****************zone && attributs************ */
  listzone = [];
  searchAttribut = "";
  selectedzone= []
  listeAttributs = [];
  /**********fin zone******** */
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  detailsfranchise
  detailsnotifs

  @ViewChild('contentInfos') myModal;
  constructor(
    _http: HttpClient,
    public router: Router,
    private fb: FormBuilder,
    private transfereService:TransfereServiceService,
    private FranchiseService: FranchiseService,
    private _Notificationservice: NotificationsService,
    private modalService: NgbModal,
  ) {

   this.detailsnotifs =''
    this.detailsnotifs = this.transfereService.getDatanotifs();
    if(this.detailsnotifs){
      localStorage.setItem("idfiche_encours",  this.detailsnotifs.detailsnotifs);

    }
   else if(this.detailsnotifs == "undefined")
    {
      this.router.navigateByUrl('/franchises');
    }


    this.detailsfranchise = this.transfereService.getDatafranchise();

    if(this.detailsfranchise){
      this.modalService.dismissAll("Dismissed after saving data");
      localStorage.setItem("idfiche_encours",  this.detailsfranchise);

    }
   else if(this.detailsfranchise == "undefined")
    {
      this.modalService.dismissAll("Dismissed after saving data");
      this.router.navigateByUrl('/franchises');
    }



    this.isDisabled = true;
    this.isDisabledSpec = true;
    this.validationMessages = {
      Nom_produit: {
        required: "Le nom  est obligatoire et ne peut être vide.",
        minlength: "Le nom doit comporter au moins 3 caractères.",
        maxlength: "Le nom ne doit pas dépasser 120 caractères.",
      },
      Categorie_produit: {
        required: "La Categorie est obligatoire et ne peut être vide.",
        minlength: "La Categorie doit comporter au moins 3 caractères.",
        maxlength: "La Categorie ne doit pas dépasser 58 caractères.",
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.checklist = [
      { id: 1, value: "Définir comme logo" , isDisabled : false },
      { id: 2, value: "Définir comme Couverture" , isDisabled : false },
    ];
    this.AddPostForm = this.fb.group({
      post_localisation: [""],
      post_specifite: [""],
    });
    this.AddPhotoForm = this.fb.group({
      file: ["", Validators.required],
      category: ["", Validators.required],
      type_photo: [""],
    });

    this.ModifNumeroForm = this.fb.group({
      numerotel: this.fb.array([]),
    });
    this.ModifInfosE = this.fb.group({
      adwPhone: ["", Validators.required],
    });
    this.DateouvertureForm= this.fb.group({
      Annee: ["", [Validators.required ,
        Validators.minLength(3),
        Validators.maxLength(4),]],
        Mois: ["", [Validators.required ]],
        Jours: [""],
    });
    this.ModifLibelleForm = this.fb.group({
      listlibelle: this.fb.array([]),
    });
    this.HorairesForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
    this.HorairesSuppForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
    this.HorairesdetailsForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });

    this.ServicePersoForm = this.fb.group({
      listService: this.fb.array([
      ]),
    });
    this.CategorieForm = this.fb.group({
      Name_cat: [""],
      listServices: this.fb.array([]),
    });
    this.CatForm= this.fb.group({
      Catprincipal: [""],
      displayName: [""],
      listCat: this.fb.array([

      ]),
    });
    this.ModifServiceForm = this.fb.group({
      type_service: [""],
      prix_service: [""],
      description_service: [""],
    });
    this.ProduitForm = this.fb.group({
     photo_produit: ["", [Validators.required]],
      Nom_produit: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(120),
        ],
      ],
      Categorie_produit: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(58),
        ],
      ],
      New_Categorie:  [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(58),
        ],
      ],
      Prix_produit: [""],
      gamme_prix: [""],
      Prix_minimal: [""],
      Prix_maximal: [""],
      Description_produit: [""],
      lien_produit: [""],
      calltoaction: [""],
    });
    this.ZonesForm = this.fb.group({
      zone: [""],
    });
    this.AdresseForm = this.fb.group({
      pays: [""],
      adresse: [""],
      code_postale: [""],
      ville: [""],
      listligne: this.fb.array([]),
    });
  }
  ngOnDestroy(){
    localStorage.setItem('fichindividuel' , '')

    this.transfereService.clearDatanotifs();

  }
  ngOnInit(): void {
    this.isMobile = this.width < this.largeWidth;
    this.role_id = localStorage.getItem('role_id')
    this.fichindividuel = localStorage.getItem('idfiche_encours')

     this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
    this.getlistTime();


    if(this.detailsnotifs !=''){
      this.TypeModif =  this.detailsnotifs.TypeModif

      if(this.TypeModif == 'horairesSupp')
      {
        this.get_Categorie()
      }
      else  if(this.TypeModif == 'horairexceptionnels')
      {
        this.get_Categorie()
      }
     else if(this.TypeModif == 'Adresse')
      {
        this.getAdresselocality()
      }

        setTimeout(() => {
          this.ModifContentInfos(this.myModal, this.TypeModif)
        }, 800);



    }
  }
  /***********************horaires********************** */
  Listhoraires(): FormArray {
    return this.HorairesForm.get("Listhoraire") as FormArray;
  }
  listhorairess(horaireIndex: number): FormArray {
    return this.Listhoraires().at(horaireIndex).get("horaire") as FormArray;
  }
  newhoraire(): FormGroup {
    return this.fb.group({
      heurdebut: "",
      heurfin: "",
      id: "",
    });
  }
  addHoraire(horaireIndex: number) {
    if (this.listhorairess.length >= 1) {
      for (let i = 0; i < this.listhorairess.length; i++) {
        if (
          this.listhorairess(horaireIndex).value[
            this.listhorairess(horaireIndex).value.length - 1
          ].heurdebut == "" &&
          this.listhorairess(horaireIndex).value[
            this.listhorairess(horaireIndex).value.length - 1
          ].heurfin == ""
        ) {
        } else {
          this.listhorairess(horaireIndex).push(this.newhoraire()
          );
        }
      }
    }
  }
  removeH(horaireIndex: number, IndexH: number) {
    this.listhorairess(horaireIndex).removeAt(IndexH);
  }
  /***********************fin horaires********************** */
  /***********************horaires supplementaire********************** */
  Horaires_details(): FormArray {
    return this.HorairesdetailsForm.get("Listhoraire") as FormArray;
  }
  horairedetails(horIndex: number): FormArray {
    return this.Horaires_details().at(horIndex).get("horaire") as FormArray;
  }
  addhorairesupp(horIndex: number) {
    if (this.horairedetails.length >= 1) {
      for (let i = 0; i < this.horairedetails.length; i++) {
        if (
          this.horairedetails(horIndex).value[
            this.horairedetails(horIndex).value.length - 1
          ].heurdebut == "" &&
          this.horairedetails(horIndex).value[
            this.horairedetails(horIndex).value.length - 1
          ].heurfin == ""
        ) {
        } else {
          this.horairedetails(horIndex).push(this.newhoraire());
        }
      }
    }
  }
  addhorairexceptionnels(){

    this.horairexceptionnels.push({"date":new Date(),"etat":"","horaire":[{"heurdebut":"","heurfin":"","etat":"","id":null}]})

  }
  removehorairesupp(horIndex: number, indexhorairesupp: number) {
    this.horairedetails(horIndex).removeAt(indexhorairesupp);
  }
  /********************details horaires***************** */
  Horaires_Supp(): FormArray {
    return this.HorairesSuppForm.get("Listhoraire") as FormArray;
  }
  horairesuppdetails(Indexdetails: number): FormArray {
    return this.Horaires_Supp().at(Indexdetails).get("horaire") as FormArray;
  }
  newhorairedetails(): FormGroup {
    return this.fb.group({
      heurdebut: "",
      heurfin: "",
      id: "",
    });
  }
  addhorairedetails(horaireIndex: number) {
    if (this.horairesuppdetails.length >= 1) {
      for (let i = 0; i < this.horairesuppdetails.length; i++) {
        if (
          this.horairesuppdetails(horaireIndex).value[
            this.horairesuppdetails(horaireIndex).value.length - 1
          ].heurdebut == "" &&
          this.horairesuppdetails(horaireIndex).value[
            this.horairesuppdetails(horaireIndex).value.length - 1
          ].heurfin == ""
        ) {
        } else {
          this.horairesuppdetails(horaireIndex).push(this.newhorairedetails());
        }
      }
    }
  }
  removehoraire(Index: number, HSindex: number) {
    this.horairesuppdetails(Index).removeAt(HSindex);
  }

  /***********************fin horaires********************** */
   Ordrefiche: boolean = false;
  drapeaux = [
    {etat: 'complet',path: 'https://api-wallpost.bforbiz-dev.com/public/icon/complet.svg'},
    {etat: 'manque' ,path: 'https://api-wallpost.bforbiz-dev.com/public/icon/manque.svg'},
    {etat: 'aucune' ,path: 'https://api-wallpost.bforbiz-dev.com/public/icon/aucune.svg'}
  ]

  TriList = [
    {id:'DESC', Name: "Trier Du + au - récent" },
    {id:'ASC', Name: "Trier Du - au + récent" },

  ];
  plusrecent: "DESC";
  getOrderRecent(trie){
    this.plusrecent=trie;
    this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");

  }
  getlistTime() {
    this.FranchiseService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }
  dissociation=null;
  horairessuppFranchises=[];
  horairessuppFranchisesJour=[];
  getListFranchise(val, search, Ordrefiche, plusrecent,drapeaux) {

    let LisJours = this.HorairesForm.get("Listhoraire") as FormArray;
    localStorage.setItem('idfiche_encours' , val),
    this.FranchiseService.getFranchise(localStorage.getItem('idfiche_encours'),search,Ordrefiche,plusrecent, drapeaux ).subscribe((result) => {
      // this.drapeaux = result.drapeaux;
      console.log('  "qdsqdsqdqdqd"'  ,   this.drapeaux)
      this.listlibelle = []
      this.listFranchises = result.fiches;
      //  console.log('  ""'  ,"")
      this.filterlocationNameLength(this.listFranchises)
      this.detailsfiche = result.details
      this.locationName = result.details[0].locationName.locationName;
      this.idfiche = result.details[0].idfiche;
      localStorage.setItem("idfiche_encours",  this.idfiche);
      localStorage.setItem("franchise_id_encours",   result.details[0].idfranchise);
      this.horaires = result.details[0].horaire.listhoraire;
      this.horairessupp =  result.details[0].horairesupp.listhoraireexceptionnelle;
      if(result.details[0].horairesupp.listhoraireexceptionnelle.length > 0 && result.details[0].horairesupp.listhoraireexceptionnelle[0].horaire.length >0){
        this.horairessuppFranchises =  result.details[0].horairesupp.listhoraireexceptionnelle[0].horaire[0].horaire;
      }else{
        this.horairessuppFranchises = [];
      }

      if(result.details[0].horairesupp.listhoraireexceptionnelle.length > 0){
        this.horairessuppFranchisesJour =  result.details[0].horairesupp.listhoraireexceptionnelle[0].horaire
      }else{
        this.horairessuppFranchisesJour = [];
      }

      this.horairexceptionnels =  result.details[0].horairexceptionnels.listhoraireexceptionnelle;
      // console.log(JSON.stringify(this.horairexceptionnels));

      this.telephone = result.details[0].numerotel.listnumero;
      this.adresse = result.details[0].adresse.adresse;
      this.description = result.details[0].description.description;
      this.lienrdv = result.details[0].rendezvous.urlValues
      this.urlsite = result.details[0].urlsite.urlsite;
      this.codemagasin = result.details[0].codemagasin.codemagasin;
      this.nbfrachise = result.nbfrachise;
      this.statuts = result.details[0].statuts;
      this.Annee= result.details[0].OpenInfo_opening_date.OpenInfo_opening_date.Annee
      this.Mois= result.details[0].OpenInfo_opening_date.OpenInfo_opening_date.Mois
      this.Jours= result.details[0].OpenInfo_opening_date.OpenInfo_opening_date.Jours
      this.listattributes = result.details[0].attributes.listattribute
      this.OpenInfo_status = result.details[0].OpenInfo_status
      this.Listservices = result.details[0].services.listservices
      for (let i = 0; i < this.Listservices.length; i++) {
        this.lengthtotal =  this.lengthtotal + this.Listservices[i].Services.length
      }
      if (result.details[0].categorie) {
        this.service = result.details[0].categorie;
        this.categorieprincipal = result.details[0].categorie[0]
        this.etatvalidationcatp = result.details[0].categorie[0].etatvalidation
        this.listcategories = result.details[0].categorie
        let listCats = this.CatForm.get("listCat") as FormArray;
        listCats.clear()
        for (let i = 0; i < this.service.length; i++) {
          if(this.service[i].type =='additionalCategories')
          {
            listCats.push(
              new FormGroup( {
                  displayName: new FormControl(this.service[i].displayName),
                  categorieId: new FormControl(this.service[i].categorieId),
                  type: new FormControl(this.service[i].type),
                  etatvalidation: new FormControl(this.service[i].etatvalidation),
                })
            );
          }

        }
      }
      if(result.details[0].zonedesservies)
      {
        this.listzone = result.details[0].zonedesservies.listzone
      }
      if (result.details[0].listlibelle != null) {
        this.libelles = result.details[0].listlibelle[0].libelle_value;
      }

      this.listusers = result.details[0].utilisateur;
       this.ouverture = result.details[0].ouverture;
      this.TypeUsers = result.details[0].role;
      this.email = result.details[0].email;
      this.google = result.details[0].google;
      this.maps = result.details[0].maps;
      if(result.details[0].adwPhone != null)
      {
        this.adwPhone = result.details[0].adwPhone.nationalNumber;
      }
      this.produits = result.details[0].produits
      this.productlength = this.produits.length
      if (result.details[0].services.length != 0) {
        this.CategorieServices = result.details[0].services.listservices;
      }
      this.listGroupe = result.details[0].etiquette;
      this.numerotel = result.details[0].numerotel.listnumero;
      let ListNumero = this.ModifNumeroForm.get("numerotel") as FormArray;
      ListNumero.clear()
      for (let i = 0; i < this.numerotel.length; i++) {

        ListNumero.push(
          new FormGroup({
            phone: new FormControl(this.numerotel[i].phone.number),
            etatvalidation : new FormControl(this.numerotel[i].phone.etatvalidation),
          })
        );
      }
      if (result.details[0].listlibelle != null) {
        this.listlibelle = result.details[0].listlibelle;
        let Listlibelles = this.ModifLibelleForm.get("listlibelle") as FormArray;
        Listlibelles.clear()
        for (let i = 0; i < this.listlibelle.length; i++) {
            Listlibelles.push(
              new FormGroup({
                libelle_value: new FormControl(this.listlibelle[i].libelle_value),
                etatvalidation: new FormControl(this.listlibelle[i].etatvalidation),
              })
            );
        }
      }

      this.etatsm = result.details[0].horaire.listhoraire[7][0].etatsm;
      for (let i = 0; i < this.horaires.length; i++) {
        let horaire = this.fb.array([]);
        for (let j = 0; j <this.horaires[i].horaire.length; j++) {
          horaire.push(
            new FormGroup({
              heurdebut: new FormControl(this.horaires[i].horaire[j].heurdebut),
              heurfin: new FormControl(this.horaires[i].horaire[j].heurfin),
              id: new FormControl(this.horaires[i].horaire[j].id),
              etatvalidation: new FormControl(this.horaires[i].horaire[j].etatvalidation),
            })
          );
        }
        let indexOfJours = LisJours.value.findIndex(
          (element) => element.jours === this.horaires[i].jours
        );
        if (indexOfJours != -1) {
          LisJours.removeAt(indexOfJours);
        }
        if (horaire.length == 0) {
          horaire.push(
            new FormGroup({
              heurdebut: new FormControl(""),
              heurfin: new FormControl(""),
              id: new FormControl(""),
              etatvalidation: new FormControl(""),
            })
          );
        }
        LisJours.push(
          new FormGroup({
            jours: new FormControl(this.horaires[i].jours),
            etat: new FormControl(this.horaires[i].etat),
            etatvalidation: new FormControl(this.horaires[i].etatvalidation),
            horaire: horaire,
          })
        );
      }

    });


  }

  Listficheslogo = []
  SendHoraireExceptional() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );


    this.FranchiseService.SendHoraireExceptional(this.horairexceptionnels, this.Listficheslogo, this.fichindividuel).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.FermerAdd()
        this.addhorairexceptionnels();
      }
    }
    ),
      (error) => {
        this._Notificationservice.error("Erreur", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };
  }



  Change(value: boolean) {
    this.change = value;
  }
  FermerAdd() {
    this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.Ordrefiche, "");
    this.modalService.dismissAll("Dismissed after saving data");
    this.ProduitForm.reset();
    this.AddPhotoForm.reset();
    this.FicheDissocier = false
  }
  FermerAddhoraire() {
    this.modalService.dismissAll("Dismissed after saving data");
  }

  selectionnerfiche(etiquetteselected ,fiche)
  {


    if(this.etiquetteselected.Name_groupe == "LOCALISATION")
    {
      this.etiquetteselected.ettiquettes.forEach((val) => {

        var resultat = this.etiquetteselected.ettiquettes.find( item => item.status === true);
        if(resultat == undefined)
        {
          fiche.status = !fiche.status
        }
        else
        if(resultat != fiche)
        {
          resultat.status = false
          fiche.status = true
        }


        });
    }
    else  if(this.etiquetteselected.Name_groupe != "LOCALISATION")
    {
      fiche.status = !fiche.status
       this.etiquetteselected.ettiquettes.forEach((val) => {
    if (val.etiquettegroupe == fiche.etiquettegroupe)
    {
      val.status = fiche.status
      }
    });
    }


  }
  selectfiche() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.selectfiche(localStorage.getItem('idfiche_encours') ,this.etiquetteselected  ).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
         this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.modalService.dismissAll("Dismissed after saving data");

        }
      },

  ),
  (error) => {
    this._Notificationservice.error("Erreur", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };
  }
  deleteEtiquette(id_groupe, etiquettegroupe) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.deleteEtiquette(localStorage.getItem('idfiche_encours') , id_groupe , etiquettegroupe ).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
         this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };
  }
  adduser() {
    this.Ajoutuser = !this.Ajoutuser;
  }
  removeBloc(i: number, bloc_id) {
    const control = <FormArray>this.ModifNumeroForm.controls["numerotel"];
    if (bloc_id != "") {
      control.removeAt(i);
    }
  }
  removeLibelle(i: number, libelle_id) {
    const control = <FormArray>this.ModifLibelleForm.controls["listlibelle"];
    control.removeAt(i);
  }
  createphone(): FormGroup {
    return this.fb.group({
      phone: [""],
    });
  }
  createlibelle(): FormGroup {
    return this.fb.group({
      libelle_value: [""],
    });
  }
  createService(): FormGroup {
    return this.fb.group({
      name: [""],
      id: [""],
      serviceId: [""],
    });
  }
  createhoraire(): FormGroup {
    return this.fb.group({
      horaire_debut: [""],
      horaire_fin: [""],
    });
  }
  addNumero() {
    let numerotel = this.ModifNumeroForm.get("numerotel") as FormArray;
    numerotel.push(this.createphone());
  }
  addLibelle() {
    let listlibelle = this.ModifLibelleForm.get("listlibelle") as FormArray;
    listlibelle.push(this.createlibelle());
  }
  valuecheckbox;
  isAllSelected(item) {
    this.valuecheckbox = item.value;
    this.checklist.forEach((val) => {
      if (val.id == item.id) val.isSelected = !val.isSelected;
      else {
        val.isSelected = false;
      }
    });
  }
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", function () {}, false);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  getBlob(url) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(url);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  onSelect(event) {
    this.files_dropped.push(...event.addedFiles);
    const formData = new FormData();
    let listImages: any[];


    for (var i = 0; i < this.files_dropped.length; i++) {
      listImages = [];
      this.getBase64(this.files_dropped[i]).then((data) => {
        listImages.push(data);

      });
    }
    this.listUploadImages = listImages;
    if(this.files_dropped.length > 1)
    {
      this.checklist.forEach((val) => {
        if (val.id == 1) val.isDisabled = true;
        if (val.id == 2) val.isDisabled = false;
      });
    }
    else
    this.checklist.forEach((val) => {
      if (val.id == 1) val.isDisabled = false;
      if (val.id == 2) val.isSelected = false;
    });
  }
  onRemove(event) {
    this.files_dropped.splice(this.files_dropped.indexOf(event), 1);

    if(this.files_dropped.length == 0)
    {
      this.listUploadImages = []
    }
    if(this.files_dropped.length > 1)
    {
      this.checklist.forEach((val) => {
        if (val.id == 1) val.isDisabled = true;
        if (val.id == 2) val.isDisabled = true;

      });
    }

    else
    this.checklist.forEach((val) => {
      if (val.id == 1) val.isDisabled = false;
      if (val.id == 2) val.isDisabled = false;

    });
  }
  Modifhoraires() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.HorairesForm.value.user_id = localStorage.getItem("user_id");
    this.HorairesForm.value.fiche_id = this.idfiche;
    this.FranchiseService.ModifHoraires(this.HorairesForm.value).subscribe(
      (result) => {

        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
         this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");

          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
    );
  }
  onSubmit() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );

      this.AddPhotoForm.value.file = this.listUploadImages;


    this.AddPhotoForm.value.category = this.valuecheckbox;
    this.AddPhotoForm.value.user_id = localStorage.getItem("user_id");
    this.AddPhotoForm.value.fiche_id = this.idfiche;

    this.AddPhotoForm.value.type_photo = this.AddPhotoForm.value.type_photo.type;

    this.FranchiseService.AddPhoto(this.AddPhotoForm.value).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
    ),
      (error) => {
        this._Notificationservice.error("Erreur", "De création de photo", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };


      this.AddPhotoForm.reset()

      this.checklist.forEach((val) => {
        if (val.id == 1) val.isDisabled = false;

      });
  }
  ModifEtablissement(val) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.ModifEtablissement(val , this.idfiche).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error("Erreur", "De création de fiche", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };
  }
  Modifsite(val) {

    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.Modifsite(val ,this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error("Erreur", "De création de fiche", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };
  }
  Modiflienrdv(lienrdv) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
);
    this.FranchiseService.Modiflienrdv(lienrdv,this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error("Erreur", "De création de fiche", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
      };
  }
  ModifNumEtablissement() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.ModifNumero(
      this.ModifNumeroForm.value,
      this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "De modification de numéro de fiche",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  ModifLibelle() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.ModifLibelle(
      this.ModifLibelleForm.value,
      this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
           result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "De modification de libellé de l'établissement",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  ModifCode(storeCode) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.ModifCode(storeCode ,this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "De modification de code de magasin de l'établissement",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  ModifAdwPhone() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.ModifAdwPhone(
      this.ModifInfosE.value,
      this.idfiche
    ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "De modification de numero ADW de l'établissement",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  Modifdescription(description) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.Modifdescription(description,this.idfiche ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",

          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  Modifdateouverture() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.Modifdateouverture( this.DateouvertureForm.value,this.idfiche ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

       this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",

          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };
  }
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  createItem(): FormGroup {
    return this.fb.group({
      horaire_id: [""],
      horaire_debut: [""],
      horaire_fin: [""],
      horaire_etat: [""],
    });
  }
  addhoraires(indexJrs: string) {
    let arrayList = this.HorairesForm.get(indexJrs) as FormArray;
    arrayList.push(this.createItem());
  }
  deletehoraires(indexJrs: string, is) {
    let arrayList = this.HorairesForm.get(indexJrs) as FormArray;
    if (is != 0) {
      arrayList.removeAt(is);
    }
  }
  /*********************Horaires Supplémentaires*********** */
  gethoraires(id, title) {
    this.currentCategorie = title;
    this.currentdisplayName = id;
    this.Detailshoriares = true;
    this.horairessup = [
      {
        jours: "Lundi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Mardi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Mercredi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Jeudi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Vendredi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Samedi",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
      {
        jours: "Dimanche",
        etat: "",
        horaire: [{ heurdebut: "", heurfin: "", id: "" }],
      },
    ];
    let LisJours2 = this.HorairesSuppForm.get("Listhoraire") as FormArray;
    for (let i = 0; i < this.horairessup.length; i++) {
      let horaire = this.fb.array([]);
      for (let j = 0; j < this.horairessup[i].horaire.length; j++) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(
              this.horairessup[i].horaire[j].heurdebut
            ),
            heurfin: new FormControl(this.horairessup[i].horaire[j].heurfin),
            id: new FormControl(this.horairessup[i].horaire[j].id),
          })
        );
      }
      let indexOfJours = LisJours2.value.findIndex(
        (element) => element.jours === this.horairessup[i].jours
      );
      if (indexOfJours != -1) {
        LisJours2.removeAt(indexOfJours);
      }
      if (horaire.length == 0) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(""),
            heurfin: new FormControl(""),
            id: new FormControl(""),
          })
        );
      }

      LisJours2.push(
        new FormGroup({
          jours: new FormControl(this.horairessup[i].jours),
          etat: new FormControl(this.horairessup[i].etat),
          horaire: horaire,
        })
      );
    }
  }
  detailshoraire(item) {
    this.Currentcategoriehoraire = item.hoursTypeId;
    this.Detailshoriare = true;
    this.Detailshoriares = false;

    let horaires3 = item.horaire;

    let LisJours3 = this.HorairesdetailsForm.get("Listhoraire") as FormArray;

    for (let i = 0; i < horaires3.length; i++) {
      let horaire = this.fb.array([]);

      for (let j = 0; j < horaires3[i].horaire.length; j++) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(horaires3[i].horaire[j].heurdebut),
            heurfin: new FormControl(horaires3[i].horaire[j].heurfin),
            id: new FormControl(horaires3[i].horaire[j].id),
          })
        );
      }
      let indexOfJours = LisJours3.value.findIndex(
        (element) => element.jours === this.horaires[i].jours
      );
      if (indexOfJours != -1) {
        LisJours3.removeAt(indexOfJours);
      }
      if (horaire.length == 0) {
        horaire.push(
          new FormGroup({
            heurdebut: new FormControl(""),
            heurfin: new FormControl(""),
            id: new FormControl(""),
          })
        );
      }

      LisJours3.push(
        new FormGroup({
          jours: new FormControl(horaires3[i].jours),
          etat: new FormControl(horaires3[i].etat),
          horaire: horaire,
        })
      );
    }
  }
  fermerdetails() {
    this.Detailshoriares = false;
    this.Detailshoriare = false;
  }
  get_Categorie() {
    this.FranchiseService.get_Categorie({ fiche: this.idfiche }).subscribe(
      (result) => {
        this.Groupe_categorie = result.data;
        this.Groupe_horscategorie = result.details;
      }
    );
  }
  HorairesSupp() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.HorairesSuppForm.value.hoursTypeId = this.currentCategorie;
    this.HorairesSuppForm.value.displayName = this.currentdisplayName;
    this.HorairesSuppForm.value.user_id = localStorage.getItem("user_id");
    this.HorairesSuppForm.value.fiche_id = this.idfiche;
    this.FranchiseService.HorairesSupp(this.HorairesSuppForm.value).subscribe(
      (result) => {


        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message ,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );

          this.get_Categorie();
          this.Detailshoriares = false;
        }
      }),
        (error) => {
          this._Notificationservice.error(
            "Erreur",
            "Erreur",
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.errorHandler(error);
        };



      }
  HorairesDetails() {
    this.HorairesdetailsForm.value.hoursTypeId = this.Currentcategoriehoraire;
    this.HorairesdetailsForm.value.user_id = localStorage.getItem("user_id");
    this.HorairesdetailsForm.value.fiche_id = this.idfiche;
    this.FranchiseService.HorairesSupp(
      this.HorairesdetailsForm.value
    ).subscribe((result) => {

      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message ,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

        this.get_Categorie();
        this.Detailshoriare = false
      }
    }),
      (error) => {
        this._Notificationservice.error(
          "Erreur",
          "Erreur",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.errorHandler(error);
      };



  }
  delete_horairesupp(hoursTypeId) {
    this.FranchiseService.deletehoraires({
      hoursTypeId: hoursTypeId,
      fiche_id: this.idfiche,
      user_id: localStorage.getItem("user_id"),
    }).subscribe((result) => {
      if (result.succes == false) {
        this._Notificationservice.error("Erreur",
           result.message, {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

        this.get_Categorie();
        this.CategorieForm.reset();
        this.Detailshoriares = false;
        this.Detailshoriare = false;
      }
    });
  }
  listcategoriesModal
  /*******************fin horaires supplementaires******** */
  /********************services*********** */
  SearchEtablissement(cat) {
    this.FranchiseService.getCategorie(cat).subscribe((result) => {
      this.listcategoriesModal = result.data;
    });
  }
  AddCategorie() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.servicesCat.forEach((service) => {
      if (service.etat == true) {
        this.CategorieForm.value.listServices.push(service);
      }
    });
    this.CategorieForm.value.user_id = localStorage.getItem("user_id");
    this.CategorieForm.value.categorieId = this.CategorieForm.value.Name_cat.categorieId;
    this.CategorieForm.value.fiche_id = this.idfiche;
    this.FranchiseService.AddCategorie(this.CategorieForm.value).subscribe(
      (result) => {
        if (result.succes == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );

          this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.CategorieForm.reset();
          this.addservice = false;
        }
      }
    );
  }
  addService(idCat, nameCat) {
    this.addservice = true;
    this.CurrentnameCat = nameCat;
    this.CurrentIdCat = idCat;
    this.FranchiseService.getservicesCat(this.idfiche, idCat).subscribe(
      (result) => {
        this.servicesCat = result.data;
        this.servicesCat.forEach((element) => (element.etat = false));
      }
    );
  }
  AddServicePerso() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.servicesCat.forEach((service) => {
      if (service.etat == true) {
        this.ServicePersoForm.value.listService.push(service);
      }
    });
    this.ServicePersoForm.value.fiche_id = this.idfiche;

    this.ServicePersoForm.value.user_id = localStorage.getItem("user_id");

    this.ServicePersoForm.value.Name_cat = {
      displayName: this.CurrentnameCat,
      categoryId: this.CurrentIdCat,
    };
    this.ServicePersoForm.value.listServices = this.ServicePersoForm.value.listService;

    this.FranchiseService.AddServicePerso(
      this.ServicePersoForm.value
    ).subscribe((result) => {
      if (result.succes == false) {
        this._Notificationservice.error(
          "Erreur",
          "D'ajout de catégorie à l'établissement",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          "La catégorie de l'établissement est ajoutée avec succes",
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
        this.addservice = false;
        this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      }
    });
  }
  deleteCategorie(cat) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.deleteCategorie(this.idfiche, cat).subscribe(
      (result) => {
        if (result.succes == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
    ),
      (this.delete_Cat = false);
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
  }
  changeservice(item) {
    this.services.forEach((service) => {
      if (item == service) {
        service.etat = !service.etat;
      }
    });
  }
  add_service_perso() {
    let listService = this.ServicePersoForm.get("listService") as FormArray;
    if (listService.value.length >= 1) {
      for (let i = 0; i < listService.value.length; i++) {
        if (listService.value[listService.value.length - 1].name != "") {
          listService.push(this.createService());
        }
      }
    } else listService.push(this.createService());
  }
  add_service_persocat() {

    let listServices = this.CategorieForm.get("listServices") as FormArray;

    if (listServices.value.length >1) {
      for (let i = 0; i < listServices.value.length; i++) {
        if (listServices.value[listServices.value.length - 1].name != "") {
          listServices.push(this.createService());
        }
      }
    }
     else listServices.push(this.createService());
  }
  removeServicePerso(i: number) {
    const control = <FormArray>this.ServicePersoForm.controls["listService"];
    control.removeAt(i);
  }
  FermerAddServicePerso() {
    this.addservice = false;
  }
  FermerdeleteCat() {
    this.delete_Cat = false;
  }
  FermerAddCatPerso() {
    this.add_Cat = false;
  }
  add_service_Cat() {
    this.add_Cat = true;
    this.addservice = false;
  }
  delete_service(id, Cat_Id) {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.delete_service(id, Cat_Id, this.idfiche).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.showdetailS = false;
        }
      }
    );
  }
  ModifService() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.ModifServiceForm.value.user_id = localStorage.getItem("user_id");
    this.ModifServiceForm.value.fiche_id = this.idfiche;
    this.ModifServiceForm.value.serviceId = this.current_Service_Id;
    this.ModifServiceForm.value.idCat = this.current_Service_Cat_Id;
    this.FranchiseService.ModifService( this.ModifServiceForm.value,this.ModifServiceForm.value.serviceId ).subscribe((result) => {
      if (result.success == false) {
        this._Notificationservice.error(
          "Erreur",
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );
      } else if (result.success == true) {
        this._Notificationservice.success(
          "success",
          result.message,
          {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          }
        );

        this.showdetailS = false;
        this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      }
    });
  }
  FermerdetailsService() {
    this.showdetailS = false;
  }
  EditCat(Categorie_value) {
    this.editable == false;
  }
  showdetails(id, name, catId) {
    this.showdetailS = true;
    this.currentService = name;
    this.current_Service_Id = id;
    this.current_Service_Cat_Id = catId;
    this.FranchiseService.detailService(id).subscribe((result) => {
      this.PrixService = result.data.prix_service;
      this.DescriptionService = result.data.description_service;
      this.typeservice = result.data.type_service;
    });
  }
  onOptionsSelected(selected) {
    if (selected == "Aucun prix" || selected == "Gratuit") {
      this.disabled = true;
    } else this.disabled = false;
  }
  onChangecategorie(evt) {
    this.selectedOption = evt.categoryId;
    this.FranchiseService.onChangecategorie(
      this.idfiche,
      this.selectedOption
    ).subscribe((result) => {
      this.servicesCat = result.data;
      this.servicesCat.forEach((element) => (element.etat = false));
    });
  }
  changeserviceCat(item) {
    this.servicesCat.forEach((service) => {
      if (item == service) {
        service.etat = !service.etat;
      }
    });
  }
  /************* fin services************* */

  /**************produit***********/
  onValueChange(value: boolean) {
    this.valueChange = value;
  }
  onChangeOffre(evt) {
    this.setOffre = evt.calltoaction;
  }
  fermeraddprod()
  {
    this.ProduitForm.reset();
    this.showaddProdform = false
    this.photo_produit = ''
    this.setOffre = "Aucun"
    this.DataLogo =""
    this.id_produit =""
  }
  addprod(typeaction , produit){
    this.typeaction = typeaction
    this.showaddProdform = true
  }
  editprod(typeaction , produit){
      this.id_produit = produit.produit_id
      this.typeaction = typeaction
      this.Description_produit = produit.Description_produit;
      this.Nom_produit = produit.Nom_produit;
      this.file_produit =  produit.file
      this.photo_produit = produit.file;
      this.Categorie_produit = produit.Categorie_produit;
      this.Prix_maximal = produit.Prix_maximal;
      this.Prix_minimal = produit.Prix_minimal;
      this.Prix_produit = produit.Prix_produit;
       this.lien_produit =  produit.lien_produit;
      if( produit.calltoaction != null)
      {
        this.calltoaction = produit.calltoaction;
        this.setOffre = this.calltoaction
      }
      else
      {
        this.calltoaction = "Aucun"
      }

      if(this.Prix_maximal != null && this.Prix_minimal != null )
      {
        this.gamme_prix = true
      }
      else
      this.gamme_prix = false
       this.showaddProdform = true
      }
  deleteproduit()
  {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.deleteproduit(localStorage.getItem('idfiche_encours') ,this.id_produit).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.showaddProdform = false
          this.getlistcategories()
          this.getlistproduits('' , this.id_produit)
          this.ProduitForm.reset()

        }
      }
    ),
      (error) => {
        this._Notificationservice.error("Erreur", "De création de produit", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
        this.addservice = false;
        this.ProduitForm.reset();
      };
          this.setOffre = "Aucun"
          this.calltoaction= "Aucun"
          this.DataLogo =""
          this.id_produit =""
          this.photo_produit = ''
  }
  AddProduit() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    if (this.DataLogo) {
      let cimage = this.DataLogo.replace(/\+/g, "%2B");
      this.ProduitForm.value.photo_produit = cimage;
    }
    else this.ProduitForm.value.photo_produit =   this.file_produit
    this.ProduitForm.value.produit_id = this.id_produit
    if( this.ProduitForm.value.Categorie_produit = 'Créer une catégorie')
    {
      this.ProduitForm.value.Categorie_produit = this.ProduitForm.value.New_Categorie
    }
    if(this.Categorie_produit.Categorie_produit != 'Créer une catégorie')
    {
      this.ProduitForm.value.Categorie_produit = this.Categorie_produit.Categorie_produit
    }
    if(this.ProduitForm.value.calltoaction.calltoaction)
    {
      this.ProduitForm.value.calltoaction =  this.ProduitForm.value.calltoaction.calltoaction
    }
    else this.ProduitForm.value.calltoaction = this.calltoaction
    this.ProduitForm.value.user_id = localStorage.getItem("user_id");
    this.ProduitForm.value.media_type = "photo";
    this.ProduitForm.value.id_fiche = this.idfiche;
    this.FranchiseService.AddProduit(this.ProduitForm.value).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.showaddProdform = false
          this.getlistcategories()
          this.getlistproduits('' , this.id_produit)
          this.ProduitForm.reset()
          this.setOffre = "Aucun"
          this.DataLogo =""
          this.id_produit =""
          this.photo_produit = ''
        }
      }
    ),
      (error) => {
        this._Notificationservice.error("Erreur", "", {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        });
        this.errorHandler(error);
        this.addservice = false;
        this.ProduitForm.reset();
      };
      this.id_produit =""
      this.setOffre = "Aucun"
      this.calltoaction= "Aucun"
      this.showaddProdform = true
  }
  tabchange(index , id_Categorie)
  {
    this.listcategoriesproduits = this.listcategoriesproduits.map((tab, i) => i === index ? { ...tab, active: true } : { ...tab, active: false });
    this.getlistproduits(index , id_Categorie)
  }
  getlistproduits(index , id_Categorie) {
      this.FranchiseService.getlistproduits(localStorage.getItem('idfiche_encours') , id_Categorie).subscribe(
        (result) => {
          this.listproduits = result.data
        }
    )
    }
  getlistcategories() {
      this.listcategoriesproduits =[ {
        Categorie_produit: 'Tous les produits',
        active: true,
        id_Categorie : 0

      },]
      this.listcategoriesp =[ {
        Categorie_produit: 'Créer une catégorie',
        active: true,
        id_Categorie : 0

      },]

        this.FranchiseService.getlistcategories(localStorage.getItem('idfiche_encours')).subscribe(
          (result) => {

            result.data.forEach(val => {
              val.active = false

              this.listcategoriesproduits.push(val)
              this.listcategoriesp.push(val)
            }

            )
            this.getlistproduits(localStorage.getItem('idfiche_encours') ,0)
          } )
  }
  Changecategorie(evt) {
     this.catselected = evt.Categorie_produit
  }
  /**********fin produit************/
  /******* ***zone************ */
  onChangezone(evt) {
    var resultat = this.listzone.find( item => item.description === evt.description);
    if(resultat == undefined)
    {
      this.listzone.push(evt)
    }
    else
    return  this.listzone
    this.selectedzone= []
    this.zonedesservies = []
 }
  getListzonedesservies(zone){
    this.FranchiseService.getListzonedesservies(localStorage.getItem('idfiche_encours') , zone).subscribe(
      (result) => {
      this.zonedesservies = result.data })
  }
  AddZone()
  {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
   this.FranchiseService.onChangezone(localStorage.getItem('idfiche_encours') , this.listzone).subscribe(
        (result) => {
          if (result.success == false) {
            this._Notificationservice.error(
              "Erreur",
              result.message,
              {
                id: "InfoAuth",
                timeOut: 6000,
                animate: "fromRight",
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 100,
                theClass: "auth",
              }
            );
          } else if (result.success == true) {
            this._Notificationservice.success(
              "success",
              result.message,
              {
                id: "InfoAuth",
                timeOut: 6000,
                animate: "fromRight",
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 100,
                theClass: "auth",
              }
            );
            this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
            this.modalService.dismissAll("Dismissed after saving data");
          }
        }
    ),
    (error) => {
      this._Notificationservice.error("Erreur", "De modification de zones desservies", {
        id: "InfoAuth",
        timeOut: 6000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      });
      this.errorHandler(error);
    };
  }
  deletezone(zone) {
    this.listzone.splice(zone, 1);
  }
  deleteListzone() {
    this.listzone = [];
  }
  /**************** fin zone***************/
  /*******attribut*********/
  changeattribut(item) {
    for (let i = 0; i < this.listeAttributs.length; i++) {
      this.listeAttributs[i].details.forEach((attribut) => {
        if (item == attribut) {
          if(attribut.etat == 'true')
          {
            attribut.etat = 'Closed'
          }
          else   if(attribut.etat == 'Closed')
          {
            attribut.etat = 'false'
          }

          else   if(attribut.etat == 'false')
          {
            attribut.etat = 'true'
          }
        }

      });
    }
  }
  getListAttributs(searchAttribut) {
    this.FranchiseService.getListAttributs(localStorage.getItem('idfiche_encours') , searchAttribut).subscribe(
      (result) => {
        this.listeAttributs = result.data
      }
    )
  }
  sendAttribut(){
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.sendAttribut(localStorage.getItem('idfiche_encours') ,this.listeAttributs , localStorage.getItem("user_id") ).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", "", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };

  }
  /************* */

  /***********Adresse********** */
  getAdresselocality() {
    this.stations = [];
    this.FranchiseService.getAdresselocality(localStorage.getItem('idfiche_encours')).subscribe(
      (result) => {
        let res = result.data;
        this.stations.push({
          name: res.adresse,
          lat: res.location.lat,
          lng: res.location.lng,
        });

        if (result.data.listligne != null) {

          this.listligne = result.data.listligne;
          let listligne = this.AdresseForm.get("listligne") as FormArray;
          listligne.clear()
          for (let i = 0; i < this.listligne.length; i++) {
            listligne.push(
                new FormGroup({
                  ligne_value: new FormControl(this.listligne[i].ligne_value),
                })
              );
          }
        }


         this.currentpays = result.data.pays;
         this.currentAdress = result.data.adresse;
         this.currentCodePostal =result.data.codepostal;
         this.currentVille = result.data.ville;



         this.createStations();
     //    this.onMapReady(map);

  }
    );



      this.map.panTo(new L.LatLng(36.856600799999995, 10.194115));



  }
  sendAdresse() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.FranchiseService.sendAdresse(localStorage.getItem('idfiche_encours') , this.AdresseForm.value).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
          this.modalService.dismissAll("Dismissed after saving data");
        }
      }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", "", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };
  }
  deleteAdresse() {
    this.showdeletetext = true;
    this.currentAdress = "";
    this.currentCodePostal = "";
    this.currentVille = "";
  }
  createligne(): FormGroup {
    return this.fb.group({
      ligne_value: [""],
    });
  }
  addLigne() {
    let listligne = this.AdresseForm.get("listligne") as FormArray;
    listligne.push(this.createligne());
  }
  /************fin adress */
  /********************Fermeture fiche*********** */
  Fermer_fiche_temporaire()
  {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.OpenInfo_status="CLOSED_TEMPORARILY"
    this.FranchiseService.Fermer_fiche_temporaire(localStorage.getItem('idfiche_encours') , this.OpenInfo_status).subscribe(
        (result) => {
          if (result.success == false) {
            this._Notificationservice.error(
              "Erreur",
              result.message,
              {
                id: "InfoAuth",
                timeOut: 6000,
                animate: "fromRight",
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 100,
                theClass: "auth",
              }
            );
          } else if (result.success == true) {
            this._Notificationservice.success(
              "success",
              result.message,
              {
                id: "InfoAuth",
                timeOut: 6000,
                animate: "fromRight",
                showProgressBar: true,
                pauseOnHover: false,
                clickToClose: true,
                maxLength: 100,
                theClass: "auth",
              },
            );
            this.getListFranchise(null, "", false, false,"");
            this.fermeturefiche =  true,
            this.modalService.dismissAll("Dismissed after saving data");
          }
        }
    ),
    (error) => {
      this._Notificationservice.error("Erreur", "De fermeture de fichier", {
        id: "InfoAuth",
        timeOut: 6000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      });
      this.errorHandler(error);
    };

  }
  Fermer_fiche_definitivement()
  {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.OpenInfo_status="CLOSED_PERMANENTLY"
    this.FranchiseService.Fermer_fiche_temporaire(localStorage.getItem('idfiche_encours') , this.OpenInfo_status).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(null, "", false, false,"");
        }
      }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", "De fermeture de fichier", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };

  }

  openetablissement()
  {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 3000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    this.OpenInfo_status="OPEN"
    this.FranchiseService.Fermer_fiche_temporaire(localStorage.getItem('idfiche_encours') , this.OpenInfo_status).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error(
            "Erreur",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
        } else if (result.success == true) {
          this._Notificationservice.success(
            "success",
            result.message,
            {
              id: "InfoAuth",
              timeOut: 6000,
              animate: "fromRight",
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: true,
              maxLength: 100,
              theClass: "auth",
            }
          );
          this.getListFranchise(null, "", false, false,"");
        }
      }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", "Erreur", {
      id: "InfoAuth",
      timeOut: 6000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    });
    this.errorHandler(error);
  };

  }


  /***************fin fermeture fiche*************** */
/**************Modification de catégorie*********** */
add_cat() {
  let listCat = this.CatForm.get("listCat") as FormArray;
  if (listCat.value.length >= 1) {
    for (let i = 0; i < listCat.value.length; i++) {
      if (listCat.value[listCat.value.length - 1].displayName != "") {
        listCat.push(this.createCat());
      }
    }
  } else listCat.push(this.createCat());
}
removecat(i: number, Service_id) {
  const control = <FormArray>this.CatForm.controls["listCat"];
  control.removeAt(i);
}
createCat(): FormGroup {
  return this.fb.group({
    displayName :[''],


  });
}
Modifcategorie() {

   this._Notificationservice.info(
    "Merci de patienter!",
    "En cours de traitement",
    {
      id: "InfoAuth",
      timeOut: 3000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    }
  );
  this.CatForm.value.fiche_id = this.idfiche;
  this.CatForm.value.user_id = localStorage.getItem("user_id");
  if(this.CatForm.value.Catprincipal.displayName != undefined)
  {
    this.CatForm.value.Catprincipal = this.CatForm.value.Catprincipal
    this.CatForm.value.Catprincipal = {
      displayName: this.CatForm.value.Catprincipal.displayName,
      categoryId: this.CatForm.value.Catprincipal.categorieId,
      type:"primaryCategory"
    };
  }
  else
  {
    this.CatForm.value.Catprincipal = {
      displayName: this.categorieprincipal.displayName,
      categoryId: this.categorieprincipal.categorieId,
      type:this.categorieprincipal.type
    };
  }
  this.CatForm.value.listCat.forEach((val ,) => {
    if (val.displayName.displayName != undefined)
    {
      this.CatForm.value.listCat.push({displayName: val.displayName.displayName , categoryId : val.displayName.categoryId  , type : "additionalCategories" })
     this.categorie.push({displayName: val.displayName.displayName , categoryId : val.displayName.categoryId  , type : "additionalCategories" })
    }
    else if(val.displayName.displayName == undefined)
    {
      this.categorie.push({displayName: val.displayName , categoryId : val.categorieId  , type : "additionalCategories" })
    }
  })
  this.CatForm.value.listCat = this.categorie
   this.FranchiseService.Modifcategorie(this.CatForm.value).subscribe((result) => {
    if (result.succes == false) {
      this._Notificationservice.error(
        "Erreur",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } else if (result.success == true) {
      this._Notificationservice.success(
        "success",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      this.addservice = false;
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      this.modalService.dismissAll("Dismissed after saving data");
    }
  });
}
/************fIN CATEGORIE************** */
  ngAfterViewInit(): void {

    let controlBlurs: Observable<
      any
    >[] = this.formInputElements.map((formControl: ElementRef) =>
      Observable.fromEvent(formControl.nativeElement, "blur")
    );

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.ProduitForm.valueChanges, ...controlBlurs)
      .debounceTime(800)
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.ProduitForm
        );
      });
  }
  GetDataLogo(data: any) {
    this.DataLogo = data;
    this.ProduitForm.controls.photo_produit.markAsDirty();
}
setData(fichindividuel){
  this.fichindividuel = localStorage.getItem('idfiche_encours');
}
somefunction(datfichindividuela){
  this.transfereService.setData(localStorage.getItem('idfiche_encours'));
  this.router.navigateByUrl('/tableaux-de-bord');//as per router
}
/********utilisateurs***************** */
Modifproprietaire($event ,user )
{
  this._Notificationservice.info(
    "Merci de patienter!",
    "En cours de traitement",
    {
      id: "InfoAuth",
      timeOut: 3000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    }
  );
  this.FranchiseService.Modifproprietaire( localStorage.getItem('idfiche_encours') , $event.name , user.userid , user.email , user.lastname  ).subscribe((result) => {
    if (result.succes == false) {
      this._Notificationservice.error(
        "Erreur",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } else if (result.success == true) {
      this._Notificationservice.success(
        "success",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
    }
  });

}

add_user(email ,role )
{
  this._Notificationservice.info(
    "Merci de patienter!",
    "En cours de traitement",
    {
      id: "InfoAuth",
      timeOut: 3000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    }
  );
  this.FranchiseService.add_user( localStorage.getItem('idfiche_encours') , email , role.name  ).subscribe((result) => {
    if (result.succes == false) {
      this._Notificationservice.error(
        "Erreur",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } else if (result.success == true) {
      this._Notificationservice.success(
        "success",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      this.modalService.dismissAll("Dismissed after saving data");
    }
  });

}

DissocierFiche()
{
  this._Notificationservice.info(
    "Merci de patienter!",
    "En cours de traitement",
    {
      id: "InfoAuth",
      timeOut: 3000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    }
  );
  this.FranchiseService.DissocierFiche( localStorage.getItem('idfiche_encours') , localStorage.getItem('user_id')  ).subscribe((result) => {
    if (result.succes == false) {
      this._Notificationservice.error(
        "Erreur",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } else if (result.success == true) {
      this._Notificationservice.success(
        "success",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      this.modalService.dismissAll("Dismissed after saving data");
    }
  });

}

Deleteuser(user_id)
{
  this._Notificationservice.info(
    "Merci de patienter!",
    "En cours de traitement",
    {
      id: "InfoAuth",
      timeOut: 3000,
      animate: "fromRight",
      showProgressBar: true,
      pauseOnHover: false,
      clickToClose: true,
      maxLength: 100,
      theClass: "auth",
    }
  );
  this.FranchiseService.Deleteuser( localStorage.getItem('idfiche_encours') , user_id  ).subscribe((result) => {
    if (result.succes == false) {
      this._Notificationservice.error(
        "Erreur",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
    } else if (result.success == true) {
      this._Notificationservice.success(
        "success",
        result.message,
        {
          id: "InfoAuth",
          timeOut: 6000,
          animate: "fromRight",
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: true,
          maxLength: 100,
          theClass: "auth",
        }
      );
      this.getListFranchise(localStorage.getItem('idfiche_encours'), "", false, this.plusrecent, "");
      this.modalService.dismissAll("Dismissed after saving data");

    }
  });

}
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }
  filterlocationNameLength(listFranchises){

    for (let index = 0; index < listFranchises.length; index++) {

      if(listFranchises[index]['locationName'].length>30){
        listFranchises[index]['loc']= true;

    }
    else{

      listFranchises[index]['loc']= false;
  }

}
}
}
