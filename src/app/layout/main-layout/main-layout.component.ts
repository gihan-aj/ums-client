import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { LayoutService } from '../../core/services/layout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private layoutService = inject(LayoutService);

  isSidebarOpen$: Observable<boolean> = this.layoutService.isSidebarOpen$;
  isMobile$: Observable<boolean> = this.layoutService.isMobile$;

  // Bind classes directly to the <app-main-layout> host element
  @HostBinding('class.is-mobile') isMobile: boolean = false;
  @HostBinding('class.sidebar-open') isSidebarOpen: boolean = true;

  ngOnInit() {
    this.isMobile$.subscribe((val) => (this.isMobile = val));
    this.isSidebarOpen$.subscribe((val) => (this.isSidebarOpen = val));
  }

  // Listen for the window resize event
  @HostListener('window:resize')
  onResize(): void {
    this.layoutService.checkScreenSize(window.innerWidth);
  }
}
