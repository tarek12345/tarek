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
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
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
    this.api.getUsersnotpagination().subscribe((data) => {
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
      // this.refreshComponent() 
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

  }
  editLeave(leave: any): void {
    this.selected = {
      startDate: moment.default(leave.start_date),
      endDate: moment.default(leave.end_date)
    };
    this.reason = leave.reason;
    this.replacant = leave.replacant?.id ?? null;
    this.editingLeaveId = leave.id;
  
  }
  resetForm(): void {
    this.selected = null;
    this.reason = '';
    this.replacant = null;
    this.editingLeaveId = null;
  }

  rejectLeave(id: number): void {
    this.api.rejectLeave(id).subscribe(() => {
      this.fetchLeaves(); // Reload leaves after rejecting
      this.refreshComponent();
    });
  }


  // Getter pour filtrer et paginer
  get filteredLeaves(): any[] {
    let filtered = this.leaves;
  
    if (this.searchTerm.trim() !== '') {
      if (this.currentUserRole === 'administrator') {
        filtered = this.leaves.filter((leave) =>
          leave.creator?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        // Tu peux aussi filtrer par raison, statut, ou remplaçant
        filtered = this.leaves.filter((leave) =>
          leave.reason?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          leave.status?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          leave.replacant?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    }
  
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filtered.slice(start, start + this.itemsPerPage);
  }
  get totalPages(): number[] {
    const totalItems = this.totalFilteredLeavesCount;
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  get totalFilteredLeavesCount(): number {
    if (this.searchTerm.trim() === '') {
      return this.leaves.length;
    }
  
    if (this.currentUserRole === 'administrator') {
      return this.leaves.filter((leave) =>
        leave.creator?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).length;
    } else {
      return this.leaves.filter((leave) =>
        leave.reason?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        leave.status?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        leave.replacant?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      ).length;
    }
  }
    displayStyle: string = "none";
  selectedUser: any = null;
   openPopup(conge: any): void {
    this.selectedUser = conge || null;
    console.log('========',this.selectedUser)
    this.displayStyle = "block";
  } 
  closesModal(){
     this.displayStyle = "none";
  }
}