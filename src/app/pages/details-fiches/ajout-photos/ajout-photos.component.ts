import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators,FormControlName,FormArray,FormControl,} from "@angular/forms";
import { Router } from '@angular/router';
import { Input, Output, EventEmitter } from '@angular/core';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
@Component({
  selector: 'app-ajout-photos',
  templateUrl: './ajout-photos.component.html',
  styleUrls: ['./ajout-photos.component.css']
})
export class AjoutPhotosComponent implements OnInit {

  @Input() parentCount:number;
  @Output() valueChange = new EventEmitter();
  AddPhotoForm: FormGroup;
  public checklist: any[];
  counter = 0;
  listUploadImages: any[];
  files_dropped: File[] = [];
  TypePhotos = [
    { type: "INTERIOR", name: "Intérieur" },
    { type: "EXTERIOR", name: "Couverture" },
  ];
  setSelected = "";
  constructor(
    _http: HttpClient,
    public router: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
  ) {
    this.AddPhotoForm = this.fb.group({
      File: ["", Validators.required],
      Category: ["", Validators.required],
      Type_photo: [""],
    })
    this.checklist = [
      { id: "LOGO", value: "Définir comme logo" , isDisabled : false,isSelected:false },
      { id: "COVER", value: "Définir comme Couverture" , isDisabled : false,isSelected:false },
      
    ];
   }

  ngOnInit(): void {
  }


  valueChanged(){
    this.AddPhotoForm.value.File = this.listUploadImages;

    this.AddPhotoForm.value.Category = this.valuecheckbox;
    this.AddPhotoForm.value.Type_photo =(this.AddPhotoForm.value.Type_photo == null)?null: this.AddPhotoForm.value.Type_photo.type; 
    this.valueChange.emit(this.AddPhotoForm.value);
  
  }
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

  FermerAdd() {
    this.modalService.dismissAll("Dismissed after saving data");
    this.AddPhotoForm.reset()
    this.onRemove(event) //Suprimer images avec button annuler//

  }
 
}
