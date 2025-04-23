import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-leaves',
  standalone: false,
  
  templateUrl: './leaves.component.html',
  styleUrl: './leaves.component.css'
})
export class LeavesComponent implements OnInit {
  @Input() all :any[]= []
  selected: { startDate: moment.Moment, endDate: moment.Moment } | null = null;
  reason: string = '';
  leaves: any[] = [];
  users: any[] = [];
  replacant: number | null = null;

  // Simuler l’utilisateur courant
  currentUserRole: string = 'administrator'; // ou 'employer'
  currentUserId: number = 1;
  pointageId: number = 1; // ID réel à récupérer selon ton app
  user:any;
   
  constructor(private api: ApiService,private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.getUserInfo();
   
    if (this.user) {
      this.currentUserId = this.user.id;
    }
   
   
    
    this.fetchLeaves();
    this.fetchUsers();
  }

  fetchLeaves(): void {
    this.api.get(`/leavesuser/${this.currentUserId}`).subscribe((data) => {
      
      this.leaves = data;
    });
  }

  fetchUsers(): void {
    this.api.get('/users').subscribe((data) => {
      this.users = data.users
      ;
      console.log('Users:', this.users); // pour debug
    });
  }
  

  addLeave(): void {
    if (!this.selected || !this.reason) return;

    const payload = {
      pointage_id: this.pointageId,
      start_date: this.selected.startDate.format('YYYY-MM-DD'),
      end_date: this.selected.endDate.format('YYYY-MM-DD'),
      reason: this.reason
    };

    this.api.post('/leaves', payload).subscribe(() => {
      this.fetchLeaves();
      this.selected = null;
      this.reason = '';
    });
  }

  deleteLeave(id: number): void {
    this.api.delete(`/leaves/${id}`).subscribe(() => {
      this.fetchLeaves();
    });
  }

  approveLeave(id: number): void {
    this.api.post(`/leaves/${id}/approve`, {}).subscribe(() => {
      this.fetchLeaves();
    });
  }
}
