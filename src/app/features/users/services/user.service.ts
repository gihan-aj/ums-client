import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User, UserDetails, UserQuery } from '../store/users.state';
import { Observable } from 'rxjs';

/**
 * Interface for the paginated API response.
 */
export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface AddUserPayload {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  /**
   * Fetches a paginated list of users from the API.
   * @param query The query parameters for pagination, sorting, and searching.
   */
  getUsers(query: UserQuery): Observable<PaginatedResult<User>> {
    let params = new HttpParams()
      .set('page', query.page.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.searchTerm) {
      params = params.set('searchTerm', query.searchTerm);
    }
    if (query.sortColumn && query.sortDirection) {
      params = params.set('sortColumn', query.sortColumn);
      params = params.set('sortDirection', query.sortDirection);
    }

    return this.http.get<PaginatedResult<User>>(this.apiUrl, { params });
  }

  /**
   * Creates a new user.
   * @param payload The data for the new user.
   */
  addUser(payload: AddUserPayload): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(this.apiUrl, payload);
  }

  updateUserProfile(
    id: string,
    payload: { firstName: string; lastName: string }
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, payload);
  }

  assignUserRoles(id: string, roleIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/roles`, { roleIds });
  }

  /**
   * Activates a user account.
   */
  activateUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/activate`, {});
  }

  /**
   * Deactivates a user account.
   */
  deactivateUser(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${userId}/deactivate`, {});
  }

  /**
   * Gets a single user by their ID, including roles and permissions.
   */
  getUserById(userId: string): Observable<UserDetails> {
    return this.http.get<UserDetails>(`${this.apiUrl}/${userId}`);
  }
}
