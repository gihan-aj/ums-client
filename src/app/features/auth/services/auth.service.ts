import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

// Define an interface for the login payload
interface LoginPayload {
  email: string;
  password: string;
  deviceId: string;
}

// Define an interface for the successful login response
interface LoginResponse {
  userId: string;
  email: string;
  userCode: string;
  token: string;
  tokenExpiryUtc: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`; // Example API URL structure

  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload);
  }
}
