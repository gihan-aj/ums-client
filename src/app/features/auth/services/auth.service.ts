import { HttpClient, HttpParams } from '@angular/common/http';
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

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

interface SetInitialPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
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

  register(payload: RegisterPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, payload);
  }

  /**
   * Activates a user account using the token from the registration email.
   * @param token The activation token from the URL.
   * @param email The user's email from the URL.
   */
  activateAccount(token: string, email: string): Observable<string> {
    const params = new HttpParams().set('token', token).set('email', email);
    return this.http.get<string>(`${this.apiUrl}/activate`, {
      params,
    });
  }

  /**
   * Sets the initial password for an account created by an admin.
   * @param payload The command containing token, email, and new passwords.
   */
  setInitialPassword(payload: SetInitialPasswordPayload): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/set-initial-password`,
      payload
    );
  }
}
