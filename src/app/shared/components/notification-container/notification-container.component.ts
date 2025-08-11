import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NotificationComponent } from '../notification/notification.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-container',
  imports: [CommonModule, NotificationComponent],
  templateUrl: './notification-container.component.html',
  styleUrl: './notification-container.component.scss',
})
export class NotificationContainerComponent {
  private notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;

  onClose(id: number) {
    this.notificationService.remove(id);
  }
}
