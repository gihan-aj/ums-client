import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0, transform: 'translateY(20px)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class NotificationComponent implements OnInit {
  @Input() notification!: Notification;
  @Output() closed = new EventEmitter<number>();

  ngOnInit() {
    if (this.notification.duration) {
      setTimeout(() => this.onClose(), this.notification.duration);
    }
  }

  onClose() {
    this.closed.emit(this.notification.id);
  }

  // Getter for the icon class
  get iconClass(): string {
    switch (this.notification.type) {
      case 'success':
        return 'fa-solid fa-circle-check';
      case 'error':
        return 'fa-solid fa-circle-xmark';
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'info':
        return 'fa-solid fa-circle-info';
      default:
        return '';
    }
  }
}
