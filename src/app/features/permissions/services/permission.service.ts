import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { PermissionGroup } from '../store/permissions.state';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/permissions`;

  /**
   * Fetches the complete list of all available permissions, grouped by resource.
   */
  getAllPermissions(): Observable<PermissionGroup[]> {
    return this.http.get<PermissionGroup[]>(this.apiUrl);
  }
}
