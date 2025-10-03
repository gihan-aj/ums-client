import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StatsCardComponent } from '../widgets/stats-card/stats-card.component';
import { Store } from '@ngrx/store';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';
import { Observable } from 'rxjs';
import { User } from '../../../auth/store/auth.state';
import { selectUser } from '../../../auth/store/auth.reducer';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, StatsCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private store = inject(Store);
  private breadcrumbService = inject(BreadcrumbService);

  user$: Observable<User | null> = this.store.select(selectUser);
  currentDate = new Date();

  // Dummy data for stats cards
  dashboardStats = [
    {
      title: 'Total Users',
      value: '128',
      icon: 'fa-solid fa-users',
      color: 'blue',
    },
    {
      title: 'Active Users',
      value: '110',
      icon: 'fa-solid fa-user-check',
      color: 'green',
    },
    {
      title: 'Roles Defined',
      value: '5',
      icon: 'fa-solid fa-shield-halved',
      color: 'orange',
    },
    {
      title: 'Permissions Granted',
      value: '25',
      icon: 'fa-solid fa-key',
      color: 'purple',
    },
  ];

  ngOnInit(): void {
    this.breadcrumbService.setBreadcrumbs([{ label: 'Dashboard' }]);
  }
}
