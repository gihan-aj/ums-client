import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { LayoutService } from '../../core/services/layout.service';
import { HasPermissionDirective } from '../../core/directives/has-permission.directive';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, HasPermissionDirective],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private layoutService = inject(LayoutService);

  isSidebarOpen$: Observable<boolean> = this.layoutService.isSidebarOpen$;
  isMobile$: Observable<boolean> = this.layoutService.isMobile$;

  isMobile = false;

  constructor() {
    this.isMobile$.subscribe((val) => (this.isMobile = val));
  }

  closeSidebarLink() {
    if (this.isMobile) this.layoutService.toggleSidebar();
  }
}
