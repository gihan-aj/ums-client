import { Component, inject } from '@angular/core';
import { Breadcrumb, BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  private breadcrumbService = inject(BreadcrumbService);
  public breadcrumbs$: Observable<Breadcrumb[]> =
    this.breadcrumbService.breadcrumbs$;
}
