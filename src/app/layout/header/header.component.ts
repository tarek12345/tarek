import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone : false
})
export class HeaderComponent implements OnInit {
  @Input() datauser: any;
  public history: any[] = [];
  public error: string | null = null;

  constructor(
    private userService: UserService,
    private apiService: ApiService, 
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.GetUserSByid()
  this.history.length
if(this.datauser.pointages!="null"){
  this.getPointageHistory();
}
  }
  GetUserSByid(){
    this.apiService.GetUserServiceByid(this.datauser.id).subscribe(data=>{
      this.datauser = data.user;
      console.log('---w',this.datauser.arrival_date
      )
    })
    }
  getPointageHistory(){
    const userId = this.datauser.id; // ID de l'utilisateur
    if( this.history!== null){
    this.apiService.getUserHistory(userId).subscribe(
      (data: any) => {
        
        this.history = data.data; // Adapter selon la structure de l'API
      },
      (error) => {
        this.error = 'Erreur lors de la récupération des données.';
        console.error(error);
      }
    );
  }
  }

  // Fonction pour ajouter un zéro devant les nombres inférieurs à 10
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
  formatTime(totalHours: number): string {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${this.padZero(hours)}:${this.padZero(minutes)}`;
  }
  
  padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  logout() {
    this.userService.clearUserInfo();
    this.toastr.success('Déconnexion réussie', 'Succès');
    this.router.navigate(['/']);
  }
}
