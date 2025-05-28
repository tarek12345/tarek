import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user-service.service';
import { ApiService } from '../../services/api.service';
import {
  startOfWeek,
  endOfWeek
} from 'date-fns';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnChanges {
  @Input() datauser: any;
  @Input() useradmin: any[] = [];
  @Input() conge: any[] = [];

  congeuser: any[] = [];
  approvedCount: number = 0;
  pendingCount: number = 0;
  approvedLeaves: any[] = [];
  pendingLeaves: any[] = [];

  public history: any[] = [];
  public error: string | null = null;
  displayStyle: string = "none";
  public todaySchedule: any = null;
  public lastPointage: any = null;
  public pointageuser: any = null;

  constructor(
    private userService: UserService,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.datauser?.id) {
      this.GetUserSByid();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conge']) {
      this.countStatuses();
    }
    if (changes['useradmin']) {
      this.detaileuseradmin();
    }
    if (changes['datauser'] && this.datauser?.id) {
      this.GetUserSByid();
    }
  }

  refreshComponent() {
    this.cdr.detectChanges();
  }

  detaileuseradmin(): void {
    console.log('User Admin Updated:', this.useradmin);
  }

  countStatuses(): void {
    this.approvedLeaves = this.conge.filter(leave => leave.status === 'approved');
    this.pendingLeaves = this.conge.filter(leave => leave.status === 'pending');
    this.approvedCount = this.approvedLeaves.length;
    this.pendingCount = this.pendingLeaves.length;
  }

  getleavesbystatus(status: string) {
    this.congeuser = this.conge.filter(leave => leave.status === status);
    console.log("Filtered leaves by status:", this.congeuser);
  }

  GetUserSByid() {
    this.apiService.GetUserServiceByid(this.datauser.id).subscribe(data => {
      if (data?.user) {
        this.datauser = data.user;
        this.getTodayWorkSchedule();
        this.getLastPointage();
        this.refreshComponent();
      }
    });
  }

  getTodayWorkSchedule() {
    const today = new Date().toISOString().split('T')[0];
    const history = this.datauser?.history || [];

    const match = history.find((d: any) => d.date?.startsWith(today));

    this.todaySchedule = match ? {
      arrival_date: match.arrival_date || 'Non pointé',
      last_departure: match.last_departure || 'Non encore parti',
      location: match.location || 'Non précisée',
      pointages: match.pointages || []
    } : null;
  }

  getLastPointage() {
    const history = this.datauser?.history;
    if (!history || !Array.isArray(history)) {
      this.lastPointage = null;
      return;
    }

    const allPointages = history
      .flatMap((day: any) => day.pointages || [])
      .sort((a, b) => new Date(b.last_departure).getTime() - new Date(a.last_departure).getTime());

    this.lastPointage = allPointages[0] || null;
    this.pointageuser = history.sort((a: any, b: any) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0] || null;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  formatTime(totalHours: number): string {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${this.pad(hours)}:${this.pad(minutes)}`;
  }

  logout() {
    this.userService.clearUserInfo();
    this.toastr.success('Déconnexion réussie', 'Succès');
    this.router.navigate(['/']);
  }

  openPopup() {
    this.displayStyle = "block";
  }

  closePopup() {
    this.displayStyle = "none";
  }

  getTotalPointages(): number {
    return this.todaySchedule?.pointages?.length || 0;
  }

  getWorkDays(): { day: string, hours: string, hourszero: string, pointages: any }[] {
    const history = this.datauser?.history;
    if (!Array.isArray(history)) return [];

    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

    return history
      .filter((dayData: any) => {
        const currentDate = new Date(dayData.date);
        return currentDate >= startOfCurrentWeek && currentDate <= endOfCurrentWeek;
      })
      .map(dayData => ({
        day: dayData.day,
        hours: dayData.total_hours,
        hourszero: dayData.arrival_date,
        pointages: dayData.pointages
      }));
  }
}
