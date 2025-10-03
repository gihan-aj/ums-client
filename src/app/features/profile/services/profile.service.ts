import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";

interface UpdateProfilePayload {
    firstName: string;
    lastName: string;
}

interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users/me`;

    getProfile() {
        return this.http.get(this.apiUrl);
    }

    updateProfile(payload: UpdateProfilePayload): Observable<void>{
        return this.http.put<void>(this.apiUrl, payload);
    }

    changePassword(payload: ChangePasswordPayload): Observable<void>{
        return this.http.post<void>(`${this.apiUrl}/change-password`, payload);
    }
}