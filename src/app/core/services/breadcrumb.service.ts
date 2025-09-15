import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Defines the structure for a single breadcrumb link.
 */
export interface Breadcrumb {
  label: string;
  url?: string; // The URL is optional for the last item in the trail
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  // A BehaviorSubject holds the current array of breadcrumbs.
  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  // Expose the breadcrumbs as a public, read-only observable.
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor() {}

  /**
   * Sets the current breadcrumb trail for the application.
   * @param breadcrumbs An array of Breadcrumb objects representing the path.
   */
  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this._breadcrumbs$.next(breadcrumbs);
  }
}
