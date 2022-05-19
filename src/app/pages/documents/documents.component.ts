import { Component, OnInit } from '@angular/core';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DocumentsService } from './documents.service';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
interface tabes {
  id:number;
  type: string;
  fichier : string;
  expediteur : string;
  date : string;
}
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
  host: {
    "(window:resize)":"onWindowResize($event)"
  }
})

export class DocumentsComponent implements OnInit {
  date_debut;
  date_fin;
  cp: number = 1;
  smallnumPages = 2;
  listdocuments = []; 

  constructor(  private documentservice:DocumentsService, 
    private bsLocaleService: BsLocaleService, private modalService: NgbModal, ) {
    this.bsLocaleService.use("fr");
  } 
   /*********** Debut respossive sidbar*********/
   isMobile: boolean = false;
   width:number = window.innerWidth;
   largeWidth:number  = 1920;
   closeResult = "";
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  /*********** Fin respossive sidbar*********/
   /*********** convertiseur date*********/
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  ngOnInit(): void {
    this.getDocuments('' , '' , '');
    this.isMobile = this.width < this.largeWidth;
  }
  validations
  getDocuments(date_debut , date_fin, cp) {
    date_debut = this.convert(date_debut)
    date_fin = this.convert(date_fin)
    if(date_debut=="NaN-aN-aN"){
      date_debut="";    
    }
     if(date_fin=="NaN-aN-aN"){
      date_fin="";
    }
  
    this.documentservice.getDocuments(date_debut , date_fin, cp).subscribe((result) => {
     this.listdocuments = result.data;
     this.date_debut = result.date_debut;
     this.date_fin = result.date_fin;
     this.validations = result.data[0].msg;
    });
  }

}
