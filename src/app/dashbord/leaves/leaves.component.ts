import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';
import { UserService } from '../../services/user-service.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.css'],
  standalone:false
})
export class LeavesComponent implements OnInit {
  @Input() userdetaile: any[] = [];
  @Output() leavesLoaded = new EventEmitter<any>();
  selected: { startDate: moment.Moment, endDate: moment.Moment } | null = null;
  reason: string = '';
  leaves: any[] = [];
  users: any[] = [];
  replacant: number | null = null;
  editingLeaveId: number | null = null;
  currentUserRole: string = 'administrator'; // or 'employer'
  currentUserId: number = 1;
  user: any;

  constructor(private api: ApiService, private userService: UserService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = this.userService.getUserInfo();
    if (this.user) {
      this.currentUserId = this.user.id;
      this.currentUserRole = this.user.role; // Set role based on user data
    }

    this.fetchLeaves();
    this.fetchUsers();
  }

  fetchLeaves(): void {
    this.api.getLeavesForUser(this.currentUserId).subscribe((data: any) => {
      this.leaves = data;
      this.leavesLoaded.emit(this.leaves);  // Émettre les congés au parent
  
    });
  }

  fetchUsers(): void {
    this.api.GetUsers().subscribe((data) => {
      this.users = data.users;
    });
    
  }

  addLeave(): void {
    if (this.selected && this.selected.startDate && this.selected.endDate && this.reason) {
      const leaveData = {
        start_date: this.selected!.startDate.format('YYYY-MM-DD'),
        end_date: this.selected!.endDate.format('YYYY-MM-DD'),
        reason: this.reason,
        replacant: this.replacant
      };
      this.api.addLeave(leaveData).subscribe(() => {
        this.fetchLeaves();  // Reload leaves after adding
        this.selected = null;
        this.reason = '';
        this.replacant = null;
      });
      this.refreshComponent() 
    }
  }
  
  refreshComponent() {
   // Rafraîchit la page entière
   window.location.reload();
  }
  deleteLeave(id: number): void {
    this.api.deleteLeave(id).subscribe(() => {
      this.fetchLeaves(); // Reload leaves after deleting
      this.refreshComponent()
    });
  }
  
  approveLeave(id: number): void {
    this.api.approveLeave(id).subscribe((leave) => {
    
      this.fetchLeaves(); // Reload leaves after approving
    });
  }

  updateLeave(): void {
    if (this.selected && this.reason && this.editingLeaveId) {
      const updatedData = {
        start_date: this.selected.startDate.format('YYYY-MM-DD'),
        end_date: this.selected.endDate.format('YYYY-MM-DD'),
        reason: this.reason,
        replacant: this.replacant
      };
  
      this.api.updateLeave(this.editingLeaveId, updatedData).subscribe({
        next: (res) => {
          console.log('Update success:', res);
          this.fetchLeaves();  // Refresh the list
          this.resetForm();
        },
        error: (err) => {
          console.error('Update failed:', err);
        }
      });
    }
    this.refreshComponent()
  }
  editLeave(leave: any): void {
    this.selected = {
      startDate: moment.default(leave.start_date),
      endDate: moment.default(leave.end_date)
    };
    this.reason = leave.reason;
    this.replacant = leave.replacant?.id ?? null;
    this.editingLeaveId = leave.id;
    this.refreshComponent()
  }
  resetForm(): void {
    this.selected = null;
    this.reason = '';
    this.replacant = null;
    this.editingLeaveId = null;
  }

  rejectLeave(id: number): void {
    this.api.rejectLeave(id).subscribe(() => {
      this.fetchLeaves(); // Reload leaves after deleting
      this.refreshComponent()
    });
  }
}