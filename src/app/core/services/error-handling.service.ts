import { inject, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlingService {
  private notificationService = inject(NotificationService);
  private dialogService = inject(DialogService);

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

    const apiError = error.error;

    // Check for standard validation problem details (status 400)
    if (apiError.title === 'Validation Error' && apiError.errors) {
      const validationErrors = Object.values(
        apiError.errors
      ).flat() as string[];
      this.dialogService.openInfoDialog({
        title: 'Validation Failed',
        messages:
          validationErrors.length > 0 ? validationErrors : [apiError.detail],
        type: 'error',
      });
      let displayMessage = apiError.detail || 'Validation failed.';
      this.notificationService.showError(displayMessage);
      return displayMessage;
    }

    // Handle other structured errors with a toast notification
    let displayMessage =
      apiError.detail || error.message || 'An unexpected error occurred.';
    this.notificationService.showError(displayMessage);
    return displayMessage;
  }
}
