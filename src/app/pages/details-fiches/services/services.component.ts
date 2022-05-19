import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { ServiceGlobalService } from "../../service-global.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarService } from "./../../../components/navbar/navbar.service";
import { DashboardService } from "./../../dashboard/dashboard.service";
import {trigger,state,style,animate,transition,} from "@angular/animations";
@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  animations: [
    trigger("slideright", [
      state(
        "void",
        style({
          opacity: "0",
          display : "none",
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
          display : "none",
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
          display : "none",
          transform: "translateX(-100px)",
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
})
export class ServicesComponent implements OnInit {
  @Input()  items :[];
  @Input()  selected :[];
  listServices22 = []
  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  valueChanged(){
    this.valueChange.emit(this.listServices22);
  }

  addservice : boolean = false
  listServices
  listcategories = []
  selectedOption = "";
  servicesCat = []
  selectedfiche
  CategorieForm: FormGroup;
  ServicePersoForm: FormGroup;
  constructor(
    _http: HttpClient,
    public router: Router,
    private modalService: NgbModal,
    private NavbarService: NavbarService,
    private ServiceGlobalService : ServiceGlobalService,
    private DashboardService: DashboardService,
    private fb: FormBuilder
  ) {
    this.CategorieForm = this.fb.group({
      Name_cat: [""],
      listServices: this.fb.array([]),
    });
   }

  Addservice()
{
  this.addservice = true
}
  ngOnInit(): void {
    this.getListCategorie('')
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
  this.DashboardService.onChangecategorie(this.selectedOption ).subscribe((result) => {
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
    this.listServices22.push(service);
  });
  console.log(this.servicesCat)
  this.servicesCat.forEach((service) => {
    if (service.status == true) {
    this.listServices22.push(service);
    console.log(this.listServices22)
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
  const control = <FormArray>this.CategorieForm.controls["listServices"];
  control.removeAt(i);
}
fermerserviceperso()
{
  this.addservice = false
}

Fermer() {
  this.modalService.dismissAll("Dismissed after saving data");
}
}
