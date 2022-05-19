import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ServiceGlobalService } from "../service-global.service";
import { FranchiseService } from "../franchises/franchise.service";
import { NotificationsService } from "angular2-notifications";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { Validators } from "@angular/forms";
import { TransfereServiceService } from "../transfere-service.service";
import { PostsService } from "../posts/posts.service";


import { Router } from "@angular/router";
@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class PostsComponent implements OnInit {
  isMobile: boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  pictures: any[] = [];
  allStatus: any[] = [];
  ImagesAjoutes: Array<any> = [];
  galeriImages;
  fun_action = "Ajouter";
  isDisabledd = true
  time_fin
  time_debut
  code_post
  condition_post
  action_url;
  Lienaction;
  action_type ='';
  Type_post;
  topictype = "ALERT";
  Disabled : boolean = true;
  title_post =''
  description_post
  current_date_fin
  current_date_debut
  listGroupe = [];
  nouvellist = [];
  public loading: boolean = false;
  post_programme: boolean = false;
  isDisabled: boolean = false;
  AddPostForm: FormGroup;
  AddEtiquette: FormGroup;
  active2 = 0;
  active = "Tous";
  AjoutPost: boolean = false;
  detailsPost: boolean = false;
  showInfos: boolean = false;
  countfiche;
  liens_post
  Appelaction
  public listficheLocalisation = [];
  public listTagsCurrent = [];
  private FinalImagesArray = [];
  public TousPost = [];
  setOffre = "Aucun";
  calltoaction = "Aucun";
  catselected = "new";
  gamme_prix: boolean = false;
  Prix_produit = ""
  heure_evt: boolean = false;
  current_type_envoi 
  Prix_maximal;
  Prix_minimal;
  listTags = [];
  current_date_prog;
  post_id = "";
  Categorie_produit;
  listTimes = [];
  Offres = [
    { calltoaction: "Aucun", actiontype: "ACTION_TYPE_UNSPECIFIED" },
    { calltoaction: "Réserver", actiontype: "BOOK" },
    { calltoaction: "Commander en ligne", actiontype: "ORDER" },
    { calltoaction: "Acheter", actiontype: "SHOP" },
    { calltoaction: "En savoir plus", actiontype: "LEARN_MORE" },
    { calltoaction: "S'inscrire", actiontype: "SIGN_UP" },
    { calltoaction: "Appeler", actiontype: "CALL" },
  ];
  ListPost = [
    { Name: "Tous" },
    { Name: "Offres" },
    { Name: "Nouveauté" },
    { Name: "Événements" },
    { Name: "Produits" },
    { Name: "Corbeille" },
  ];

  TypeEnvoi = [
    { id: 1, name: "Tous (12 fiches)" },
    { id: 2, name: "Envoi ciblé" },
    { id: 3, name: "Envoi groupé" },
  ];
  public listFiches = [];
  specification = [];
  listcategoriesproduits = [
    {
      Categorie_produit: "Tous les produits",
      active: true,
      id_Categorie: 0,
    },
  ];
  listcategoriesp = [];
  selectedfiche ="0"
  constructor(
    private bsLocaleService: BsLocaleService,
    private fb: FormBuilder,
    public router: Router,
    private modalService: NgbModal,
    private transfereService:TransfereServiceService,
    private FranchiseService: FranchiseService,
    private _Notificationservice: NotificationsService,
    private ServiceGlobale: ServiceGlobalService,
    private PostsService: PostsService
    
    
  ) {

 


    this.selectedfiche = this.transfereService.getDatapost();  
    if(this.selectedfiche){

      console.log('***********' + this.selectedfiche)
        this.AjoutPost = true
        this.current_type_envoi = "Envoi ciblé"
    }
   else 
    {
      this.selectedfiche = ""
    }
    

    this.bsLocaleService.use("fr");
    this.isDisabled = true;
    this.AddPostForm = this.fb.group({
      type_envoi: ["", [Validators.required]],
      title_post : ["", [Validators.required]],
      description_post : [""],
      date_debut: [""],
      date_fin: [""],
      code_post: ["", [Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      liens_post: [""],
      condition_post: [""],
      post_programme: [""],
      date_programme: [""],
      time_fin: [""],
      time_debut: [""],
      listFiches: [],
      listGroupe: [],
      columnsToIgnore: [""],
      calltoaction: [""],
      Lienaction: [""],
      Appelaction: [""],
      Categorie_produit: [""],
      New_Categorie: [""],
      Prix_produit: [""],
      Prix_minimal: [""],
      Prix_maximal: [""],
      gamme_prix: [""],
      heure_evt: [""],
    });
    this.AddEtiquette = this.fb.group({
      Nom_etiquette: [""],
      Value_etiquette: [""],
    });
  }
  closeResult = "";
  public index = 0;
  TypeGroupe;
  etiquetteselected;
  postselected;
  typepopup;
  openetiquette(content3, type, etiquetteselected) {
    this.etiquetteselected = etiquetteselected;
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
  OpenTag(content4, item, type) {
   
    this.typepopup = type;
    this.postselected = item.post_id;
    this.modalService.open(content4, { size: "sm" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  open_apercu(contentapercu) {
    this.modalService.open(contentapercu, { size: "md" }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  isCollapsed = false;
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  ngOnInit(): void {
    this.getlistPost("Tous");
    this.getlistetiquette();
    this.getlistTime();
    this.getlistcategories();
    this.isMobile = this.width < this.largeWidth;

  }
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
  showcondition(){
    this.isCollapsed = !this.isCollapsed
  }
  showinfos() {
    this.showInfos = !this.showInfos;
  }
  selectfiche(etiquettegroupe, id_groupe) {
    this.listGroupe.forEach((fiche) => {
      if (fiche.id_groupe == id_groupe) {
        fiche.ettiquettes.forEach((etiquette) => {
          if (etiquette.etiquettegroupe == etiquettegroupe) {
            etiquette.status = true;
          }
        });
      }
    });
  }
  onChangeOffre(evt) {
    this.setOffre = evt.calltoaction;
    this.action_type = evt.actiontype;
  }
  Changecategorie(evt) {
    this.catselected = evt.Categorie_produit;
  }
  getlistcategories() {
    this.listcategoriesp = [
      {
        Categorie_produit: "Créer une catégorie",
        active: true,
        id_Categorie: 0,
      },
    ];
    this.FranchiseService.getlistcategories(
      localStorage.getItem("idfiche_encours")
    ).subscribe((result) => {
      result.data.forEach((val) => {
        val.active = false;
        this.listcategoriesp.push(val);
      });
    });
  }
  changestat(item) {
    this.listFiches.forEach((fiche) => {
      if (item == fiche) {
        fiche.status = !fiche.status;
      }
    });
  }
  AddPost() {
    this.ImagesAjoutes = [];
    this.pictures   = []
    this.FinalImagesArray = []
    this.galeriImages =[]
    this.imagesToAdd = []
    this.active2 = 0,
    this.post_id = "";
    this.AjoutPost = true;
    this.fun_action = "Ajouter";
    this.post_programme = false;
    this.topictype = "ALERT"
    this.resetForm();
    this.gamme_prix = false
  }
  RetoursPost() {
    this.modalService.dismissAll("Dismissed after saving data");
    this.AjoutPost = false;
    this.resetForm();
    this.active = "Tous";
    this.getlistPost("Tous");
    this.getlistetiquette();
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  private imagesToDelete = [];
  private imagesToAdd = [];
  private imageapercu
  getAllWhatWeWillSend() {
    
    this.FinalImagesArray = []
    this.imagesToAdd = []
    let hash = Object.create(null);
    for (let j = 0; j < this.ImagesAjoutes.length; j++) {
      if (!hash[this.ImagesAjoutes[0].attachement_nom]) {
        hash[this.ImagesAjoutes[0].attachement_nom] = true;
        this.imagesToAdd.push({
          objet: this.ImagesAjoutes[0],
        });
      }
    }
    this.FinalImagesArray = this.imagesToDelete.concat(this.imagesToAdd);

  }
  post_type(evt) {

    if(this.selectedfiche != '')
    {
      this.current_type_envoi  = "Envoi ciblé"
    }

    else {
      this.topictype = evt;
      this.post_programme = false;
      this.calltoaction = "Aucun";
      this.setOffre = "Aucun";
      this.resetForm();
      this.ImagesAjoutes = [];
      this.pictures   = []
      this.FinalImagesArray = []
      this.galeriImages =[]
      this.imagesToAdd = []
    }
 
  }
  sendPost() {
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
    this.loading = true;
    if (this.AddPostForm.value.calltoaction) {
      if (this.AddPostForm.value.calltoaction.actiontype == undefined) {
        delete this.AddPostForm.value.calltoaction;
      }
    }
    this.AddPostForm.value.topictype = this.topictype;
    this.getAllWhatWeWillSend();

    if(this.FinalImagesArray.length != 0)
    {
      this.AddPostForm.value.post_listImages = this.FinalImagesArray
    }
    else
    {
      if(this.pictures.length!=0)
      {
        this.FinalImagesArray.push({ objet: [this.pictures[0]],});
        this.AddPostForm.value.post_listImages = this.FinalImagesArray;
      }
      else if(this.pictures.length==0)
      { this.AddPostForm.value.post_listImages = []}
    }
    if (this.topictype == "PRODUCT") {
      if ((this.AddPostForm.value.Categorie_produit = "Créer une catégorie")) {
        this.AddPostForm.value.Categorie_produit = this.AddPostForm.value.New_Categorie;
      }
      if (this.Categorie_produit.Categorie_produit != "Créer une catégorie") {

        
      if (this.fun_action == "Modifier") {
        this.AddPostForm.value.Categorie_produit = this.Categorie_produit;
      } else if (this.fun_action == "dupliquer")
      {
        this.AddPostForm.value.Categorie_produit = this.Categorie_produit;
      }


     

      }
      if(this.AddPostForm.value.gamme_prix == true)
      {
        delete this.AddPostForm.value.Prix_produit;
      }

    }
    if (
      this.topictype == "OFFER" ||
      this.topictype == "STANDARD" ||
      this.topictype == "EVENT"
    ) {
      delete this.AddPostForm.value.Prix_maximal;
      delete this.AddPostForm.value.Prix_minimal;
      delete this.AddPostForm.value.Categorie_produit;
      delete this.AddPostForm.value.Prix_produit;
    }
    delete this.AddPostForm.value.gamme_prix;
    delete this.AddPostForm.value.New_Categorie;
    delete this.AddPostForm.value.heure_evt;
    this.nouvellist = [];
    this.AddPostForm.value.post_id = this.post_id;
    this.AddPostForm.value.columnsToIgnore.forEach((element) => {
      if (element.display) {
        this.nouvellist.push(element.display);
      } else this.nouvellist.push(element);
    });
    this.AddPostForm.value.columnsToIgnore = this.nouvellist;
    if (this.AddPostForm.value.type_envoi == "Envoi ciblé") {
      this.AddPostForm.value.listFiches = this.listFiches;

      let checker = (arr) =>
        this.AddPostForm.value.listFiches.every(
          (element) => element.status === false
        );
      if (checker(this.AddPostForm.value.listFiches) == true) {
        this._Notificationservice.error(
          "Erreur",
          "If faut choisir au (-) une fiche",
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
        return;
      }
    } else if (this.AddPostForm.value.type_envoi == "Envoi groupé") {
      this.AddPostForm.value.listGroupe = this.listGroupe;
      for (let i = 0; i < this.AddPostForm.value.listGroupe.length; i++) {
        this.AddPostForm.value.listGroupe[i].ettiquettes.forEach((val) => {
          this.allStatus.push(val);
        });
      }
      let checker = (arr) =>
        this.allStatus.every((element) => element.status === false);
      if (checker(this.allStatus) == true) {
        this._Notificationservice.error(
          "Erreur",
          "If faut choisir au (-) une etiquette",
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
        return;
      }
    } else if (
      this.AddPostForm.value.type_envoi != "Envoi groupé" && this.AddPostForm.value.type_envoi != "Envoi ciblé" ) {
      this.AddPostForm.value.type_envoi = "Tous";
      this.AddPostForm.value.listFiches = this.listFiches;
      this.listFiches.forEach((fiche) => {fiche.status = true;});
    }
    this.AddPostForm.value.date_debut = this.convert(this.AddPostForm.value.date_debut);
    this.AddPostForm.value.date_fin = this.convert(this.AddPostForm.value.date_fin);
    if (this.AddPostForm.value.date_debut == "NaN-aN-aN") {
      this.AddPostForm.value.date_debut = "";
    }
    if (this.AddPostForm.value.date_fin == "NaN-aN-aN") {
      this.AddPostForm.value.date_fin = "";
    }
    if (this.AddPostForm.value.post_programme == true) {
      this.AddPostForm.value.date_programme = this.convert(
        this.AddPostForm.value.date_programme
      );
      if (this.AddPostForm.value.date_programme == "NaN-aN-aN") {
        this.AddPostForm.value.date_programme = "";
      }
    }
     else if (this.AddPostForm.value.post_programme == false) {
      delete this.AddPostForm.value.date_programme;
    }
    if (this.topictype == "OFFER") {
      if (
        this.AddPostForm.value.date_debut == "" || this.AddPostForm.value.date_fin == ""
      ) {
        this._Notificationservice.error(
          "Erreur",
          "If faut remplir le date de début et le date de fin",
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
        return;
      }
    }

    this.PostsService.AddPost(this.AddPostForm.value , this.selectedfiche).subscribe(
      (result) => {
        if (result.success == true) {
          this._Notificationservice.success("success", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
       
          this.loading = false;
          this.active = "Tous";
          this.RetoursPost();
          this.getlistPost("Tous");
          this.AddPostForm.reset();
          this.resetForm();

        }
        else if (result.success == false) {
          this._Notificationservice.error("Erreur", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
        }
      },
      (error) => {
        this._Notificationservice.error("Erreur", error.error.message, {
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
      }
    );
  }
  FermerAdd() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
  deleteEtiquette(item) {
    item.status = false;
  }
  Activitetiquette(items, evt) {
    items.etatActivat = evt.target.checked;
    if (evt.target.checked == true) {
      items.ettiquettes.forEach((val) => {
        val.status = true;
      });
    } else if (evt.target.checked == false) {
      items.ettiquettes.forEach((val) => {
        val.status = false;
      });
    }
  }
  onChangeDatasource(evt) {
    this.current_type_envoi = evt.name;
  }
  getlistetiquette() {
    this.PostsService.getlistetiquette(this.selectedfiche).subscribe((result) => {
      this.listGroupe = result.data.etiquette;
      console.log( 'this.listGroupe----------->' , this.listGroupe)
      this.listFiches = result.data.fiche;
      this.countfiche = result.data.countfiche;
      this.Appelaction = result.data.Appelaction

      this.TypeEnvoi[0].name = "Toutes" + " (" + this.countfiche + " fiches)";
    });
  }
  getlistTime() {
    this.FranchiseService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }
  getlistPost(type) {
    this.ServiceGlobale.getlistPost(type).subscribe((result) => {
      this.TousPost = result.data.TousPost;
    });
  }
  deletepost(post_id) {
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

    this.ServiceGlobale.deletepost(post_id).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error("Erreur", result.message, {
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
          this._Notificationservice.success("success", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
          this.getlistPost("Tous");
        }
      },

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
      }
    );
    this.active2 = 1;
  }
  Modifierpost(item, action) {
    this.pictures   = []
    this.FinalImagesArray = []
    this.galeriImages =[]
    this.imagesToAdd = []
    this.current_date_prog = item.date_programme
    this. current_type_envoi =  item.type_envoi
    this.current_date_fin = item.date_fin,
    this.current_date_debut = item.date_debut,
    this.AddPostForm.patchValue({
      title_post: item.title_post,
      description_post: item.description_post,
      type_envoi: item.type_envoi,
      code_post: item.code_post,
      condition_post: item.condition_post,
      time_fin: item.time_fin,
      time_debut: item.time_debut,
      Prix_maximal: item.Prix_maximal,
      Prix_minimal: item.Prix_minimal,
      action_type: item.action_type,
      Lienaction: item.Lienaction,
      Prix_produit : item.Prix_produit,
      Categorie_produit : item.Categorie_produit
    });
    this.topictype = item.topictype
    this.fun_action = action;
    this.topictype = item.topicType;
    this.listGroupe = item.listgroupe,
    this.calltoaction = item.calltoaction.calltoaction
    this.Lienaction = item.Lienaction,
    this.title_post = item.title_post,
    this.description_post = item.description_post
    this.Categorie_produit = item.Categorie_produit
    this.Prix_maximal = item.Prix_maximal
    this.Prix_minimal = item.Prix_minimal
    this.Prix_produit = item.Prix_produit
    this.calltoaction = item.calltoaction
    this.setOffre = item.calltoaction.calltoaction
    this.code_post = item.code_post
    this.condition_post = item.condition_post
    this.time_debut = item.time_debut
    this.time_fin = item.time_fin
    this.liens_post = item.liens_post


    if (action == "Modifier") {
      this.post_id = item.post_id;
    } else if (action == "dupliquer") {
      this.post_id = "";
      this.title_post =  item.title_post + '_copy';
    }
    this.listTags = [];
    this.showInfos = true;
    this.AjoutPost = true;
    if( item.time_fin != null && item.time_fin != null) { this.heure_evt =  true}
     if( item.Prix_minimal != null && item.Prix_maximal != null) { this.gamme_prix =  true}
    if (this.current_date_prog != null) {this.post_programme = true;}
    if (item.fiche.length != 0) { this.listFiches = item.fiche; }
    item.listTags.forEach((val) => {
      this.listTags.push(val.title_post);
    });
    this.Type_post = item.Type;
    if (this.Type_post == "ALERT") {
      this.active2 = 0;
    }
    if (this.Type_post == "Offres") {
      this.active2 = 1;
    }
    if (this.Type_post == "Nouveauté") {
      this.active2 = 2;
    }
    if (this.Type_post == "Événements") {
      this.active2 = 3;
    }
    if (this.Type_post == "Produits") {
      this.active2 = 4;
    }
    this.action_url = item.action_url;
    this.action_type = item.action_type;
    this.galeriImages = item.media_url.post_listImages;
    if (this.galeriImages && this.galeriImages.length) {
      for (let im = 0; im < this.galeriImages.length; im++) {
        this.pictures.push({
          attachement_id: this.galeriImages[im].objet[0].attachement_id,
          attachement_nom: this.galeriImages[im].objet[0].attachement_nom,
        });
      }
    }



  }
  Restaurerpost(post_id) {
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
    this.ServiceGlobale.Restaurerpost(post_id).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error("Erreur", result.message, {
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
          this._Notificationservice.success("success", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
          setTimeout(() => {
            this.active = "Tous";
            this.getlistPost("Tous");
          }, 500);
        }
      },
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
      }
    );
  }
  Supprimerpost(post_id) {
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
    this.ServiceGlobale.Supprimerpost(post_id).subscribe(
      (result) => {
        if (result.success == false) {
          this._Notificationservice.error("Erreur", result.message, {
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
          this._Notificationservice.success("success", result.message, {
            id: "InfoAuth",
            timeOut: 6000,
            animate: "fromRight",
            showProgressBar: true,
            pauseOnHover: false,
            clickToClose: true,
            maxLength: 100,
            theClass: "auth",
          });
          this.modalService.dismissAll("Dismissed after saving data");
          this.getlistPost("Corbeille");
        }
      },
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
      }
    );
  }
  resetForm() {
    this.AddPostForm.patchValue({
      title_post: '',
      description_post: '',
      type_envoi:"",
      code_post: '',
      condition_post: '',
      time_fin: '',
      time_debut: '',
      date_debut: '',
      date_fin: '',
      listGroupe: '',
      Prix_maximal: '',
      Prix_minimal: '',
      Prix_produit: '',
      action_type:'',
      Lienaction: '',
      calltoaction: '',
      liens_post :'',
      post_listImages: '',
    });
    this.post_programme = false;
    this.current_type_envoi = "";
    this.Prix_maximal = "";
    this.Prix_minimal = "";
    this.action_type = "";
    this.Lienaction = "";
    this.calltoaction = "Aucun";
    this.setOffre = "Aucun";
    this.current_date_prog = "";
    this.listTags = [];
    this.pictures = [];
    this.FinalImagesArray= [];
  }
  Voirpost() {
    this.AjoutPost = false;
    this.detailsPost = true;
  }
  RetourAddpost() {
    this.AjoutPost = true;
    this.detailsPost = false;
  }
  GetDataImageGalerie(data: Array<any>) {
    this.ImagesAjoutes = [];
  //  this.pictures   = []
    this.FinalImagesArray = []
    this.galeriImages =[]
   // this.imagesToAdd = []
    this.ImagesAjoutes.push(data);
  
    this.getAllWhatWeWillSend();
   
  }
  GetImageDelated(data: any) {
    if (data.length !== 0) {
      this.ImagesAjoutes = [];
      this.pictures   = []
      this.FinalImagesArray = []
      this.galeriImages =[]
      this.imagesToAdd = []
      this.FinalImagesArray = []
    }

}
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }
}
