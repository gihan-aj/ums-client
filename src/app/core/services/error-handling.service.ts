import { inject, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private notificationService = inject(NotificationService);

  /**
   * Parses an HttpErrorResponse, shows a notification, and returns a user-friendly message.
   * @param error The HttpErrorResponse from an API call.
   * @returns A simple string to be used in the UI or stored in NgRx state.
   */
  public handleHttpError(error: HttpErrorResponse): string {
    if (error.status === 0) {
      const message =
        'Could not connect to the server. Please check your network connection.';
      this.notificationService.showError(message);
      return message;
    }

    // The error object from your .NET API
    const apiError = error.error;
    let displayMessage = 'An unexpected error occurred.';

    // Check for standard validation problem details (status 400)
    if (apiError.title === 'Validation Error' && apiError.errors) {
      // We could get more specific here, but for a toast, a general message is often best.
      displayMessage = apiError.detail || 'Please check the form for errors.';
    }
    // Check for other structured errors from your API
    else if (apiError.detail) {
      displayMessage = apiError.detail;
    }
    // Fallback for other types of errors
    else if (error.message) {
      displayMessage = error.message;
    }

    this.notificationService.showError(displayMessage);
    return displayMessage;
  }
}
