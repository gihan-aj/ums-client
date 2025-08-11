import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification, NotificationType } from '../../shared/components/notification/notification.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();
  private idCounter = 0;

  show(message: string, type: NotificationType, duration: number = 5000) {
    const newNotification: Notification = {
      id: this.idCounter++,
      message,
      type,
      duration,
    };
    this.notifications.next([...this.notifications.value, newNotification]);
  }

  remove(id: number) {
    const updatedNotifications = this.notifications.value.filter(
      (n) => n.id !== id
    );
    this.notifications.next(updatedNotifications);
  }

  // Convenience methods
  showSuccess(message: string) {
    this.show(message, 'success');
  }
  showError(message: string) {
    this.show(message, 'error');
  }
  showInfo(message: string) {
    this.show(message, 'info');
  }
  showWarning(message: string) {
    this.show(message, 'warning');
  }
}
