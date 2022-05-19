import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { FranchiseService } from "../../franchises/franchise.service";
import { HttpErrorResponse,} from "@angular/common/http";
import { Observable } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})

export class ProduitComponent implements OnInit {

  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();

  valueChanged(){

    if (this.DataLogo) {
      let cimage = this.DataLogo.replace(/\+/g, "%2B");
      this.ProduitForm.value.photo_produit = cimage;
    }
    else this.ProduitForm.value.photo_produit =   this.file_produit
    this.ProduitForm.value.produit_id = this.id_produit
    if( this.ProduitForm.value.Categorie_produit == 'Créer une catégorie')
    {
      this.ProduitForm.value.Categorie_produit = this.ProduitForm.value.New_Categorie
    }
    if(this.ProduitForm.value.Categorie_produit != 'Créer une catégorie')
    {
      this.ProduitForm.value.Categorie_produit = this.Categorie_produit.Categorie_produit
    }
    if(this.ProduitForm.value.calltoaction.calltoaction)
    {
      this.ProduitForm.value.calltoaction =  this.ProduitForm.value.calltoaction.calltoaction
    }
    else this.ProduitForm.value.calltoaction = this.calltoaction
    this.ProduitForm.value.media_type = "photo";
    this.valueChange.emit(this.ProduitForm.value);
  }

  showaddProdform : boolean = false
  ProduitForm: FormGroup;
  addservice: boolean = false;
  catselected ="new"
  listcategoriesproduits = [
    {
    Categorie_produit: 'Tous les produits',
    active: true,
    id_Categorie : 0
  },
  ]
 /**************produit***********/
 valueChanges = false;
 typeaction
 private DataLogo: string = '0';
 photo_produit: string = '';
 file_produit
 calltoaction ="Aucun"
 id_produit
 Nom_produit;
 Description_produit;
 Categorie_produit
 Prix_maximal;
 Prix_minimal;
 Prix_produit;
 lien_produit
 setOffre = "Aucun"
 gamme_prix : boolean =false
 listcategories = []

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

  constructor(
    _http: HttpClient,
    public router: Router,
    private FranchiseService: FranchiseService,
    private _Notificationservice: NotificationsService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { 
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
  }

  ngOnInit(): void {
    this.getlistcategories()
  }





 /**************produit***********/
 onValueChange(value: boolean) {
  this.valueChanges = value;
}
onChangeOffre(evt) {
  this.setOffre = evt.calltoaction;
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
         
        } )
}
Changecategorie(evt) {
   this.catselected = evt.Categorie_produit
}

GetDataLogo(data: any) {
  this.DataLogo = data;
  this.ProduitForm.controls.photo_produit.markAsDirty();
}


/**********fin produit************/

Fermer() {
  this.modalService.dismissAll("Dismissed after saving data");
}
errorHandler(error: HttpErrorResponse) {
  return Observable.throw(error.message || "Sever Error");
}

}
