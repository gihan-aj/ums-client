import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ButtonComponent } from '../../button/button.component';

export interface DialogConfig {
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonColor?: 'primary' | 'danger';
  type?: 'info' | 'warning' | 'danger';
}

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  @Input() config: DialogConfig = {
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    type: 'info',
  };

  // These will be set by the DialogService
  public onConfirm!: () => void;
  public onCancel!: () => void;

  get iconClass(): string {
    switch (this.config.type) {
      case 'warning':
        return 'fa-solid fa-triangle-exclamation';
      case 'danger':
        return 'fa-solid fa-circle-exclamation';
      case 'info':
      default:
        return 'fa-solid fa-circle-question';
    }
  }
}
