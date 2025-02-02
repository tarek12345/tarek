import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UserService } from '../services/user-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Pour la redirection

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
  standalone : false
})
export class DashbordComponent implements OnInit {
  currentTime: string = '';
  user: any;
  userId: number = 0;
  location: string = '';
  arrivalDate: string = '';
  departureDate: string = '';
  totalTime: number = 0;  // Temps total en secondes
  interval: any;  // Intervalle pour le compteur
  counter: string = '00:00:00';  // Compteur initialisé à 00:00:00

  constructor(
    private apiService: ApiService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('DashboardComponent chargé !');
    this.user = this.userService.getUserInfo();
   
    if (this.user) {
      this.userId = this.user.id;
    }
    this.GetUserSByid()
    this.updateCurrentTime();
  
  }
  GetUserSByid(){
    this.apiService.GetUserServiceByid(this.user.id).subscribe(data=>{
     this.user =data
    
    })
    }
  updateCurrentTime(): void {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 1000);
  }



}
