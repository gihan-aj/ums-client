import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

interface ResetPasswordPayload {
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
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, payload, {
      withCredentials: true,
    });
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

  /**
   * Requests a new activation email to be sent.
   * @param email The user's email address.
   */
  resendActivation(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/resend-activation`, {
      email,
    });
  }

  /**
   * Requests a password reset link to be sent via email.
   * @param email The user's email address.
   */
  requestPasswordReset(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/request-password-reset`, {
      email,
    });
  }

  /**
   * Submits the new password along with the reset token.
   * @param payload The command containing token, email, and new passwords.
   */
  resetPassword(payload: ResetPasswordPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, payload);
  }

  /**
   * Calls the endpoint to get a new JWT using the HttpOnly refresh token cookie.
   */
  refreshToken(): Observable<any> {
    // The endpoint is called without a body; the browser automatically sends the cookie.
    return this.http.post<any>(
      `${this.apiUrl}/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  /**
   * Calls the backend to invalidate the refresh token and clear the HttpOnly cookie.
   */
  // logout(): Observable<any> {
  //   // This call sends the cookie, which the backend will then remove.
  //   return this.http.post<any>(
  //     `${this.apiUrl}/logout`,
  //     {},
  //     { withCredentials: true }
  //   );
  // }

  /**
   * Calls the backend to invalidate the refresh token and clear the cookie.
   * This call requires the JWT to identify the user session to invalidate.
   */
  logout(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(
      `${this.apiUrl}/logout`,
      {},
      {
        headers: headers,
        withCredentials: true,
      }
    );
  }
}
