import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreadcrumbService } from '../../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-profile-layout',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.scss'
})
export class ProfileLayoutComponent {
  private breadcrumbService = inject(BreadcrumbService);

  constructor(){
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'My Profile' }
    ])
  }
}
