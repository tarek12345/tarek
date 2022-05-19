import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {Location} from "@angular/common";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NavbarService } from "./navbar.service";
 import { NotificationsService } from "angular2-notifications";
 import { Validators } from "@angular/forms";
import { GenericValidator } from 'src/app/shared/generic-validator.service';
import { HttpErrorResponse } from "@angular/common/http";
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  role_id
  Createfiche: FormGroup;
  public listTitles: any[];
  public location: Location;
  Exist
  codepostal
  ville
  adresse
  detailsEtablissement :boolean = false
  demandeacces
  mapsurl
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  formInputElements: ElementRef[];
  keyword = 'adresse';
  ListPays= [];
  ListAdresse= [];
  ListAgence = [];
  ListCategorie: any;
  closeResult = "";
  public index = 0;
  constructor(
    location: Location,private element: ElementRef,public router: Router,private modalService: NgbModal,private fb: FormBuilder,
    private _Notificationservice: NotificationsService, private NavbarService: NavbarService
  ) {
    this.location = location;
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.validationMessages = {
      locationName: {
        required: "locationName  est obligatoire et ne peut être vide.",
        minlength: "locationName doit comporter au moins 3 caractères.",
        maxlength: "locationName ne doit pas dépasser 120 caractères.",
      },
    };
    this.Createfiche = this.fb.group({
      locationName: ["", [Validators.required, Validators.minLength(3) , Validators.maxLength(120)]],
      categorie: ["", [Validators.required]],
      Lieufiche: ["Oui"],
      payss: [""],
      adresse: ["", [Validators.required]],
      codepostal: ["", [Validators.required , Validators.pattern(/^-?(0|[0-9]\d*)?$/),] , ],
      ville:["", [Validators.required]],
      Agence_mm_adresse: [""],
      agence: [""],
      service_agence: [""],
      phone: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[0-9]\d*)?$/),
    ]],
      websiteUrl: [""],
      Email_fiche: ['' , [ Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/),]],
      copie_email: [''],
    });
  }
  open(AddFiche) {
    this.modalService
      .open(AddFiche, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  setDatafranchise(detailsfranchise) {
    this.detailsfranchise = detailsfranchise;
  }
  detailsfranchise() {
    this.router.navigateByUrl('/franchises');
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
  getListCategorie(val) {
    this.NavbarService.getCategorie(val).subscribe((result) => {
      this.ListCategorie = result.data;
    });
  }
  SearchEtablissement(Etab) {
    this.NavbarService.getEtablissement(Etab).subscribe((result) => {
      this.ListCategorie = result.data; 
    });
  }
  CategorieChange(val) {
    
      this.getListCategorie(val);
  }
  paysChange() {
      this.getListPays();
  }
  ngOnInit() {
    this.listTitles = ROUTES.filter((listTitle) => listTitle);
    this.role_id = localStorage.getItem('role_id')
  }
  LOGOUT() {
    this.router.navigate(["login"]);
  }
  onItemChange(value) {
    this.Exist = value
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }
    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return titlee.slice(18);
  }
  ChangeView(i) {
    this.index = this.index + 1;
  }
  getAgence() {
    this.NavbarService.getAgence({
      'pays': this.Createfiche.value.payss,
      'adresse': this.Createfiche.value.adresse,
      'codepostal': this.Createfiche.value.codepostal,
      'ville': this.Createfiche.value.ville,
     
    }).subscribe(
      (result) => {
        this.ListAgence = result.data
      }
    );
  }
  RetoursView() {
    this.index = this.index - 1;
  }
  Retourscreatefiche() {
    this.index = 0;
    this.detailsEtablissement = false
  }
  getdetailsEtablissement(event){
    this.detailsEtablissement = true
    this.NavbarService.getdetailsEtablissement({ locationName: event.locationName ,  adresse :event.adresse  , locationKey : event.locationKey }).subscribe((result) => {
    this.demandeacces = result.data.demandeacces
    this.mapsurl = result.data.mapsurl

    });
  }
  onKey(event: any) { 
    this.codepostal = event.target.value
    this.NavbarService.getlocality({codepostal : this.codepostal , pays : this.Createfiche.value.payss}).subscribe((result) => {
      this.ville = result.data[0].ville;
    });
  }
  onKeyadresse(event: any) { 
    this.adresse = event.target.value
    this.NavbarService.getlocality({adresse : this.adresse , pays : this.Createfiche.value.payss}).subscribe((result) => {
      this.ListAdresse = result.data
    });
  }
  selectEvent(adress)
  {
   this.codepostal = adress.codepostal;
   this.ville = adress.ville;
  }
  onKeyVille(event: any) { 
    this.ville = event.target.value
    this.NavbarService.getlocality({ville : this.ville}).subscribe((result) => {
      this.codepostal = result.data[0].codepostal;
    });
  }
  getListPays() {
    this.NavbarService.getListPays().subscribe((result) => {
      this.ListPays = result.message;
    });
  }
  FinProcess() {
    this.index = 0;
  }
  AddFiches() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
      {
        id: "InfoAuth",
        timeOut: 30000,
        animate: "fromRight",
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: true,
        maxLength: 100,
        theClass: "auth",
      }
    );
    if(this.Createfiche.value.adresse.adresse)
    {
    this.Createfiche.value.adresse =   this.Createfiche.value.adresse.adresse
    }
    else 
    this.Createfiche.value.adresse = this.Createfiche.value.adresse
    this.Createfiche.value.pays = this.Createfiche.value.payss;
    this.NavbarService.AddFranchise(this.Createfiche.value).subscribe(
      (result) => {
        if(result.success == true)
        {
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
          this.index = 0;
          this.modalService.dismissAll("Dismissed after saving data");
      
        }
      else  if(result.success == false)
   
        {
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
          this.index = 0;
          this.modalService.dismissAll("Dismissed after saving data");
      
        }
      },
      (error)=>
      {
        this._Notificationservice.error(

          "Erreur",
          "De création de fiche",
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
     this.errorHandler ( error);
      } 
    );
    this.Createfiche.reset()
    this.ville =''
    this.codepostal =''
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }
  ngAfterViewInit(): void {
    Observable.merge(this.Createfiche.valueChanges)
      .debounceTime(800)
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.Createfiche
        );
      });
  }

}
