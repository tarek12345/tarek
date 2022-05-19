import { Component, OnInit } from "@angular/core";
import {ViewChild,ElementRef} from "@angular/core";
import { Router } from "@angular/router";
import { SidebarService } from "./sidebar.service";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { TransfereServiceService } from "src/app/pages/transfere-service.service";
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export class NotificationFiche {
  data;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/tableaux-de-bord",
    title: "Tableau de bord",
    icon: "ni-tv-2 text-gris",
    class: "tt",
  },
  { path: '/photos', title: 'Photos',  icon:'ni-planet text-gris', class: ''},
  { path: '/avis', title: 'Avis',  icon:'ni-planet text-gris', class: ''},
  { path: "/posts", title: "Posts", icon: "ni-planet text-gris", class: "" },
  {
    path: "/franchises",
    title: "Franchises",
    icon: "ni-planet text-gris",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChild("content") modal: ElementRef;
  TotalFiche: any;
  TotalImage: any;
  FicheNotification: any;
  NumTel: any;
  FicheNotificationPhoto: any;
  FicheDetails: any;
  listfiche: any;
  public menuItems: any[];
  public menuNotifs = [
   
    {
      Name: "Gestion des étiquettes",
      path: "/tableaux-de-bord/gestion-des-etiquettes",
    },
    {
      Name: "Documents",
      path: "/tableaux-de-bord/documents",
    },
  ];
  public isCollapsed = true;
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private transfereService: TransfereServiceService,
    private SidebarService: SidebarService
  ) {}
  closeResult = "";
  role_id
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
HoraireSpecieaux = []
  Notifications() {
      this.SidebarService.getFicheNotification().subscribe((response: any) => {
        this.TotalFiche = response.totalfiche;
        this.FicheNotification = response.data;
        this.SidebarService.getNotificationphoto().subscribe(
          (response: any) => {
            this.TotalImage = response.totalnotifphotos;
            this.FicheNotificationPhoto = response.data;
            this.FicheDetails = response.data.details;
   
          }
        );
      });
   
  
  }
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
    this.Notifications()

    this.role_id = localStorage.getItem('role_id')
  }
  ngAfterViewInit() {
    if (localStorage.getItem('dontLoad') == null  && this.FicheNotificationPhoto !='' && this.role_id != 3)
    {
      this.open(this.modal); 
    }
    localStorage.setItem('dontLoad', 'true'); }
  ChangeTelephone(val) {
    this.NumTel = {
      id: val.id,
      primaryPhone: val.value,
    };
    this.SidebarService.ChangeTelephone(this.NumTel).subscribe((response) => {
      this.Notifications();
    });
  }
  LOGOUT() {
    this.router.navigate(['login']);
    localStorage.removeItem('franchise_id_encours');
    localStorage.removeItem('idfiche_encours');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('dontLoad');
    localStorage.removeItem('ListAdresse');
    localStorage.removeItem('franchise_id');
}

setDatafranchise(detailsfranchise  ) {
  this.detailsfranchise = detailsfranchise;
 
}
detailsfranchise(detailsfranchise ) {
  this.modalService.dismissAll("Dismissed after saving data");
  this.transfereService.setDatafranchise(detailsfranchise);
  this.router.navigateByUrl('/franchises');
}


/**************notifs*********** */

setDatanotifs(detailsnotifs){
  
  this.detailsnotifs = detailsnotifs;
}
detailsnotifs(detailsnotifs , nom ) {
  this.modalService.dismissAll("Dismissed after saving data");
  localStorage.setItem("idfiche_encours",  detailsnotifs);
  detailsnotifs = {detailsnotifs , TypeModif :nom}
  this.transfereService.setDatanotifs(detailsnotifs);
  this.router.navigateByUrl('/franchises');
  detailsnotifs =''
}
activeIds = 'acc-2';
}
