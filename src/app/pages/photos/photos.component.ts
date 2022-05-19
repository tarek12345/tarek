import {  Component, OnInit,ViewChild,ViewChildren, ElementRef} from '@angular/core';
import { PhotosService } from './photos.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ChartOptions, TooltipItem, Chart } from 'chart.js';
import * as moment from "moment-timezone";
import {Router } from "@angular/router";
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { NotificationsService } from "angular2-notifications";
import { HttpClient, HttpErrorResponse,} from "@angular/common/http";
import { Observable } from "rxjs";
import { Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Base64 } from 'js-base64';
import { TransfereServiceService } from '../transfere-service.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})
export class PhotosComponent implements OnInit {
  @ViewChild('fileUpload') public _fileUpload: ElementRef;
  @ViewChild("txtInput") txtInput: ElementRef;
  @ViewChildren(FormControlName, { read: ElementRef })
  backgroundUrl="./assets/photos/ajout-p.svg"
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
  closeResult = "";
  preText = 'Hello';
  LocationList:any;
  SpecifiqueList:any;
  public datachart = [88, 10];
  Filtre;
  Etiquette;
  Date_debut
  Date_fin ;
  video="./assets/photos/img-video.png"
  tooltipEl = document.getElementById('chartjs-tooltip');
  public Percent_photo =0;
  constructor(private photosservice:PhotosService,
     private sanitizer: DomSanitizer,
     private bsLocaleService: BsLocaleService, 
     private modalService: NgbModal,
     private transfereService:TransfereServiceService,
     _http: HttpClient,
     public router: Router,
     private fb: FormBuilder,
      private _Notificationservice: NotificationsService,)
  {     this.bsLocaleService.use("fr");
  this.checklist = [
    { id: "LOGO", value: "Définir comme logo" , isDisabled : false,isSelected:false },
    { id: "COVER", value: "Définir comme Couverture" , isDisabled : false,isSelected:false },
    
  ];
  this.Getfilter_Localisation();
  this.masterSelected = false;  
  this.LocationList=[];
  this.getCheckedItemList(); 
  this.masterSelectedspe = false;
  this.SpecifiqueList=[];
   this.getCheckedItemListSpe();
  this.AddPhotoForm = this.fb.group({
    File: ["", Validators.required],
    Category: ["", Validators.required],
    Type_photo: [""],
  })
  this.AddPhotoFormFilter = this.fb.group({
    File: ["", Validators.required],
    Category: ["", Validators.required],
    Type_photo: [""],
  })
}



deleteSelection(){
  this.selectedUserIds=[];
}
public Etiquettes = [];
public data: any;
  chart: any;
  myChart: any;
  chartBar: any;
  ctx:any;
  public datasets: any;
  public salesChart;
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
  isMobile: boolean = false;
  width:number = window.innerWidth;
  largeWidth:number  = 1920;
  public maxScroll: number;
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  ngOnInit(): void {
    const pHeight = document.querySelector("div").clientHeight;
    this.maxScroll = document.querySelector("div").scrollHeight - pHeight;
    
    // this.getGalerie('','',this.Count)
    this.Dernier_photoP_C();
  this.IsHiddens = false;

     this.Middle_date= new Date(this.formatedTimestamp(20));
     this.Date_debut= this.formatedTimestamp(20);
     this.Date_fin = this.formatedTimestamp(2);
     this.Date_debut= moment(this.Date_debut, 'YYYY-MM-DD').toDate();
     this.Date_fin= moment(this.Date_fin, 'YYYY-MM-DD').toDate();
     this.PhotoMissing();
      this.getVisibilitePhotos(  this.Date_debut,  this.Date_fin);
      this.isMobile = this.width < this.largeWidth;



//Individual chart config
var radiusPlus = 2;
Chart.elements.Rectangle.prototype.draw = function() {
   var ctx = this._chart.ctx;
   var vm = this._view;
   var left, right, top, bottom, signX, signY, borderSkipped;
   var borderWidth = vm.borderWidth;

   if (!vm.horizontal) {
       left = vm.x - vm.width / 2;
       right = vm.x + vm.width / 2;
       top = vm.y;
       bottom = vm.base;
       signX = 1;
       signY = bottom > top? 1: -1;
       borderSkipped = vm.borderSkipped || 'bottom';
   } else {
       left = vm.base;
       right = vm.x;
       top = vm.y - vm.height / 2;
       bottom = vm.y + vm.height / 2;
       signX = right > left? 1: -1;
       signY = 1;
       borderSkipped = vm.borderSkipped || 'left';
   }

   if (borderWidth) {
   var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
   borderWidth = borderWidth > barSize? barSize: borderWidth;
   var halfStroke = borderWidth / 2;
   var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
   var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
   var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
   var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);

   if (borderLeft !== borderRight) {
       top = borderTop;
       bottom = borderBottom;
   }
   if (borderTop !== borderBottom) {
       left = borderLeft;
       right = borderRight;
   }
   }

   var barWidth = Math.abs(left - right);
   var roundness = this._chart.config.options.barRoundness || 0.5;
   var radius = barWidth * roundness * 0.5;
   
   var prevTop = top;
   
   top = prevTop + radius;
   var barRadius = top - prevTop;

   ctx.beginPath();
   ctx.fillStyle = vm.backgroundColor;
   ctx.strokeStyle = vm.borderColor;
   ctx.lineWidth = borderWidth;

   // draw the chart
   var x= left, y = (top - barRadius + 1), width = barWidth, height = bottom - prevTop, radius = barRadius + radiusPlus;

   ctx.moveTo(x + radius, y);
   ctx.lineTo(x + width - radius, y);
   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
   ctx.lineTo(x + width, y + height);
   ctx.lineTo(x, y + height);
   ctx.lineTo(x, y + radius);
   ctx.quadraticCurveTo(x, y, x + radius, y);
   ctx.closePath();

   ctx.fill();
   if (borderWidth) {
   ctx.stroke();
   }

   top = prevTop;
}

this.chartBar = new Chart('myChart', {
    
  stacked: true,
  type: 'bar',
  data: {
    labels: this.StatLabels,
    
    datasets: [
{ 
      label: ' Vues des photos du propriétaire',
      data:   this.Customers,
      borderColor: '#1acc1c',
      backgroundColor: '#EBA10F',
      pointBorderColor: "#EBA10F",
      pointBackgroundColor: "#fff",
      borderWidth: 0,   
      borderRadius:4
    }, 
    {
      label: ' Vues des photos de clients',
      data: this.Marchant,
      borderColor: '#34315a',
      backgroundColor: '#cc0070',
      pointBorderColor: "#34495e",
      pointBackgroundColor: "#fff",
      borderWidth: 0,
      borderRadius:4
    },
     {
        label: ' Red',
        data: this.grayBar,
        borderColor: '#34315a',
        backgroundColor: '#F5F5F5',
        pointBorderColor: "#F5F5F5",
        pointBackgroundColor: "#F5F5F5",
        borderWidth: 0,
        borderRadius:4
    
      }
   
    ]
  },
  options: {
    
    interaction: {
      mode: 'x'
  },
    legend:{
      display:false
     },
    title: {
      display: false,
    },
    layout: {
      padding: 10
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      backgroundColor: "#fff",
      borderColor: '#0000001A',
      borderWidth: 0.5,
      bodyFontSize: 14,
      fontStyle: "bold",
      titleFont: {
        "weight": "bold"
      },
      titleFontColor: "#5E5E5E",
      titleFontStyle: "bold",
      bodyFont:'Ubuntu',
      displayColors: true,
      bodyFontColor: "#5E5E5E",
      titleMarginBottom: 10,
      bodySpacing: 10,
      caretPadding : 5,
      caretSize:5,
      padding: 2,
      xPadding: 25,
      yPadding:25,
    
      // custom: function(tooltipModel) {
    
      //   //alert(JSON.stringify(tooltipModel ));
      //   var tooltip = document.getElementById("tooltopvalue");
      //   // Hide if no tooltip
      //   if (tooltipModel.opacity === 0) {
      //    tooltip.style.opacity = '0';
      //     return;
      //   }
        
      //   // show the tooltip.
      //  tooltip.style.opacity = '1';
      // var datStat= this.DateStat
      //  //tooltipModel.title =  this.DateRestrictions
      //  this.DateStat  = 
  
      //   // create the img element and append it to the tooltip element.
      //   tooltip.innerHTML = ` <span class="date-center">${tooltipModel.title}</span>
      //   <span class="tooltip-text tt-2"> Vues des  photos du propriétaire <span class="tooltip-subtext ts-2"  style="color:`+tooltipModel.labelColors["1"].backgroundColor+`">${tooltipModel.dataPoints["1"].value}</span></span>
      //  <span class="tooltip-text tt-1"> Vues des  photos de clients  <span class="tooltip-subtext ts-1" style="color:`+tooltipModel.labelColors["0"].backgroundColor+`">${tooltipModel.dataPoints["0"].value}</span></span>`;
      //   var htt =    tooltip.innerHTML;
      //   var parser = new DOMParser();
      //   //const img = document.createElement(htt);
      //   tooltip.appendChild(parser.parseFromString(htt, 'text/html'));

      //   // Display, position, and set styles for font
      //   var position = tooltipModel.chart.canvas.getBoundingClientRect();

      //   tooltip.style.left =  position.left + window.pageXOffset + tooltipModel.caretX + 'px';
      //   tooltip.style.top = position.top + window.pageYOffset +  tooltipModel.caretY + 'px';


      // }
      },
 
    scales: {
      xAxes: [{
        stacked: true,
        categoryPercentage: 2 / 10 ,
       
        ticks: {
          beginAtZero: true,
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
          Padding: 0,
          fontSize: 14,
          fontColor: '#CBCBCB',
          fontFamily: " Ubuntu",
          fontStyle: "bold",
        },
        gridLines : {
          offsetGridLines: true,
         display: false,
        
      }
      }],
      yAxes: [{
        display: false,
        //stacked: true,
        ticks: {
          beginAtZero: false,
          
          stepSize: 2,
          /*maxRotation: 0,*/
         /* minRotation: 0,*/
          autoSkip: false,
          
        }
      }],
      
    }

}
});
this.get_tab_photo(this.current_tab_photo)
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
datStat
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  public DateStat;

