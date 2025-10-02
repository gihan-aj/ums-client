import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Role, RolesQuery } from '../store/roles.state';
import { PaginatedResult } from '../../../shared/models/paginated-result.model';

interface RolePayload {
  name: string;
  description?: string;
  permissionNames: string[];
}

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/roles`;

  /**
   * Fetches the complete list of all roles from the backend.
   */
  getAllRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/all`);
  }

  /**
   * Fetches a paginated list of roles from the API.
   * @param query The query parameters for pagination, sorting, and searching.
   */
  getRoles(query: RolesQuery): Observable<PaginatedResult<Role>> {
    return this.http.post<PaginatedResult<Role>>(`${this.apiUrl}/list`, query);
  }

  /**
   * Fetches a single role by its ID.
   */
  getRoleById(roleId: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${roleId}`);
  }

  /**
   * Creates a new role.
   */
  addRole(payload: RolePayload): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.apiUrl, payload);
  }

  /**
   * Updates an existing role.
   */
  updateRole(roleId: number, payload: RolePayload): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${roleId}`, payload);
  }

  /**
   * Deletes a role by its ID.
   */
  deleteRole(roleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roleId}`);
  }
}
