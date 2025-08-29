import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';

  // These will be set by the DialogService
  public onConfirm!: () => void;
  public onCancel!: () => void;
}