  /*Visibilité par date.*/
  getVisibilitePhotos(Date_debut , Date_fin) {

    Date_debut = this.convert(Date_debut)
    Date_fin = this.convert(Date_fin)
    if(Date_debut=="NaN-aN-aN"){
      Date_debut="";
    }
     if(Date_fin=="NaN-aN-aN"){
      Date_fin="";
    }
  
    this.photosservice.getVisibilitePhotos(this.ListTags,Date_debut , Date_fin).subscribe((result) => {
/*Debut Chart js  Qte  photos*/

this.chart = new Chart('canvas', {
  type: 'doughnut',
  data: {
    labels: ['Photos de clients',' Photos du propriétaire'],
    datasets: [
      {
        data: this.Qte_Photo,
        backgroundColor: ["#b1cd45", "#0081c7"],
        borderWidth: 10,
      
        fill: false
      },
    ]
  },

  options: {
    padding: {
      bottom: 10
    },

    tooltips: {
      enabled: false,
      custom: function(tooltipModel) {

        //alert(JSON.stringify(tooltipModel ));
        var tooltip = document.getElementById("tooltip");
        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
         tooltip.style.opacity = '0';
          return;
        }

        // show the tooltip.
       tooltip.style.opacity = '1';
        // create the img element and append it to the tooltip element.
        tooltip.innerHTML = `<div class='qte-encart'><i class='fa fa-square' style='color:${ tooltipModel.labelColors["0"].backgroundColor}'></i>
         <span>${tooltipModel.body["0"].lines["0"].split(":")["1"]}
        <span class='qte-encart-1'>${ tooltipModel.body["0"].lines["0"].split(":")["0"]} </span></span></div>`;
        var htt =    tooltip.innerHTML;
        var parser = new DOMParser();
        tooltip.appendChild(parser.parseFromString(htt, 'text/html'));

        // Display, position, and set styles for font
        var position = tooltipModel.chart.canvas.getBoundingClientRect();

        tooltip.style.left =  position.left + window.pageXOffset + tooltipModel.caretX + 'px';
        tooltip.style.top = position.top + window.pageYOffset +  tooltipModel.caretY + 'px';


      }
      },
      legend:{
       display:false,
       
      },
     
    cutoutPercentage: 88,
    responsive: true,
    },

});
/*Fin  Chart js  Qte  photos*/
      this.Min_date = new Date(result.data.DateRestriction);
      this.Percent_photo = result.data.viewsCount.Total;
      this.Customer  = result.data.viewsCount.Customer;
     this.Properitary   = result.data.viewsCount.Properitary;
     this.Qte_Photo= [Number(this.Properitary),Number(this.Customer)]
    this.chart.data.datasets[0].data =this.Qte_Photo ;
    
    this.chart.update();
  
    this.StatLabels= result.data.AxeLabels;
    this.Marchant = result.data.Marchant;
    // this.grayBar = result.data.grayBar;
    this.Customers= result.data.Customer;
    this.DateStat = result.data.DatesList;
    this.chartBar.data.labels =this.StatLabels; // Would update the first dataset's value of 'March' to be 50
    this.chartBar.data.datasets[0].data =this.Customers; // Would update the first dataset's value of 'March' to be 50
    this.chartBar.data.datasets[1].data =this.Marchant; // Would update the first dataset's value of 'March' to be 50
    this.chartBar.data.datasets[2].data =this.grayBar; 
    this.chartBar.update(); // Calling update now animates the position of March from 90 to 50.

   //this.chart.update();
    });
  }


