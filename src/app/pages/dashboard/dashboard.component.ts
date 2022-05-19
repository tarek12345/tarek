import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import {Chart} from "chart.js";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import * as Leaflet from "leaflet";
import 'leaflet.markercluster';
import { DashboardService } from "./dashboard.service";
import { TransfereServiceService } from "../transfere-service.service";
import { Router } from "@angular/router";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker' ;
import { NotificationsService } from "angular2-notifications";
import { AvisService } from "../avis/avis.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { FranchiseService } from "../franchises/franchise.service";
import { PhotosService } from "../photos/photos.service";
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { trigger, state, style, animate, transition, } from "@angular/animations";
import { NavbarService } from "./../../components/navbar/navbar.service";
import * as moment from "moment-timezone";

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  animations: [
    trigger("slideright", [
      state(
        "void",
        style({
          opacity: "0",
          display: "none",
          transform: "translateX(+100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),

    trigger("slideUp", [
      state(
        "void",
        style({
          opacity: "0",
          display: "none",
          transform: "translateY(+100px)",
        })
      ),
      transition("void <=> *", animate(0)),
    ]),
    trigger("sliderleft", [
      state(
        "void",
        style({
          opacity: "0",
          display: "none",
          transform: "translateX(-100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class DashboardComponent implements OnInit {
  backgroundUrl="./assets/photos/ajout-p.svg"
  isMobile: boolean = false;
  isMobileSmall : boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  public latindiv
  public longindiv
  RDVForm: FormGroup;
  SiteForm: FormGroup;
  NumeroForm: FormGroup;
  ServicesForm: FormGroup;
  HorairesForm: FormGroup;
  HorairesExceptionalForm: FormGroup;
  CategorieForm: FormGroup;
  ServicePersoForm: FormGroup;
  raccourcisForm: FormGroup;
  listHoraires = [];
  public horaires = [];
  listTimes = [];
  listServices
  exceptionalsugg
  existsuggestion
  /***************** */
  closeResult = "";
  addlogo: boolean = false
  total = "false"
  totalsuggestion: boolean = true
  listFiches = []
  totalprofil
  cp: number = 1;
  rates = 1;
  smallnumPages = 20;
  raccourcis
  /*********performance**** */
  Vuetotal
  vuesearch
  Vuemaps
  Pmaps
  Psearch
  searchtotal
  direct
  indirect
  pdirect
  pindirect
  activitetotal
  url
  purl
  appel
  pappel
  itineraire
  pitineraire
  vuephoto
  pvuephoto
  datedebut
  datefin
  status
  TotalRate
  TotalAvis
  lastAvis = []
  Listsuggestions = []
  Listficheslogo = []
  totlafiche
  private DataLogo = '0'
  photo
  type
  listfiche
  listnumerofiche
  Listfichesrdv = []
  nbjour
  nbrsuggestions
  addservice: boolean = false
  selectedOption = "";
  servicesCat = []
  selectedfiche
  /********************* */
  totalActif
  public DataProfiles: any
  public datachart = [25, 25, 25, 25]
  public datachartprofil = [];
  MoyenneProfile: any = 0;
  listsraccourcis = []
  lenghtraccourcis
  @ViewChild("contentPopup") modal: ElementRef;
  map: Leaflet.Map;
  propertyList = [];
  path = "../assets/Dashboard/global-marquer.png";
  zoom: number = 7;
  lat: number = 48.862725;
  lng: number = 2.287592;
  /*******************notification************ */
  notiffiche
  ficheName
  email
  lienprend
  notifphoto
  locationName
  namefiche
  msg
  description
  typenotifs
  telephone
  service
  listlibelle
  codemagasin
  websiteUrl
  address
  categorie

  /**************fin notifs************ */
  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }


  Contentraccourcis(contentraccourcis) {
    this.total = "true"
    this.getlistraccourcis()
    this.modalService
      .open(contentraccourcis, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Opensuggestion(contentsuggestion) {
    this.modalService
      .open(contentsuggestion, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Openraccourci(contentraccourci) {
    this.modalService
      .open(contentraccourci, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  Openprofil(contentprofil) {
    this.modalService
      .open(contentprofil, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openblock(contentblock){
    this.modalService
      .open(contentblock, { size: "content_md" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  markers: marker[] = [];
  model: NgbDateStruct;
  model2: NgbDateStruct;
  public FichesEnCours = [];
  public ListRegions = [];
  public ListAvis = [];
  public ListWordings = [];
  listcategories = []
  isMasterSel: boolean;
  categoryList: any;
  checkedCategoryList: any;
  properties = [];
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  chart: any;
  progressValue = 100;
  role_id
  fichindividuel = this.transfereService.getData();
  video="./assets/photos/img-video.png"
  constructor(
    private fb: FormBuilder,
    private DashboardService: DashboardService,
    private router: Router,
    private modalService: NgbModal,
    private bsLocaleService: BsLocaleService,
    private avisservice: AvisService,
    private photosservice :PhotosService,
    private FranchiseService: FranchiseService,
    private _Notificationservice: NotificationsService,
    private transfereService: TransfereServiceService,
    private NavbarService: NavbarService,
    
  ) {
    this.bsLocaleService.use("fr");
    if (this.fichindividuel) {
      localStorage.setItem("fichindividuel", this.fichindividuel);
      this.getlistraccourcis()
      this.getnotifs()
   
    }
    else {
      this.fichindividuel = ""
    }
    this.categoryList = [];
    this.CategorieForm = this.fb.group({
      Name_cat: [""],
      listServices: this.fb.array([]),
    });
    this.RDVForm = this.fb.group({
      listfiche: this.fb.array([]),
    });
    this.ServicePersoForm = this.fb.group({
      listService: this.fb.array([
      ]),
    });
    this.raccourcisForm = this.fb.group({
    });
    this.SiteForm = this.fb.group({
      listsitefiche: this.fb.array([]),
    });
    this.NumeroForm = this.fb.group({
      listnumerofiche: this.fb.array([]),
    });
    this.ServicesForm = this.fb.group({
      listservicefiche: this.fb.array([]),
    });
    this.HorairesForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
    this.HorairesExceptionalForm = this.fb.group({
      Listhoraire: this.fb.array([]),
    });
    this.checklist = [
      { id: "LOGO", value: "Définir comme logo" , isDisabled : false,isSelected:false },
      { id: "COVER", value: "Définir comme Couverture" , isDisabled : false,isSelected:false },

    ];

  }
  ngAfterViewChecked() {
    const el1 = document.getElementById('p-1');
    if (el1) {
      el1.onclick = (fichindividuel) => this.somefunction( el1.getAttribute('data-id'));
      
    }

  }
  ngOnDestroy() {
    localStorage.removeItem('fichindividuel');

  }
  ngOnInit() {
    this.getGalerie(this.fichindividuel,'',this.Count)
    this.LocationList=[];
    this.getCheckedItemList();

    this.SpecifiqueList=[];

    this.AddPhotoForm = this.fb.group({
      File: ["", Validators.required],
      Category: ["", Validators.required],
      Type_photo: [""],
    })

    this.datedebut= this.formatedTimestamp(20);
    this.datefin = this.formatedTimestamp(5);
    this.datedebut= moment(this.datedebut, 'YYYY-MM-DD').toDate();

    this.datefin= moment(this.datefin, 'YYYY-MM-DD').toDate();
    this.isMobile = this.width < this.largeWidth;
    this.role_id = localStorage.getItem('role_id')
    this.getstorelocatore();
    this.profilincomplet()
    this.getperformance(this.datedebut, this.datefin)
    this.getlistAvis();
    this.getlastAvis()
    this.getlistsuggestions()
    this.IsHiddens = false;
  }
    onWindowResize(event) {
      this.width = event.target.innerWidth;
      this.isMobile = this.width < this.largeWidth;
  }
  TotalProfilCout= []
  nbcount : number = 1;
   public maxSize: number =5;


/***************** Ajouter une photo fiche ****************** */
valuecheckbox;
isAllSelected(item) {
  this.valuecheckbox = item.id;
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
      if (val.id == 'LOGO') val.isDisabled = true;

      if (val.id == 'COVER') val.isDisabled = true;
    });
  }
  else
  this.checklist.forEach((val) => {
    if (val.id == 'LOGO') val.isDisabled = false;
    if (val.id == 'COVER') val.isSelected = false;
  });
}
message="Il est nécessaire d'avoir une seule image pour cette opération"
onRemove(event) {
  this.files_dropped.splice(this.files_dropped.indexOf(event), 1);

  if(this.files_dropped.length == 0)
  {
    this.listUploadImages = []
  }
  if(this.files_dropped.length > 1)
  {
    this.checklist.forEach((val) => {
      if (val.id == 'LOGO') val.isDisabled = true;
      if (val.id == 'COVER') val.isDisabled = true;

    });
  }

  else
  this.checklist.forEach((val) => {
    if (val.id == 'LOGO') val.isDisabled = false;
    if (val.id == 'COVER') val.isDisabled = false;

  });
}
/* fin code  popup ajoute  image  */
FermerAddPhoto() {
 
  this.modalService.dismissAll("Dismissed after saving data");
  // console.log('sdfsdfsdfsdfs',   this.modalService)
  this.AddPhotoForm.reset()
  this.onRemove(event) //Suprimer images avec button annuler//
  
}

   openAddPhotos(content,item) {

    if( item.category == "PROFILE"){
      item.category ="LOGO";
    }
    this.checklist.forEach((val) => {
      if (val.id == item.category ){
        val.checked ="checked";
      }else{
        val.checked ="";

      }

    });
   this.current_upload_photo_fiche_id = item.id;
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  UploadPhoto() {
    this._Notificationservice.info(
      "Merci de patienter!",
      "En cours de traitement",
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
    this.AddPhotoForm.value.File = this.listUploadImages;

    this.AddPhotoForm.value.Category = this.valuecheckbox;
    this.AddPhotoForm.value.Type_photo =(this.AddPhotoForm.value.Type_photo == null)?null: this.AddPhotoForm.value.Type_photo.type;
    this.photosservice.UploadPhoto(this.fichindividuel,this.AddPhotoForm.value).subscribe((result) => {


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
        this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
        this.modalService.dismissAll("Dismissed after saving data");
      }
    }
  ),
    (error) => {
      this._Notificationservice.error("Erreur", "D'importation de photo", {
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



  }


/*****************  Fin Ajouter une photo fiche ****************** */


Signalier=[];
/********  Fin Signalier photo  avec traking de  click*************/
SignalierGategorieC(Photo_id) {
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
  this.photosservice.SignalierGategorieC(Photo_id).subscribe((result) => {
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
      this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
      this.modalService.dismissAll("Dismissed after saving data");
    }

}
),
(error) => {
  this._Notificationservice.error("Erreur", "D'importation de photo", {
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
/********  Fin Signalier photo  avec traking de  click***************/ 




  profilincomplet() {
    this.DashboardService.getProfilincomplet(this.fichindividuel,this.nbcount).subscribe((result) => {
      this.DataProfiles = result.data;
      this.listFiches = result.data[0].profil;
      this.totalprofil = result.data[0].totalprofil;
      this.TotalProfilCout = result.data[0].nbcount;
      this.ficheName = result.data[0].profil[0].locationName
      this.chart = new Chart("canvas", {
        type: "RoundedDoughnut",
        radius: "90%",
        cutoutPercentage: 88,
        data: {
          labels: ["Data1"],
          datasets: [
            {
              data: this.datachart,
              backgroundColor: ["#0081c7", "#b1cd45", "#eba10f", "#cc0070"],
              borderWidth: 8,
              borderRadius: [{ innerEnd: 50, outerEnd: 50 }],
            },
          ],
        },
        options: {
          cutoutPercentage: 80,
          legend: {
            display: false,
          },
          elements: {
            arc: {
              roundedCornersFor: 3
            },
            center: {
              // the longest text that could appear in the center
              maxText: '100%',
              text: '67%',
              fontColor: '#FF6684',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              fontStyle: 'normal',

              minFontSize: 1,
              maxFontSize: 256,
            }
          },
          tooltips: {
            enabled: false,
          },

        },
      });
    });

    var textInside = "test";
    Chart.defaults.RoundedDoughnut = Chart.helpers.clone(
      Chart.defaults.doughnut
    );
    Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
      draw: function (ease) {
        var ctx = this.chart.ctx;
        var easingDecimal = ease || 1;
        var arcs = this.getMeta().data;
        Chart.helpers.each(arcs, function (arc, i) {
          arc.transition(easingDecimal).draw();
          var pArc = arcs[i === 0 ? arcs.length - 1 : i - 1];
          var pColor = pArc._view.backgroundColor;
          var vm = arc._view;
          var radius = (vm.outerRadius + vm.innerRadius) / 2;
          var thickness = (vm.outerRadius - vm.innerRadius) / 2;
          var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
          var angle = Math.PI - vm.endAngle - Math.PI / 2;
          ctx.save();
          ctx.translate(vm.x, vm.y);
          ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
          ctx.beginPath();
          ctx.arc(
            radius * Math.sin(startAngle),
            radius * Math.cos(startAngle),
            thickness,
            0,
            2 * Math.PI
          );
          ctx.fillStyle = vm.backgroundColor;
          ctx.beginPath();
          ctx.arc(
            radius * Math.sin(angle),
            radius * Math.cos(angle),
            thickness,
            0,
            2 * Math.PI
          );
          ctx.restore();
        });


      },
    });







  }
  getstorelocatore() {
    this.DashboardService.getstorelocatore(this.fichindividuel).subscribe((result) => {
      this.properties = result.data
      this.propertyList = this.properties;
      this.latindiv = this.propertyList[0].lat
      this.longindiv = this.propertyList[0].long
      if (this.fichindividuel == '') {
        this.map = new Leaflet.Map("mapId2", { scrollWheelZoom: false, doubleClickZoom: false, minZoom:7,  maxZoom: 19})
          .setView([48.8588897, 2.320041], 7);
        Leaflet.tileLayer(
          // "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
          "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
          { // LIGNE 20
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map).openPopup();

        this.leafletMap();
      }
      else if (this.fichindividuel != '') {

        this.leafletMapIndiv();
      }
    })
  }

  somefunction(fichindividuel){
    this.fichindividuel = localStorage.setItem('idfiche_encours',fichindividuel);
    // console.log(fichindividuel)
    this.router.navigateByUrl('/franchises');//as per router
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  getperformance(datedebut, datefin) {
    datedebut = this.convert(datedebut)
    datefin = this.convert(datefin)
    if (datedebut == "NaN-aN-aN") {
      datedebut = "";
    }
    if (datefin == "NaN-aN-aN") {
      datefin = "";
    }
    this.DashboardService.getperformance(datedebut, datefin, this.fichindividuel).subscribe((response) => {
     // this.datedebut = response.data.datedebut
     // this.datefin = response.data.datefin
      this.Vuetotal = response.data.detailsvues.Vuetotal
      this.vuesearch = response.data.detailsvues.vuesearch
      this.Vuemaps = response.data.detailsvues.Vuemaps
      this.Pmaps = response.data.detailsvues.Pmaps
      this.Psearch = response.data.detailsvues.Psearch
      this.searchtotal = response.data.detailssearch.searchtotal
      this.direct = response.data.detailssearch.direct
      this.indirect = response.data.detailssearch.indirect
      this.pdirect = response.data.detailssearch.pdirect
      this.pindirect = response.data.detailssearch.pindirect
      this.activitetotal = response.data.detailsactivite.activitetotal
      this.url = response.data.detailsactivite.url
      this.purl = response.data.detailsactivite.purl
      this.appel = response.data.detailsactivite.appel
      this.pappel = response.data.detailsactivite.pappel
      this.itineraire = response.data.detailsactivite.itineraire
      this.pitineraire = response.data.detailsactivite.pitineraire
      this.vuephoto = response.data.detailsactivite.vuephoto
      this.pvuephoto = response.data.detailsactivite.pvuephoto
      this.nbjour = response.data.nbjour
    });

  }
  getlistAvis() {
    this.DashboardService.getlistAvis(this.fichindividuel).subscribe((result) => {
      this.ListAvis = result.data.ListAvis;
      this.TotalRate = result.data.ListstarALL.TotalRate
      this.TotalAvis = result.data.ListstarALL.TotalAvis
    });
  }
  getlastAvis() {
    this.DashboardService.getlastAvis(this.fichindividuel).subscribe((result) => {
    this.lastAvis = result.data.review;
    });
  }
  getTextreponse(Reply, Code, FicheName, Avis_id, Fiche_id) {
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

    this.avisservice.getTextreponse(Reply, Code, FicheName, Avis_id, Fiche_id).subscribe(
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
        }
      }
      ,
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


  /***************suggestions******** */
  getlistsuggestions() {
    this.DashboardService.getlistsuggestions(this.fichindividuel).subscribe((result) => {
      this.Listsuggestions = result.data;
      this.existsuggestion = this.Listsuggestions.length
      this.nbrsuggestions = this.Listsuggestions.length - 1
    });
  }
  getlistTime() {
    this.FranchiseService.getlistTime().subscribe((result) => {
      this.listTimes = result.data;
    });
  }
  updateCheckedOptions(option, event) {
    this.Listficheslogo
  }
  sugg(type) {
    if (type == "Horaires d'ouverture exceptionnels") {
      this.exceptionalsugg = "horaires exceptional"
    }
    this.getlistTime()
    this.type = type
    this.HorairesExceptionalForm.reset()
    let LisJours = []
    this.DashboardService.detailssuggestion(type, this.fichindividuel).subscribe((result) => {
      this.Listficheslogo = result.data[0].listfiche;
      this.totlafiche = result.data[0].total;
      this.listfiche = this.Listficheslogo;
      this.listServices = result.data[0].listServices;
      let listfiche = this.RDVForm.get("listfiche") as FormArray;
      listfiche.clear()
      for (let i = 0; i < this.Listficheslogo.length; i++) {
        listfiche.push(
          new FormGroup({
            locationName: new FormControl(this.Listficheslogo[i].locationName),
            id: new FormControl(this.Listficheslogo[i].id),
            urlvalues: new FormControl(this.Listficheslogo[i].urlvalues),

          })
        );
      }
      let listsitefiche = this.SiteForm.get("listsitefiche") as FormArray;
      listsitefiche.clear()
      for (let i = 0; i < this.Listficheslogo.length; i++) {
        listsitefiche.push(
          new FormGroup({
            locationName: new FormControl(this.Listficheslogo[i].locationName),
            id: new FormControl(this.Listficheslogo[i].id),
            websiteUrl: new FormControl(this.Listficheslogo[i].websiteUrl),

          })
        );
      }
      let listnumerofiche = this.NumeroForm.get("listnumerofiche") as FormArray;
      listnumerofiche.clear()
      for (let i = 0; i < this.Listficheslogo.length; i++) {
        listnumerofiche.push(
          new FormGroup({
            locationName: new FormControl(this.Listficheslogo[i].locationName),
            id: new FormControl(this.Listficheslogo[i].id),
            numerotel: new FormControl(this.Listficheslogo[i].numerotel),

          })
        );
      }
      let listservicefiche = this.ServicesForm.get("listservicefiche") as FormArray;
      listservicefiche.clear()
      for (let i = 0; i < this.Listficheslogo.length; i++) {
        listservicefiche.push(
          new FormGroup({
            locationName: new FormControl(this.Listficheslogo[i].locationName),
            id: new FormControl(this.Listficheslogo[i].id),
            numerotel: new FormControl(this.Listficheslogo[i].numerotel),

          })
        );
      }
      let LisJours = this.HorairesForm.get("Listhoraire") as FormArray;

      if (result.data[0].Listhoraire) {
        this.horaires = result.data[0].Listhoraire;
        for (let i = 0; i < this.horaires.length; i++) {
          let horaire = this.fb.array([]);
          for (let j = 0; j < this.horaires[i].horaire.length; j++) {
            horaire.push(
              new FormGroup({
                heurdebut: new FormControl(this.horaires[i].horaire[j].heurdebut),
                heurfin: new FormControl(this.horaires[i].horaire[j].heurfin),
                id: new FormControl(this.horaires[i].horaire[j].id),
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
              })
            );
          }
          LisJours.push(
            new FormGroup({
              jours: new FormControl(this.horaires[i].jours),
              etat: new FormControl(this.horaires[i].etat),
              date: new FormControl(this.horaires[i].date),
              horaire: horaire,
            })
          );
        }
      }
      if (result.data[0].Listhoraireexexceptionnels) {
        let LisDate = this.HorairesExceptionalForm.get("Listhoraire") as FormArray;
        LisDate.setValue([]);
        this.horaires = result.data[0].Listhoraireexexceptionnels;

        for (let i = 0; i < this.horaires.length; i++) {
          let horaire = this.fb.array([]);
          for (let j = 0; j < this.horaires[i].horaire.length; j++) {
            horaire.push(
              new FormGroup({
                heurdebut: new FormControl(this.horaires[i].horaire[j].heurdebut),
                heurfin: new FormControl(this.horaires[i].horaire[j].heurfin),
                id: new FormControl(this.horaires[i].horaire[j].id),
              })
            );
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
          LisDate.push(
            new FormGroup({
              date: new FormControl(this.horaires[i].date),
              etat: new FormControl(this.horaires[i].etat),
              horaire: horaire,
            })
          );
        }

      }
    });
    this.addlogo = true
    this.totalsuggestion = false
  }
  changestat(item) {
    this.Listficheslogo.forEach((fiche) => {
      if (item == fiche) {
        fiche.status = !fiche.status;
      }
    });
  }
  changestatservices(item) {
    this.listServices.forEach((fiche) => {
      if (item == fiche) {
        fiche.status = !fiche.status;
      }
    });
  }
  GetDataLogo(data: any) {
    this.DataLogo = data;
  }
  sendlogo() {
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
      this.photo = cimage;
    }

    this.DashboardService.sendlogo(this.photo, this.Listficheslogo, this.fichindividuel).subscribe((result) => {
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
        this.getlistsuggestions()
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
  sendRDV() {
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
    this.DashboardService.sendRDV(this.RDVForm.value, this.fichindividuel).subscribe((result) => {

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
        this.getlistsuggestions()
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
  sendSite() {
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
    this.DashboardService.sendSite(this.SiteForm.value, this.fichindividuel).subscribe((result) => {

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
        this.getlistsuggestions()

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
  sendNumero() {
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
    this.DashboardService.sendNumero(this.NumeroForm.value, this.fichindividuel).subscribe((result) => {

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
        this.getlistsuggestions()

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
  sendHoraire() {
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
    this.DashboardService.sendHoraire(this.HorairesForm.value, this.Listficheslogo, this.fichindividuel).subscribe((result) => {

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
        this.getlistsuggestions()


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
  sendservices() {
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
    this.DashboardService.sendservices(this.listServices, this.Listficheslogo, this.fichindividuel).subscribe((result) => {

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
        this.getlistsuggestions()


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
    this.HorairesExceptionalForm.value.Listhoraire.forEach((fiche) => {
      fiche.date = this.convert(fiche.date)
    });

    this.DashboardService.SendHoraireExceptional(this.HorairesExceptionalForm.value, this.Listficheslogo, this.fichindividuel).subscribe((result) => {
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
        this.getlistsuggestions()
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
  Addservice() {
    this.addservice = true
  }
  getListCategorie(val) {
    this.NavbarService.getCategorie(val).subscribe((result) => {
      this.listcategories = result.data;
    });
  }
  CategorieChange(val) {
    this.getListCategorie(val);
  }
  onChangecategorie(evt) {
    this.selectedOption = evt.categoryId;
    this.DashboardService.onChangecategorie(this.selectedOption).subscribe((result) => {
      this.servicesCat = result.data;
    });
  }
  changeserviceCat(item) {
    this.servicesCat.forEach((service) => {
      if (item == service) {
        service.status = !service.status;
      }
    });
  }
  Addnewservice() {
    this.CategorieForm.value.listServices.forEach((service) => {
      service.categorieid = this.CategorieForm.value.Name_cat.categoryId
      service.displayNamecateg = this.CategorieForm.value.Name_cat.displayName
      service.status = true
      this.listServices.push(service);
    });
    this.servicesCat.forEach((service) => {
      if (service.status == true) {
        this.listServices.push(service);
      }
    });
    this.addservice = false
  }
  createService(): FormGroup {
    return this.fb.group({
      name: [""],
      serviceId: [""],
      categorieid: [""],
      displayNamecateg: [""],
    });
  }
  add_service_persocat() {
    let listServices = this.CategorieForm.get("listServices") as FormArray;
    if (listServices.value.length > 1) {
      for (let i = 0; i < listServices.value.length; i++) {
        if (listServices.value[listServices.value.length - 1].name != "") {
          listServices.push(this.createService());
        }
      }
    }
    else listServices.push(this.createService());
  }
  removeServicePerso(i: number) {
    const control = <FormArray>this.CategorieForm.controls["listServices"];
    control.removeAt(i);
  }
  fermerserviceperso() {
    this.addservice = false
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

  /***********************horaires exceptional********************** */
  Listhorairesexceptional(): FormArray {
    return this.HorairesExceptionalForm.get("Listhoraire") as FormArray;
  }
  listhorairessexceptional(horaireIndex: number): FormArray {
    return this.Listhorairesexceptional().at(horaireIndex).get("horaire") as FormArray;
  }
  newhoraireexceptional(): FormGroup {
    return this.fb.group({
      heurdebut: "",
      heurfin: "",
      id: "",
    });
  }
  addHoraireexceptional(horaireIndex: number) {
    if (this.listhorairessexceptional.length >= 1) {
      for (let i = 0; i < this.listhorairessexceptional.length; i++) {
        if (
          this.listhorairessexceptional(horaireIndex).value[
            this.listhorairessexceptional(horaireIndex).value.length - 1
          ].heurdebut == "" &&
          this.listhorairessexceptional(horaireIndex).value[
            this.listhorairessexceptional(horaireIndex).value.length - 1
          ].heurfin == ""
        ) {
        } else {
          this.listhorairessexceptional(horaireIndex).push(this.newhoraireexceptional()
          );
        }
      }
    }
  }
  adddate(): FormGroup {
    let horaire = this.fb.array([]);
    horaire.push(
      new FormGroup({
        heurdebut: new FormControl(""),
        heurfin: new FormControl(""),
        id: new FormControl(""),
      })
    );


    return this.fb.group({
      date: "",
      etat: '',
      horaire: horaire,

    });
  }
  addHoraireexceptional22() {
    this.Listhorairesexceptional().push(this.adddate()
    );
  }
  removeHExceptional(horaireIndex: number, IndexH: number) {
    this.listhorairessexceptional(horaireIndex).removeAt(IndexH);
  }
  /***********************fin horaires********************** */

  /*************** fin suggestions******** */

  leafletMap(): void {
    var markers = new Leaflet.MarkerClusterGroup({
      showCoverageOnHover: false,
      spiderfyDistanceMultiplier: 3,
      maxClusterRadius: 35,
      spiderLegPolylineOptions: {
          color: '#ffc40c'
      }
  });
    let popUpConditionalContent;

    for (const property of this.propertyList) {
      // console.log('ficheidddddd',property)
      if (property.TotalRate > 0) {
        popUpConditionalContent = `<div #contentPopup>
   <div class="row">
   <div class="col-xl-3 col-md-3">

   <img src= ${property.logo} class="icon-maps sendfichelogo " style="margin-top: 2%;  height: 100%;  width: 90px;margin-left: -7px">

   </div>

   <div class="col-xl-9 col-md-9" style="padding-left: 25px;" > <span id="p-1" data-id="${property.idfiche}"class="title-franchise sendfiche mb-1"> ${property.locationName}</span>
   
   <div class="row">
   <div class="col-xl-12">
            <div>
             <span class="maps-infos"> ${property.TotalRate} </span>
             <span class="imgavis ml-1 mr-1">  <img src= "./assets/Dashboard/stars/Start${property.TotalRate}.svg" > </span>
             <span class="maps-infos-post"> sur ${property.TotalAvis}  avis </span>
             </div>
   </div>

   </div>


   <div class="row recherche">
   <div class="col-xl-8">
   <span class="maps-infos"> Vue dans la recherche</span>
   </div>
   <div class="col-xl-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuesearch[0].couleur}!important">  ${property.vuesearch[0].pourcentage} % </span>
   </div>

   </div>
   <div class="row maps">
   <div class="col-xl-8">
   <span class="maps-infos"> Vue dans Maps</span>
   </div>
   <div class="col-xl-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuemaps[0].couleur}!important">  ${property.vuemaps[0].pourcentage} % </span>
   </div>
   </div>
   <div class="row lastpost">
   <div class="col-xl-8">
   <span class="maps-infos-post"> Dernier post envoyé il y a </span>
   </div>
   <div class="col-xl-4 text-right"> <span class="maps-infos-post-value">  ${property.nombrejour} jours </span>
   </div>
   </div>
   </div>
   </div>
</div>`
      }
      else if (property.TotalRate == 0) {
        popUpConditionalContent = `
    <form class="popup-form">
    <div #contentPopup>
    <div class="row">
    <div class="col-xl-3 col-md-3">
    <img src= ${property.logo} class="icon-maps sendfichelogo" style="margin-top: 2%;   width: 90px; height: 100%;margin-left: -7px">
    </div>
    <div class="col-xl-9 col-md-9 mt-2 " style="padding-left: 25px;" id="${property.idfiche}"> <span  id="p-1" data-id="${property.idfiche}" class="title-franchise  sendfiche mb-0">  ${property.locationName} </span>

    <div class="row viderating">
    <div class="col-xl-8 col-md-8">
    <span class="maps-infos"> Vue dans la recherche</span>
    </div>
    <div class="col-xl-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuesearch[0].couleur}!important">  ${property.vuesearch[0].pourcentage} % </span>
    </div>
    </div>
    <div class="row dernier">
    <div class="col-xl-8 col-md-8">
    <span class="maps-infos"> Vue dans Maps</span>
    </div>
    <div class="col-xl-4  col-md-4  text-right"> <span class="maps-infos"  style=" color : ${property.vuemaps[0].couleur}!important">  ${property.vuemaps[0].pourcentage} % </span>
    </div>
    </div>
    <div class="row">
    <div class="col-xl-8  col-md-8">
    <span class="maps-infos-post"> Dernier post envoyé il y a </span>
    </div>
    <div class="col-xl-4 col-md-4  text-right"> <span class="maps-infos-post-value">  ${property.nombrejour} jours </span>
    </div>
    </div>
    </div>
    </div>
 </div>
 </form>
 `
      }

      let popup = Leaflet.popup().setContent(
        popUpConditionalContent
      )
      markers.addLayer(Leaflet.marker([property.lat, property.long], {

        icon: Leaflet.icon({
          iconUrl: property.state.icon,
          iconSize: [38, 95],
          shadowSize: [50, 64],
          iconAnchor: [22, 94],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76],

        })

      }).bindPopup(popup).on('mouseover', function (e) { this.openPopup() })

      )

    }

    this.map.addLayer(markers);
    this.map.once('focus', function () { this.map.scrollWheelZoom.disabled(); });


    //this.getCheckedItemList();

  }
  leafletMapIndiv(): void {
    let popUpConditionalContent2;
    var map = new Leaflet.Map("mapId2", {
      center: [this.latindiv, this.longindiv],
      scrollWheelZoom: false, doubleClickZoom: false, minZoom:8,maxZoom:12,
      zoom: 8,
    })

    Leaflet.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    for (const property of this.propertyList) {
      if (property.TotalRate > 0) {
        popUpConditionalContent2 = `<div #contentPopup>
       <div class="row">
       <div class="col-xl-3 col-md-3 ">

       <img src= ${property.logo} class="icon-maps sendfichelogo " style="margin-top: 2%;  height: 100%;  width: 90px;margin-left: -7px">

       </div>

       <div class=" col-xl-9 col-md-9" style="padding-left: 25px;" id="${property.idfiche}"> <span  id="p-1"  data-id="${property.idfiche}" class="title-franchise sendfiche mb-1"> ${property.locationName}</span>
       <div class="row">
       <div class="col-xl-12 col-md-12">
                <div>
                 <span class="maps-infos"> ${property.TotalRate} </span>
                 <span class="imgavis ml-1 mr-1">  <img src= "./assets/Dashboard/stars/Start${property.TotalRate}.svg" > </span>
                 <span class="maps-infos-post"> sur ${property.TotalAvis}  avis </span>
                 </div>
       </div>

       </div>


       <div class="row">
       <div class="col-xl-8 col-md-8">
       <span class="maps-infos"> Vue dans la recherche</span>
       </div>
       <div class="col-xl-4 col-md-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuesearch[0].couleur}!important">  ${property.vuesearch[0].pourcentage} % </span>
       </div>

       </div>
       <div class="row">
       <div class="col-xl-8 col-md-8">
       <span class="maps-infos"> Vue dans Maps</span>
       </div>
       <div class="col-xl-4 col-md-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuemaps[0].couleur}!important">  ${property.vuemaps[0].pourcentage} % </span>
       </div>
       </div>
       <div class="row">
       <div class="col-xl-8 col-md-8">
       <span class="maps-infos-post"> Dernier post envoyé il y a </span>
       </div>
       <div class="col-xl-4 col-md-4 text-right"> <span class="maps-infos-post-value">  ${property.nombrejour} jours </span>
       </div>
       </div>
       </div>
       </div>
    </div>`
      }
      else if (property.TotalRate == 0) {
        popUpConditionalContent2 = `
        <form class="popup-form">
        <div #contentPopup>
        <div class="row">
        <div class="col-xl-3 col-md-3">
        <img src= ${property.logo} class="icon-maps sendfichelogo" style="margin-top: 2%;   width: 90px; height: 100%;margin-left: -7px">
        </div>
        <div class="col-xl-9 col-md-9 mt-2" style="padding-left: 25px;" id="${property.idfiche}"> <span   id="p-1" data-id="${property.idfiche}" class="title-franchise  sendfiche mb-1">  ${property.locationName} </span>

        <div class="row">
        <div class="col-xl-8 col-md-8">
        <span class="maps-infos"> Vue dans la recherche</span>
        </div>
        <div class="col-xl-4  col-md-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuesearch[0].couleur}!important">  ${property.vuesearch[0].pourcentage} % </span>
        </div>
        </div>
        <div class="row">
        <div class="col-xl-8 col-md-8">
        <span class="maps-infos"> Vue dans Maps</span>
        </div>
        <div class="col-xl-4 col-md-4 text-right"> <span class="maps-infos"  style=" color : ${property.vuemaps[0].couleur}!important">  ${property.vuemaps[0].pourcentage} % </span>
        </div>
        </div>
        <div class="row">
        <div class="col-xl-8 col-md-8">
        <span class="maps-infos-post"> Derniers post envoyé il y a </span>
        </div>
        <div class="col-xl-4  col-md-4 text-right"> <span class="maps-infos-post-value">  ${property.nombrejour} jours </span>
        </div>
        </div>
        </div>
        </div>
     </div>
     </form>
     `
      }
      let popup = Leaflet.popup().setContent(
        popUpConditionalContent2
      )
      Leaflet.marker([property.lat, property.long], {
        icon: Leaflet.icon({
          iconUrl: property.state.icon,
          iconSize: [38, 95],
          iconAnchor: [10, 45],
          popupAnchor: [2, -40],

        })

      }).addTo(map)
        .bindPopup(popup)
        .openPopup();
    }


  }
  checkUncheckAll() {
    for (var i = 0; i < this.categoryList.length; i++) {
      this.categoryList[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].isSelected)
        this.checkedCategoryList.push(this.categoryList[i]);
    }

    this.checkedCategoryList = JSON.stringify(this.checkedCategoryList);
  }
  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
  setDatafranchise(detailsfranchise) {
    this.detailsfranchise = detailsfranchise;
  }
  detailsfranchise(detailsfranchise) {
    this.transfereService.setDatafranchise(detailsfranchise);
    this.router.navigateByUrl('/franchises');
  }
  fermerpro() {
    this.modalService.dismissAll("Dismissed after saving data");
  }
  FermerAdd() {
    this.addlogo = false
    this.totalsuggestion = true
    this.exceptionalsugg = ''
  }

  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }


  /*********************raccourcis**************/
  openraccourcis(item, contentraccourci) {
    if (item.name == "Horaires d'ouverture") {

      this.raccourcis = "Horaires"
    }
    else
      this.raccourcis = item.name
    if (item.name == "Rédiger un post") {

      this.postfiche(item.fiche_id)
    }

    // else if (item.name == "Ajouter une photo") {
    //     // this.router.navigateByUrl('/photos');
    //     this.Openraccourci(contentraccourci)
    // }

    else {
      this.Openraccourci(contentraccourci)
    }
  }
  setDatafiche(selectedfiche) {
    this.selectedfiche = selectedfiche;
  }
  postfiche(selectedfiche) {
    this.transfereService.setDatafiche(selectedfiche);
    this.router.navigateByUrl('/posts');
  }
  NbrePhotos =[]
  getlistraccourcis() {

    this.DashboardService.getlistraccourcis(this.fichindividuel, this.total).subscribe((result) => {
      this.listsraccourcis = result.data;
      this.totalActif = result.count;
      this.lenghtraccourcis = result.data.length;
      this.NbrePhotos = result.nb_countphoto;
    });
  }
  Selection(checkbox) {
    this.listsraccourcis.forEach((item) => {
      if (item == checkbox)
        item.state = !item.state;
    });
  }
  onSubmitraccourcis() {
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
    this.DashboardService.sendraccourcis(this.listsraccourcis).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  displayhoraires(count) {
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
    this.DashboardService.raccourcishoraires(count, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  displayhorairesExcep(count) {
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

    this.DashboardService.raccourcishorairesExcep(count, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  displayservices(count) {
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

    this.DashboardService.raccourcisservices(count, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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



  produitsraccourcis(produit) {
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
    this.DashboardService.produitsraccourcis(produit, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  attributsraccourcis(attributs) {
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
    this.DashboardService.attributsraccourcis(attributs, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  liensraccourcis(liens) {
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
    this.DashboardService.liensraccourcis(liens, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  /************fin raccourcis*********** */
  namefichedec =[]
  NameficheAttribute = []
  ServiceAttribute = []
  NameficheAttributeAll = []
  NotifNumber = []
  NotifNumberZone = []
  fournis
  picto
  Services
  getnotifs() {
    this.DashboardService.getnotifs(this.fichindividuel).subscribe((result) => {
      this.notiffiche = result.data.notiffiche;
      this.notifphoto = result.data.notifphoto;
      this.msg = result.data.msg;
      this.picto = result.data.picto;
      this.namefiche = result.data.locationName;
      this.NotifNumber= result.data.details.locationName.total;
      this.NotifNumberZone= result.data.details.zonedesservies.total;

      if (result.data.details.locationName) {
        this.locationName = result.data.details.locationName
        this.typenotifs = "locationName"

      }

      if (result.data.details.zonedesservies) {
        this.namefichedec = result.data.details.zonedesservies.zonedesservies.listzone
        this.typenotifs = "zonedesservies"
      }
      if (result.data.details.lienprend) {
        this.lienprend = result.data.details.lienprend

        this.typenotifs = "lienprend"
      }

      if (result.data.details.email) {
        this.email = result.data.details.email

        this.typenotifs = "email"
      }
      if (result.data.details.numerotel) {
        this.telephone = result.data.details.numerotel.numerotel

        this.typenotifs = "telephone"
      }

      if (result.data.details.description) {
        this.description = result.data.details.description
        this.typenotifs = "description"
      }

      if (result.data.details.horaire) {
        this.horaires = result.data.details.horaire.horaire.listhoraire
        this.typenotifs = "horaires"
      }

      if (result.data.details.service) {
        this.service = result.data.details.service.service
        this.typenotifs = "service"
      }

      if (result.data.details.fournis) {
        this.NameficheAttributeAll = result.data.details.fournis.attributes.listattribute;

      this.NameficheAttribute = result.data.details.fournis.attributes.listattribute[0];
        this.typenotifs = "fournis"
      }
      if (result.data.details.listlibelle) {
        this.listlibelle = result.data.details.listlibelle.listlibelle
        this.typenotifs = "listlibelle"
      }

      if (result.data.details.codemagasin) {
        this.codemagasin = result.data.details.codemagasin
        this.typenotifs = "codemagasin"
      }

      if (result.data.details.websiteUrl) {
        this.websiteUrl = result.data.details.websiteUrl
        this.typenotifs = "websiteUrl"
      }

      if (result.data.details.categorie) {
        this.categorie = result.data.details.categorie.categorie
        this.typenotifs = "categorie"
      }


      if (result.data.details.address) {
        this.address = result.data.details.address
        this.typenotifs = "address"
      }


    });
  }
  validernotifs(typenotifs) {
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
    this.DashboardService.validernotifs(typenotifs, this.fichindividuel).subscribe
      ((result) => {
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
          this.total = "false"
          this.getlistraccourcis()
        }
      }
        ,
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
  notificationfiche(contentnotification) {
    if (this.notiffiche == 1) {
      this.Openraccourci(contentnotification)
    }
    if (this.notifphoto != 0 && this.notiffiche == 0) {
      this.router.navigateByUrl('/photos');

    }
    else if (this.notifphoto != 0 || this.notiffiche > 1) {
      this.detailsfranchise(this.fichindividuel)

    }


  }
  formatedTimestamp = (minute)=> {
    moment.tz.setDefault("UTC");
      var a = new Date();
      if(minute > 0){
        a.setDate(a.getDate() - minute);

      }

      return `${ this.convert(a)}`
    }




    ////////////////////////////* Galerie*//////////////////////////////////

    openImage(content,item) {

      if( item.category == "PROFILE"){
        item.category ="LOGO";

      }
      this.checklist.forEach((val) => {
        if (val.id == item.category ){
          val.checked ="checked";
        }else{
          val.checked ="";

        }

      });
     this.current_upload_photo_fiche_id = item.id;
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }

    selected_fiche = { };
    openCato(content,item) {
      this.tab_format = item.format;
      this.tab_photoss = item.file;
      this.tab_locationName= item.locationName;
      this.tab_views= item.views;
      this.tab_date= item.date;
      this.tab_width= item.width;
      this.tab_height= item.height;
      this.tab_profileName= item.profileName;
      this.tab_profilePhotoUrl= item.profilePhotoUrl;
       this.tab_firstName= item.firstName;
       this.tab_lastName= item.lastName;
       this.tab_thumbnail= item.thumbnail;
       this.tab_fiche_id= item.fiche_id;
       this.tab_photo_id= item.id;
       this.ListCategorieGal=null;
       this.avertirItem=item;
       this.ListCategorieGal = item.available_category;
      this.modalService
        .open(content, {  ariaLabelledBy: "modal-basic-title cato" ,windowClass:"catorisable" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    ListGalerie = [
      { value:'ALL', Name: "Vue d'ensemble"},
      { value:'PROPERITARY', Name: "Photos du propriétaire"},
      { value:'CUSTOMER', Name: "Photos des clients"},
      { value:'VIDEO'  ,Name: "Vidéo" },
      { value:'INTERIOR',Name: "Intérieur" },
      { value:'EXTERIOR',Name: "Extérieur" },
      { value:'AT_WORK',Name: "Au travail" },
      { value:'TEAMS', Name: "Équipe" },
      { value:'IDENTITY',Name: "Identité" },
    ];
    ListCategorieGal = [];
    public tab_photos = [];
    public  tab_photosAdd = [];
    CountCustomer = 0;
    AllCount=0;
    getGalerie(fichindividuel,Categ,Count) {
      this.photosservice.getGalerie(fichindividuel,Categ,Count).subscribe((result) => {
        this.tab_photos = result.data.List_photos;
        this.tab_photosAdd = result.data.List_photos[0].locationName; /* AFFICHIER  IMAGE  AJOUTER  PHOTO GALALERIE*/
        this.CountCustomer = result.data.Photo_customer_count;
        this.AllCount = result.data.Count;

    });
  }
  /********  Delete photo from catorizez***************/ 
  DeleteGategorieC(Photo_id)  {
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
    this.photosservice.DeleteGategorieC(Photo_id).subscribe((result) => {
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
        this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
    
        this.modalService.dismissAll("Dismissed after saving data");
      }
  
  }),
  (error) => {
    this._Notificationservice.error("Erreur", "D'importation de photo", {
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
  /********  Fin Delete photo from catorizez***************/ 
  /********  Debut Aviertir photo ***************/ 
  AviertirGategorieC(Photo_id,fichindividuel) {
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
    this.photosservice.AviertirGategorieC(Photo_id,fichindividuel,this.AvertirMessage) .subscribe((result) => {
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
        this.getGalerie(fichindividuel,this.selected_galerie_type,this.Count)
        this.modalService.dismissAll("Dismissed after saving data");
      }
  
  }
  ),
  (error) => {
    this._Notificationservice.error("Erreur", "D'importation de photo", {
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
    /********  Debut Ajouter  photo from catorizez***************/ 

    AddCategory(fiche_id,file,cat) {
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
      this.photosservice.AddGategorieC(fiche_id,cat.name,file).subscribe((result) => {
        
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
          this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
          this.modalService.dismissAll("Dismissed after saving data");
        }
  
    }),
    (error) => {
      this._Notificationservice.error("Erreur", "D'importation de photo", {
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
  /********  Fin Ajouter  photo from catorizez***************/ 
  /********  Fin Aviertir photo ***************/ 
    onChangeGalerieType(type){
      this.selected_galerie_type=type;
       this.getGalerie(this.fichindividuel,type,this.Count)

    }

    onReturn(){
    if(this.IsHiddens == true){
      this.IsHiddens= false;
    }else{
      this.IsHiddens= true;
       this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
    }
     }
    formInputElements: ElementRef[];
  selectedUserIds= [];
  selectedPhoIds= [];
  selectedAddPhoIds= [];
  ListTags = []
  public Min_date;
  AvertirMessage="";
  takedownUrl;
  public Middle_date;
  public Max_date: Date = new Date();
  arrayTooltip=[];
  preText = 'Hello';
  LocationList:any;
  SpecifiqueList:any;
  Filtre;
  Etiquette;
  public Percent_photo =0;


  deleteSelection(){
    this.selectedUserIds=[];
  }
  public Etiquettes = [];

    myChart: any;
    chartBar: any;
    ctx:any;
     pointerX = -1;
   pointerY = -1;
   Customer=[];
   Customers= [];
   Properitary:number;
   Marchant= [];
   DateRestriction;
   AxeLabels= [];
   StatLabels=[];
   grayBar = [];

   barchart = [];
   public Qte_Photo=[];
    htmlstring : any;
    dataSets
    tooltipContent;
    IsHiddens = false;
    public maxScroll: number;
    @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
    public scrollRight(): void {
      this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
    }

    public scrollLeft(): void {
      this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
    }


  datStat

    public DateStat;



  /* Debut  code  popup ajoute  image  */

  Review_autocompele(Filtre_search) {
    if(Filtre_search!=""){
    this.photosservice.Review_autocompele(Filtre_search).subscribe((result) => {
    this.Etiquettes = result.data.autocomplete;

    });
  }
  }
    setSelected = "";
    delete_photo_id ;

    public checklist: any[];
    files_dropped: File[] = [];
    isHidden: boolean;

  avertirItem;
    opens(content,item) {
      this.tab_format = item.format;
      this.tab_photoss = item.file;
      this.tab_locationName= item.locationName;
      this.delete_photo_id=item.id;
      this.modalService
        .open(content, {  ariaLabelledBy: "modal-basic-title cato" ,windowClass:"catorisable" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    openAvertir(content,item) {
      this.tab_format = item.format;
      this.tab_photoss = item.file;
      this.avertirItem=item;
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    openDrapeau(content,item) {
      this.tab_format = item.format;
      this.avertirItem=item;
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" ,windowClass:"drapeaux"})
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    public tab_photoss = [];
    public tab_format = [];
    public  tab_locationName= [];
    public  tab_views= [];
    public  tab_date= [];
    public  tab_width= [];
    public  tab_height= [];
    public  tab_profileName =[];
    public  tab_profilePhotoUrl =[];
    public  tab_lastName =[];
    public  tab_firstName =[];
    public  tab_thumbnail =[];
    public  tab_fiche_id =[];
    public  tab_photo =[];
     public  tab_photo_id =[];
    displayStyle = "none";

    openPopup() {
      this.displayStyle = "block";
    }
    closePopup() {
      this.displayStyle = "none";
    }






    openFrame(content,item) {
      this.tab_format = item.format;
       this.takedownUrl =  item.takedownUrl
      this.modalService
        .open(content, {  ariaLabelledBy: "modal-basic-title cato" ,windowClass:"catorisable" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    openo(content,item) {

      if( item.category == "PROFILE"){
        item.category ="LOGO";
      }
      this.checklist.forEach((val) => {
        if (val.id == item.category ){
          val.checked ="checked";
        }else{
          val.checked ="";

        }

      });
     this.current_upload_photo_fiche_id = item.id;
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }


    OpenEtablissement(content) {
      this.modalService
        .open(content, { ariaLabelledBy: "modal-basic-title" })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
    openfermeture (content){
    this.modalService.open(content, { size: "sm" }).result.then(
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


    /* Debut  code  carousel   + select    */

    public ListPhotosselect= [];
    FicheALL = 0;
    LogoAll = 0;
    current_upload_photo_fiche_id;
    current_upload_photo_fiche;
    Equipe = 0;
    Couverture = 0;
    Photoss = [];
    Interieur = 0;
    Exterieur = 0;
    Travail = 0;

    Videos = 0;
    listUploadImages: any[];
    AddPhotoForm: FormGroup;
    current_tab_photo_list=[];
    current_tab_photo=[];
    data_photo_all=[];
    data_photo_logo=[];
    data_photo_cover=[];
    data_photo_teams=[];
    data_photo_Int=[];
    data_photo_Ext=[];
    data_photo_travail= [];
    data_photo_video = [];
    data_photo_equipe = [];
    data_photo_equipe_count = 0;
   current_tab_photo_lists = 0;

   selected_galerie_type = "ALL";
   Count : number=16;
   Onselected_fich(img){
    this.selected_fiche = img;

   }


    /* fin    code  carousel + select    image  */


      /* Debut  Show  block with  photos  */

         /* Fin   Show  block with  photos  */



    /* upload  photos*/
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


      this.onRemove(event) //Suprimer images avec button annuler//

        this.AddPhotoForm.reset()

        this.checklist.forEach((val) => {
          if (val.id == 1) val.isDisabled = false;

        });
    }

      /* upload  photos*/

      TypePhotos = [
        { type: "LOGO", name: "Définir comme logo" },
        { type: "COVER", name: "Définir comme Couverture" },
        { type: "INTERIOR", name: "Intérieur" },
        { type: "EXTERIOR", name: "Extérieur" },
        { type: "AT_WORK", name: "Au travail" },
        { type: "TEAMS", name: "Equipe" },
        { type: "VIDEO", name: "Video" },
    
      ];

    ShowMore(){
      this.Count+=6;
      this.getGalerie(this.fichindividuel,this.selected_galerie_type,this.Count)
    }

  /********  Fin Ajouter  photo from catorizez***************/

 

}
