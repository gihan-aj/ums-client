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
    // 1. Handle network errors (request never reached the server)
    if (error.status === 0) {
      const message =
        'Could not connect to the server. Please check your network connection.';
      this.notificationService.showError(message);
      return message;
    }

    const apiError = error.error;

    // 2. Handle structured errors from your .NET API (apiError has content)
    if (apiError && typeof apiError === 'object') {
      // Handle validation errors with a dialog
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

        const detailMessage = apiError.detail || 'Validation failed.';
        this.notificationService.showError(detailMessage);
        return detailMessage;
      }

      // Handle other structured errors with a toast
      const detailMessage = apiError.detail || 'An unexpected error occurred.';
      this.notificationService.showError(detailMessage);
      return detailMessage;
    }

    // 3. Fallback for non-structured errors (like raw 403, 404, 500 responses)
    let fallbackMessage = `An unexpected error occurred. (Status: ${error.status})`;
    switch (error.status) {
      case 401:
        fallbackMessage = 'You are not authenticated. Please sign in.';
        break;
      case 403:
        fallbackMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        fallbackMessage = 'The requested resource was not found.';
        break;
      case 500:
        fallbackMessage =
          'An internal server error occurred. Please try again later.';
        break;
    }

    this.notificationService.showError(fallbackMessage);
    return fallbackMessage;
  }
}
