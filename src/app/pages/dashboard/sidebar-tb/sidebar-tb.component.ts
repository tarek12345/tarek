import { Component, OnInit } from '@angular/core';
import {throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from '@angular/router';
import {NgbDropdownConfig, NgbModal,ModalDismissReasons,} from "@ng-bootstrap/ng-bootstrap";
import { NotificationsService } from 'angular2-notifications';
import { FormBuilder,FormGroup, Validators,} from "@angular/forms";
import {trigger,state,style,animate,transition,} from "@angular/animations";
import { DashboardService } from '../../dashboard/dashboard.service';
import { TransfereServiceService } from "../../transfere-service.service";

@Component({
  selector: 'app-sidebar-tb',
  templateUrl: './sidebar-tb.component.html',
  styleUrls: ['./sidebar-tb.component.css']
})
export class SidebarTBComponent implements OnInit {
  public dernierspost = [];
  public dernierspost_name;
  public dernierspost_date;
  public postprogramme = [];
  fichindividuel = this.transfereService.getData();
  constructor( private DashboardService : DashboardService,    private transfereService: TransfereServiceService,  private router: Router, ) {  }

  ngOnInit(): void {
    this.getlistposts()
  }
  getlistposts(){
    this.DashboardService.getlistposts().subscribe((result) => {
    this.dernierspost = result.data.LastPost;
    this.dernierspost_name =  result.data.LastPost.Post.name;
    this.dernierspost_date =  result.data.LastPost.Post.created_at;
    this.postprogramme = result.data.ProgPost;

  });

    
  }
  somefunction(datfichindividuela){
    this.transfereService.setData(localStorage.getItem('idfiche_encours'));
    this.router.navigateByUrl('/posts');//as per router
  }
}
