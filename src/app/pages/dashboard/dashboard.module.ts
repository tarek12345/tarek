import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarTBComponent } from './sidebar-tb/sidebar-tb.component';

@NgModule({
  declarations: [SidebarTBComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    

  ]
})
export class DashboardModule { }
