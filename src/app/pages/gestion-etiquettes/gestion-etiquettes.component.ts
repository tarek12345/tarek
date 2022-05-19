import { Component, OnInit, ViewChildren } from "@angular/core";
import {CdkDragDrop,moveItemInArray,transferArrayItem,CdkDropList,} from "@angular/cdk/drag-drop";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {FormGroup,FormBuilder,FormControlName,Validators,} from "@angular/forms";
import {ElementRef, ViewChild,} from "@angular/core";
import {HttpClient,HttpErrorResponse,HttpHeaders,} from "@angular/common/http";
import {animate,state,style,transition,trigger,} from "@angular/animations";
import { Observable } from "rxjs";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/observable/fromEvent";
import "rxjs/add/observable/merge";
import { GenericValidator } from "../../shared/generic-validator.service";
import { NotificationsService } from "angular2-notifications";
import { EtiquettesService } from "../gestion-etiquettes/etiquettes.service";
class Etiquette {
  Etat_Etiquette: boolean = false;
  Nom_etiquette: string;
  Value_etiquette: number = 0;
  Add_Etiquette: boolean = false;
  status: boolean = false;
}
@Component({
  selector: "app-gestion-etiquettes",
  templateUrl: "./gestion-etiquettes.component.html",
  styleUrls: ["./gestion-etiquettes.component.css"],
  animations: [
    trigger("focusPanel", [
      state(
        "inactive",
        style({
          transform: "scale(1)",
        })
      ),
      state(
        "active",
        style({
          transform: "scale(1.04)",
        })
      ),
      transition("inactive => active", animate("500ms ease-in")),
      transition("active => inactive", animate("500ms ease-out")),
    ]),
    trigger("itemEnter", [
      state("in", style({ transform: "translateY(0)" })),

      transition("void => *", [
        style({ transform: "translateY(-100%)", opacity: 0 }),
        animate("300ms ease-out"),
      ]),
      transition("* => void", [
        animate(
          "300ms ease-out",
          style({ transform: "scaleY(0) translateY(200px)" })
        ),
      ]),
    ]),
  ],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class GestionEtiquettesComponent implements OnInit {
  CreateGroupe: FormGroup;
  @ViewChild("txtInput") txtInput: ElementRef;
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[];
  Exist:boolean =false
  listEtiquette = [];
  listGroupe = [];
  valuecolor;
  validated = 1;
  ModifGroupe = "";
  phaseForm: FormGroup;
  selectedValue: string;
  cdkDropTrackLists: any;
  width: number = 30;
  closeResult3 = "";
  Listgroupes = [ ];
  categories = [
    {
      color: "#f1c40f",
      value: false,
      checked: false,
    },
    {
      value: false,
      checked: false,
      color: "#e74c3c",
    },
    {
      value: false,
      checked: false,
      color: "#95a5a6",
    },

    {
      value: false,
      checked: false,
      color: "#9b59e6",
    },

    {
      value: false,
      checked: false,
      color: "#1abc9c",
    },

    {
      value: false,
      checked: false,
      color: "#f39c12",
    },

    {
      value: false,
      checked: false,
      color: "#c0392b",
    },

    {
      value: false,
      checked: false,
      color: "#34495e",
    },

    {
      value: false,
      checked: false,
      color: "#8e44ad",
    },

    {
      value: false,
      checked: false,
      color: "#27ae60",
    },
  ];
  GroupeEtiquette = [];
  specification = [];
  corbeille = [];
  Name_groupe =""
  currentetiquette
  currentegroupe
  currentnometiquette
  action
  groupe_name;
  largeWidth:number  = 1920;
  widths:number = window.innerWidth;
  isMobile: boolean = false;
  @ViewChildren(CdkDropList)
  set cdkDropLists(value: any) {this.cdkDropTrackLists = value.toArray();}
  open(content2, i , items) {
    if(items)
    {
      this.Name_groupe = items.Name_groupe
      this.valuecolor = items.couleur_groupe
    }
    this.categories.forEach((element) => {
      if(element.color == this.valuecolor) 
      {
        element.value = true
        element.checked = true
      }
    });
    this.ModifGroupe = i;
    this.modalService
      .open(content2, { ariaLabelledBy: "modal-basic-title3" })
      .result.then(
        (result) => {
          this.closeResult3 = `Closed with: ${result}`;
        },
        (reason3) => {
          this.closeResult3 = `Dismissed ${this.getDismissReason3(reason3)}`;
        }
      );
  }
  Index_Etiquette
  openaction(actionetiquette , etiquette , items , action , Index_Etiquette) {
    this.action = action
    this.currentetiquette = etiquette
    this.currentegroupe = items
    this.currentnometiquette = etiquette.Nom_etiquette
    this.Index_Etiquette = Index_Etiquette
    this.modalService
      .open(actionetiquette, { size: "sm" })
      .result.then(
        (result) => {
          this.closeResult3 = `Closed with: ${result}`;
        },
        (reason3) => {
          this.closeResult3 = `Dismissed ${this.getDismissReason3(reason3)}`;
        }
      );
  }
  private getDismissReason3(reason3: any): string {
    if (reason3 === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason3 === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason3}`;
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.sendListgroupe();
    }

    this.pre = `
    listGroupe:
${JSON.stringify(this.listGroupe, null, " ")}
specification:
${JSON.stringify(this.specification, null, " ")}`;
  }
  pre = `listGroupe:${JSON.stringify(this.listGroupe, null, " ")}
  specification:
  ${JSON.stringify(this.specification, null, " ")}`;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;
  constructor( private modalService: NgbModal,private fb: FormBuilder,private _Notificationservice: NotificationsService,
    private _fb: FormBuilder,
    private EtiquettesService : EtiquettesService
  ) {
    this.CreateGroupe = this.fb.group({
      groupe_nom: [""],
    });
    this.validationMessages = {
      Name_groupe: {
        required: "Le nom du groupe est obligatoire et ne peut être vide.",
        minlength: "Le nom doit comporter au moins 3 caractères.",
        maxlength: "Le nom ne doit pas dépasser 80 caractères.",
      },
      couleur_groupe: {
        required: "La couleur du groupe est obligatoire et ne peut être vide.",
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.phaseForm = this._fb.group({
      Name_groupe: ["", [Validators.required, Validators.minLength(3)]],
      ettiquettes: this._fb.array([{}]),
      couleur_groupe: ["", [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.getlistgroupe()
    this.selectedValue = "";
    this.isMobile = this.widths < this.largeWidth;
  }
  closeResult = "";
  onWindowResize(event) {
    this.widths = event.target.innerWidth;
    this.isMobile = this.widths < this.largeWidth;
  
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  /*****Get list de groupe********/
  getlistgroupe() {
    this.EtiquettesService.getlistgroupe().subscribe((result) => {
     this.listGroupe = result.data;
     this.corbeille =  result.datacorbeille.ettiquettes
    });
  }
  /******Ajouter un groupe****/
  onSubmit() {
    if (this.valuecolor) {
      this.phaseForm.value.couleur_groupe = this.valuecolor;
    } else
      this.phaseForm.value.couleur_groupe = this.phaseForm.value.couleur_groupe;
    this.phaseForm.value.ettiquettes = [];

    if (this.ModifGroupe == "Edit") {
      this.listGroupe.forEach((items) => {
        this.listGroupe[2].Name_groupe = this.phaseForm.value.Name_groupe;
        this.listGroupe[2].couleur_groupe = this.phaseForm.value.couleur_groupe;
      });
    } else if (this.ModifGroupe == "Add") {
      this.listGroupe.push(this.phaseForm.value);
    }
    this.sendListgroupe();
  }
  /******Renommer etiquette*******/
  Renommeretiquette(currentnometiquette) 
  {
    for (let i = 0; i < this.listGroupe.length; i++) {
      this.listGroupe[i].ettiquettes.forEach((item) => {
        if (item == this.currentetiquette) item.Nom_etiquette = currentnometiquette;
      });
    }
    this.EtiquettesService.sendListgroupe(this.listGroupe).subscribe((result) => {
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
        this.getlistgroupe();
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
 /***** Submit list de groupe******/
  sendListgroupe() {
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
    this.EtiquettesService.sendListgroupe(this.listGroupe).subscribe((result) => {
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
        this.getlistgroupe();
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
  addEtiquette() {
    let etiquette = null;
    etiquette = new Etiquette();
    this.listEtiquette.push(etiquette);
  }
  addvalueetiquette(e: Etiquette) {
    e.Etat_Etiquette = false;
    e.Add_Etiquette = true;
  }
  Addgroupe(e: Etiquette, Index_Etiquette) {
    e.status = false;
    if (this.Exist == false) {
      this.GroupeEtiquette.push(e);
    } else if (this.Exist == true) 
    {
    }
    this.listEtiquette.splice(Index_Etiquette, 1);
  }

  /*******Déplacement étiquette*******/
  categoriechecked;
  getlistgroupes(items)
  {
  this.Listgroupes = []
    this.listGroupe.forEach((groupe) => {
      if(groupe.Name_groupe != items.Name_groupe)
      {
        this.Listgroupes.push(
          {
            Name_groupe:   groupe.Name_groupe , 
            id_groupe : groupe.id_groupe,
            isDisabled : false 
          }
          )
      }
    });
  }
  selectgroupe(item) {
    this.categoriechecked = item;
    this.Listgroupes.forEach((val) => {
      if (val.id_groupe == item.id_groupe) val.isDisabled = !val.isDisabled;
      else {
        val.isDisabled = false;
      }
    });
  }
  deplaceretiquette(categorie) {
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
      this.EtiquettesService.deplaceretiquette(this.currentetiquette ,  this.currentegroupe , categorie).subscribe(
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
            this.GroupeEtiquette.splice(this.Index_Etiquette, 1);
            this.getlistgroupe()
            this.modalService.dismissAll("Dismissed after saving data");
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
  /**********delete etiquette**********/
  deletetiquette(etiquette) {
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
    this.EtiquettesService.deletetiquette(etiquette).subscribe(
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
          this.getlistgroupe()

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
  deletetiquettedefinitivemeent(etiquette) {
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
    this.EtiquettesService.deletetdefinitivement(etiquette).subscribe(
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
          this.getlistgroupe()
          this.modalService.dismissAll("Dismissed after saving data");
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
  Restaureretiquette(etiquette) {
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
    this.EtiquettesService.Restaureretiquette(etiquette).subscribe(
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
          this.getlistgroupe()
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
  deleteEtiq(customer ,Index_Etiquette)
  {
    this.GroupeEtiquette.splice(Index_Etiquette, 1);
  }

  /*******************delete groupe************** */

  deletegroupe(currentegroupe)
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
    this.EtiquettesService.deletegroupe(currentegroupe).subscribe(
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
          this.getlistgroupe()
          this.modalService.dismissAll("Dismissed after saving data");

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


  /******Vérification Etiquette exist deja ou non******/
  onSearchEtiquette(searchValue: string) {
    this.Exist =false
      let item1 = this.listGroupe[0].ettiquettes.find( i=> i.Nom_etiquette.toUpperCase() === searchValue.toUpperCase())       
        || this.GroupeEtiquette.find(i => i.Nom_etiquette.toUpperCase() === searchValue.toUpperCase())
        || this.listGroupe[1].ettiquettes.find( i=> i.Nom_etiquette.toUpperCase() === searchValue.toUpperCase())
        ||  this.listGroupe[2].ettiquettes.find( i=> i.Nom_etiquette.toUpperCase() === searchValue.toUpperCase()) 
      if(item1.Nom_etiquette.toUpperCase() == searchValue.toUpperCase())
      {
        this.Exist =true
      } 
     else   this.Exist =false
  }
  onKey(event)
  {
    this.valuecolor="#"
  }
  /**********Ajout etiquette********/
  change(e: Etiquette) {
    e.Etat_Etiquette = true;
  }
  onSearchChange(e: Etiquette, searchValue: string) {
    e.Nom_etiquette = searchValue;
    for (let i = 0; i < this.listGroupe.length; i++) {
      this.listGroupe[i].ettiquettes.forEach((item) => {
        if (item == e) item.Nom_etiquette = e.Nom_etiquette;
       
      });
    }
    this.sendListgroupe();
  }
  keyup(event, e: Etiquette) {
    e.Nom_etiquette = event;
    this.width = this.width + 1;
    for (let i = 0; i < this.listGroupe.length; i++) {
      this.listGroupe[i].ettiquettes.forEach((item) => {
        if (item == e) item.Nom_etiquette = e.Nom_etiquette;
      });
    }
  }
  setFocus() {
    setTimeout(() => {
      this.txtInput.nativeElement.focus();
    }, 500);
  }
  clickEvent(e: Etiquette) {
    e.status = !e.status;
  }
  clickEvent2(e: Etiquette) {
    e.status = !e.status;
  }
  Selection(checkbox) {
    this.valuecolor = checkbox.color;
    this.categories.forEach((item) => {
      if (item !== checkbox) item.checked = false;
      checkbox.checked = true;
    });
  }
  keyupColor(event) {
    this.categories.forEach((item) => {
      if (item.color !== event) item.checked = false;
      else if (item.color == event) {
        item.checked = true;
      }
    });
  }
  /********************fin ajout etiquette********** */
  ngAfterViewInit(): void {
    let controlBlurs: Observable<
      any
    >[] = this.formInputElements.map((formControl: ElementRef) =>
      Observable.fromEvent(formControl.nativeElement, "blur")
    );
    Observable.merge(this.phaseForm.valueChanges, ...controlBlurs)
      .debounceTime(800)
      .subscribe((value) => {
        this.displayMessage = this.genericValidator.processMessages(
          this.phaseForm
        );
      });
  }
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }
  deleteTag(i){
    this.listEtiquette.splice(i,1);
    
  }
}