/* Debut  code  popup ajoute  image  */ 

  insertTags(selectedUserIds){


    selectedUserIds.forEach((Element)=>{
     let item1 = this.ListTags.find( i=> i.name.toUpperCase() === Element.name.toUpperCase())
      if(item1){
       item1=null;
      }else{
       this.ListTags.push(Element)
      }
      this.getVisibilitePhotos(this.Date_debut , this.Date_fin)
     })
    }


/*  Les Stats*/
deleteTag(i){
  this.selectedUserIds.splice(i,1);
  this.ListTags.splice(i,1);
  this.getVisibilitePhotos(  this.Date_debut,  this.Date_fin);

}
Review_autocompele(Filtre_search) {
  if(Filtre_search!=""){
  this.photosservice.Review_autocompele(Filtre_search).subscribe((result) => {
  this.Etiquettes = result.data.autocomplete;
  });
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

  setSelected = "";
  delete_photo_id ;
  valuecheckbox;
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

 



  openFrame(content,item) {
    this.tab_format = item.format;
     this.takedownUrl =  item.takedownUrl
     this.takedownUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.takedownUrl+"?igu=1");
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
  open(content,item) {

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
   message="Il est nécessaire d'avoir une seule image pour cette opération"
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

  /* Debut  code  carousel   + select    */ 
  SlideOptions = {responsive: {
    0: {
      items: 1,
      nav: true
    },
    600: {
      items: 1,
      nav: true
    },
    1000: {
      items: 1,
      nav: true,
      loop: false
    },
    1025: {
      items: 2,
      nav: true,
      loop: false
    },
    1200: {
      items: 3,
      nav: true,
      loop: false
    },
    1440: {
      items: 4,
      nav: true,
      loop: false
    },
    1500: {
      items: 4,
      nav: true,
      loop: false
    },
    1800: {
      items: 4,
      nav: true,
      loop: false
    }
  }, dots: false, nav: true ,

    navText: ["<div class='nav-btn prev-slide'> <i class='fas fa-angle-left'></i></div>", 
    "<div class='nav-btn next-slide'><i class='fas fa-angle-right'></i></div></div>"],
};  
  CarouselOptions = { items: 2, dots: true, nav: true ,
  responsiveClass: false
} 
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
 selected_fiche = { "id": 484, "logo": null, "description": "L’équipe du magasin Bastide Le Confort Médical de Saint-Quentin vous accueille du lundi au vendredi de 9h30 à 12h30 et de 14h à 18h30 et le samedi de 9h30 à 17h30. Retrouvez tout le matériel médical nécessaire pour conserver votre autonomie et votre mobilité en toute sécurité à l’intérieur comme à l’extérieur de votre domicile. L’équipe de Bastide Le Confort Médical de Saint-Quentin vous conseille pour l’achat et la location de matériel médical.", "locationName": "Bastide Le Confort Médical", "name": "accounts/108337422416691105497/locations/6258509470171120121", "placeId": "ChIJqZiXsmYY6EcRSCbWy7qX6jo", "url_map": null, "methodverif": "ADDRESS", "storeCode": null, "closedatestrCode": "2016-09-28 00:00:00", "primaryPhone": "03 23 63 70 72", "adwPhone": "+33 3 74 11 56 81", "labels": "[\"env:prod\",\"app:pj\",\"page_id:1575612\",\"location_id:175447\",\"cancelled\"]", "additionalPhones": "[\"07 86 88 78 46\"]", "websiteUrl": "http://www.materiel-medical-cambrai.com/", "etatwebsite": null, "email": null, "latitude": "49.8412577", "longitude": "3.2933143", "state": "COMPLETED", "OpenInfo_status": "OPEN", "address": "19 bd Léon Blum", "city": "SAINT QUENTIN", "country": "SAINT QUENTIN", "postalCode": "02100", "OpenInfo_opening_date": "2013-01-13", "OpenInfo_canreopen": "1", "otheradress": null, "franchises_id": 1, "created_at": "2021-12-29T08:42:59.000000Z", "updated_at": "2022-01-24T23:00:35.000000Z", "photo_count": 1 };
 selected_galerie_type = "ALL";
 Count : number=16;
 Onselected_fich(img){
  this.selected_fiche = img;

 }
 
 PhotoMissing(){
    this.photosservice.PhotoMissing().subscribe((result) => {


     this.data_photo_all = result.data.All.list_fiches ;
 
    
     this.FicheALL = result.data.All.count ;

     this.data_photo_logo = result.data.Logo.list_fiches ;
     this.LogoAll = result.data.Logo.count ;

     this.data_photo_teams = result.data.Teams.list_fiches ;
     this.Equipe = result.data.Teams.count ;

     this.data_photo_cover = result.data.Cover.list_fiches ;
     this.Couverture = result.data.Cover.count ;

     this.data_photo_Int = result.data.Interior.list_fiches ;
     this.Interieur = result.data.Interior.count ;
     
     this.data_photo_Ext = result.data.Exterior.list_fiches ;
     this.Exterieur = result.data.Exterior.count ;

     this.data_photo_travail = result.data.Work.list_fiches ;
     this.Travail = result.data.Work.count ;

     this.data_photo_video = result.data.Video.list_fiches ;
     this.Videos = result.data.Video.count ;

     this.data_photo_equipe  = result.data.MissingTeams.list_fiches ;
     this.data_photo_equipe_count = result.data.MissingTeams.count ; 
     
     this.ListPhotosselect = [
      { id: 0,Groupe:'Éléments manquants',color:'#EBA10F', name: 'Fiches sans photo'+' '+'('+this.FicheALL+')'},
      { id: 1,Groupe:'Éléments manquants',color:'#EBA10F', name:'Fiches sans logo'+' '+'('+this.LogoAll+')'},
      { id: 2, Groupe:'Éléments manquants',color:'#EBA10F',name: "Fiches sans photo d'équipe "+' '+'('+this.data_photo_equipe_count+')'},
      { id: 3,Groupe:'Éléments manquants',color:'#EBA10F', name:'Fiches sans couverture '+' '+'('+this.Couverture+')'},
      { id: 4,Groupe:"Catégories d'image",color:'#5e5e5e', name:'Extérieur '},
      { id: 5,Groupe:"Catégories d'image",color:'#5e5e5e', name:'Intérieur '},
      { id: 6, Groupe:"Catégories d'image",color:'#5e5e5e',name:'Au travail' },
      { id: 7, Groupe:"Catégories d'image",color:'#5e5e5e',name:'Vidéo' },
      { id: 8, Groupe:"Catégories d'image",color:'#5e5e5e',name:'Equipe' },
      
  ];
  if (this.FicheALL > 0){
    this.current_tab_photo =  this.ListPhotosselect[0];

  }else if(this.LogoAll > 0){
    this.current_tab_photo =  this.ListPhotosselect[1];

  }else if(this.Equipe > 0){
    this.current_tab_photo =  this.ListPhotosselect[2];

  }else if(this.Couverture > 0){
    this.current_tab_photo =  this.ListPhotosselect[3];

  }else if(this.Interieur > 0){
    this.current_tab_photo =  this.ListPhotosselect[4];

  }else if( this.Exterieur > 0){
    this.current_tab_photo =  this.ListPhotosselect[5];

  }else if(this.Travail  > 0){
    this.current_tab_photo =  this.ListPhotosselect[6];

  }else if(this.Videos > 0){
    this.current_tab_photo =  this.ListPhotosselect[7];

  }else if(this.data_photo_equipe_count > 0){
    this.current_tab_photo =  this.ListPhotosselect[8];

  }


this.get_tab_photo(this.current_tab_photo);
  });
  
  }
  
  get_tab_photo(x){
    switch(x.id) { 
      case 0: { 
         this.current_tab_photo_list=this.data_photo_all;
       break; 
      } 
      case 1: { 
        this.current_tab_photo_list=this.data_photo_logo;
         break; 
         
      }  
      case 2: { 
        this.current_tab_photo_list=this.data_photo_equipe;
        this.current_tab_photo_lists=this.data_photo_equipe_count;
         break; 
      }  
      case 3: { 
        this.current_tab_photo_list=this.data_photo_cover;
        
         break; 
      } 
      case 4: { 
        this.current_tab_photo_list=this.data_photo_Ext;
        this.current_tab_photo_lists = this.Interieur
         break; 
      } 
      case 5: { 
        this.current_tab_photo_list=this.data_photo_Int;
        this.current_tab_photo_lists = this.Exterieur
     
         break; 
      } 
      case 6: { 
        this.current_tab_photo_list=this.data_photo_travail;
        this.current_tab_photo_lists = this.Travail
         break; 
      } 
      case 7: { 
        this.current_tab_photo_list=this.data_photo_video;
        this.current_tab_photo_lists = this.Videos
         break; 
      } 
      case 8: { 
        this.current_tab_photo_list=this.data_photo_teams;
        this.current_tab_photo_lists = this.Equipe
         break; 
      }
      default: { 
        this.current_tab_photo_list=this.data_photo_all;
         break; 
      } 
   } 
  
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
  
  
  
  
      this.AddPhotoForm.reset()
      this.onRemove(event) //Suprimer images avec button annuler//
      this.checklist.forEach((val) => {
        if (val.id == 1) val.isDisabled = false;
  
      });
  }

    /* upload  photos*/
  FermerAdd() {
    this.modalService.dismissAll("Dismissed after saving data");
    this.AddPhotoForm.reset()
    this.onRemove(event) //Suprimer images avec button annuler//

  }
  
  errorHandler(error: HttpErrorResponse) {
    return Observable.throw(error.message || "Sever Error");
  }




  TypePhotos = [
    { type: "LOGO", name: "Définir comme logo" },
    { type: "COVER", name: "Définir comme Couverture" },
    { type: "INTERIOR", name: "Intérieur" },
    { type: "EXTERIOR", name: "Extérieur" },
    { type: "AT_WORK", name: "Au travail" },
    { type: "TEAMS", name: "Equipe" },
    { type: "VIDEO", name: "Video" },

  ];
  
  
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
    this.photosservice.UploadPhoto(this.current_upload_photo_fiche_id,this.AddPhotoForm.value).subscribe((result) => {
    
     
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
        this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
        this.PhotoMissing();
        this.Dernier_photoP_C();
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

  onChangeGalerieType(type){ 
    this.selected_galerie_type=type;
    this.getGalerie(this.selected_fiche.id,type,this.Count)
    
  }

  onReturn(){
  if(this.IsHiddens == true){
    this.IsHiddens= false;
  }else{
    this.IsHiddens= true;
    this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
  }
   }
    /* fin upload  photos*/
  
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
    getGalerie(Fiche_id,Categ,Count) {
      this.photosservice.getGalerie(Fiche_id,Categ,Count).subscribe((result) => {
        this.tab_photos = result.data.List_photos;
        // this.tab_photosAdd = result.data.List_photos[0].category; /* AFFICHIER  IMAGE  AJOUTER  PHOTO GALALERIE*/
        this.CountCustomer = result.data.Photo_customer_count;
        this.AllCount = result.data.Count;
  
    });
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
        this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
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
      this.PhotoMissing();
      this.Dernier_photoP_C()
      this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
  
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
public Aviertir=[];

AviertirGategorieC(Photo_id,Fiche_id) {
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
  this.photosservice.AviertirGategorieC(Photo_id,Fiche_id,this.AvertirMessage) .subscribe((result) => {
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
      this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
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

/********  Fin Aviertir photo ***************/ 


/********  Debut Filter dernier photo ***************/ 


public Dernier = [];
public Add_photo_autocomplete = [];
autocomplete_photo(Filtre_search) {
  if(Filtre_search!=""){
  this.photosservice.autocomplete_photo(Filtre_search).subscribe((result) => {
  this.Dernier = result.data.autocomplete;

  });
}
}
Add_photo_autocompletes(Filtre_search) {
  if(Filtre_search!=""){
  this.photosservice.autocomplete_Ajouterphoto(Filtre_search,this.checkedList,this.checkedListspe).subscribe((result) => {
  this.Add_photo_autocomplete = result.data.autocomplete;

  });
}
}
ListTagsPhoto=[];
ListTags_Add_Photo =[];

insertTagsPhoto(selectedPhoIds){


  selectedPhoIds.forEach((Element)=>{
   let item1 = this.ListTagsPhoto.find( i=> i.name== Element.name)
    if(item1){
     item1=null;
    }else{
     this.ListTagsPhoto.push(Element)
    }
   })
   this.Dernier_photoP_C();
  }
  insertTagsPhoto_Add_photo(selectedAddPhoIds){


    selectedAddPhoIds.forEach((Element)=>{
       let item1 = this.ListTags_Add_Photo.find( i=> i.name== Element.name)
        if(item1){
         item1=null;
        }else{
         this.ListTags_Add_Photo.push(Element)
        }
       })
      }
  
  deleteSelectionp(){
    this.selectedPhoIds=[];
  }
  deleteSelection_Add_photo(){
    this.selectedAddPhoIds=[];
  }
deleteTagPhoto(i){
this.ListTagsPhoto.splice(i,1);
this.Dernier_photoP_C();

}
deleteTagAdd_Photo(i){
  this.ListTags_Add_Photo.splice(i,1);
  
  }
/********  Debut Dernières photos client  + Dernières photos propriétaire  ***************/ 

DernierClient=[];
DernierProb=[];
Dernier_photoP_C() {
  this.photosservice.Dernier_photoP_C(this.ListTagsPhoto).subscribe((result) => {
 this.DernierClient = result.data.CUSTOMER;
  this.DernierProb = result.data.PROPERITARY;

  });

}
/********  Fin Dernières photos client  + Dernières photos propriétaire  ***************/ 


/********  Debut Information photo ***************/ 
informationItem;
openInformation(content,item) {
  this.tab_format = item.format;
  this.tab_photoss = item.file;
  this.tab_locationName= item.locationName;
  this.tab_views= item.views;  
  this.tab_date= item.date;   
  this.tab_width= item.width;   
  this.tab_height= item.height;
  this.tab_profileName= item.profileName; 
  this.tab_profilePhotoUrl= item.profilePhotoUrl; 
  this.tab_firstName= item.firstname;
  this.tab_lastName= item.lastname;   
  this.tab_thumbnail= item.thumbnail;
  this.tab_photo= item.photo;
  this.tab_fiche_id= item.fiche_id; 
  this.tab_photo_id= item.id;
  this.ListCategorieGal=null;
  this.informationItem=item;
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

openAvertirDer(content,item) {
  this.tab_format = item.format;
  this.tab_locationName= item.locationName;
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
tab_categry = []  
openCatoDer(content,item) {
  this.tab_format = item.format;
  this.tab_photoss = item.file;
  this.tab_locationName= item.locationName;
  this.tab_views= item.views;  
  this.tab_categry= item.category;  
  this.tab_date= item.date;   
  this.tab_width= item.width;   
  this.tab_height= item.height;
  this.tab_profileName= item.profileName; 
  this.tab_profilePhotoUrl= item.profilePhotoUrl;
   this.tab_firstName= item.firstname;
   this.tab_lastName= item.lastname;   
   this.tab_thumbnail= item.thumbnail;
   this.tab_fiche_id= item.fiche_id; 
   this.tab_photo_id= item.id;
   this.takedownUrl =  item.takedownUrl
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
openSuppDer(content,item) {
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
      this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count)
      this.Dernier_photoP_C()
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




Recherche_photo(Filtre_search) {
  if(Filtre_search!=""){
  this.photosservice.autocomplete_photo(Filtre_search).subscribe((result) => {
  this.Dernier = result.data.autocomplete;

  });
}
}
masterSelected:boolean;
masterSelectedspe:boolean;
checkedList:any;
checkedListspe:any;
  /***************check*************/
   // Check All Checkbox Checked
     // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.LocationList.length; i++) {
      this.LocationList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
   isAllSelecteds() {
    this.masterSelected = this.LocationList.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }
  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.LocationList.length; i++) {
      if(this.LocationList[i].isSelected)
      this.checkedList.push(this.LocationList[i]);
    }

  }
    // Check All Checkbox Checked
     // The master checkbox will check/ uncheck all items
  checkUncheckAllSpe() {
    for (var i = 0; i < this.SpecifiqueList.length; i++) {
      this.SpecifiqueList[i].isSelected = this.masterSelectedspe;
    }
    this.getCheckedItemListSpe();
  }
   isAllSelectedSpe() {
    this.masterSelectedspe = this.SpecifiqueList.every(function(item:any) {
        return item.isSelected == true;
      })
      this.getCheckedItemListSpe();
  }
  // Get List of Checked Items
  getCheckedItemListSpe(){
    this.checkedListspe = [];
    for (var i = 0; i < this.SpecifiqueList.length; i++) {
      if(this.SpecifiqueList[i].isSelected)
      this.checkedListspe.push(this.SpecifiqueList[i]);
    }
   
  }
 
  


/*****************fin check****************** */





/***************** Debut Searsh Ajouter des photos ****************** */
Getfilter_Localisation() {
  this.photosservice.Getfilter_Localisation().subscribe((result) => {
  this.LocationList = result.data.Location;
  this.SpecifiqueList = result.data.Services;
  });

}
Location
Services
AddPhotoFormFilter: FormGroup;
files_droppedFilter=[]
listUploadImagesFilter: any[];
onSelectFilter(event) {
  this.files_droppedFilter.push(...event.addedFiles);

  const formData = new FormData();
  let listImagesFilter: any[];


  for (var i = 0; i < this.files_droppedFilter.length; i++) {
    listImagesFilter = [];
    this.getBase64(this.files_droppedFilter[i]).then((data) => {
      listImagesFilter.push(data);
    });
  }
  this.listUploadImagesFilter = listImagesFilter;
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

onRemoveFilter(event) {
  this.files_droppedFilter.splice(this.files_droppedFilter.indexOf(event), 1);

  if(this.files_droppedFilter.length == 0)
  {
    this.listUploadImagesFilter = []
  }
  if(this.files_droppedFilter.length > 1)
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

FermerAddFilter() {
  this.modalService.dismissAll("Dismissed after saving data");
  this.AddPhotoFormFilter.reset()
  this.onRemoveFilter(event) //Suprimer images avec button annuler//

}



UploadAdd_Photo() {
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
  this.AddPhotoFormFilter.value.File = this.listUploadImagesFilter;

  this.AddPhotoFormFilter.value.Category = this.valuecheckbox;
  this.AddPhotoFormFilter.value.Type_photo =(this.AddPhotoFormFilter.value.Type_photo == null)?null: this.AddPhotoFormFilter.value.Type_photo.type; 
  this.photosservice.UploadAdd_Photo(this.ListTags_Add_Photo,this.AddPhotoFormFilter.value).subscribe((result) => {
  
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
      this.PhotoMissing();
      this.Dernier_photoP_C()
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


  this.AddPhotoFormFilter.reset()



}  
/***************** Fin Searsh Ajouter des photos ****************** */

ShowMore(){
  this.Count+=6;
  this.getGalerie(this.selected_fiche.id,this.selected_galerie_type,this.Count);
}
/*  debut navigation  fiche  du page photos  a tableau du bord  individuell */
detailsfranchise(detailsfranchise,img){
  this.transfereService.setData(img.id);
  this.router.navigateByUrl('/tableaux-de-bord');//as per router
}
/* fin navigation  fiche  du page photos  a tableau du bord  individuell */
}