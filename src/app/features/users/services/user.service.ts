import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User, UserQuery } from '../store/users.state';
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
}
