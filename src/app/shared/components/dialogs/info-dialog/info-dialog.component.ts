import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-info-dialog',
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
})
export class InfoDialogComponent {
  @Input() title: string = 'Information';
  @Input() messages: string[] = ['An unknown error occurred.'];
  @Input() type: 'success' | 'error' = 'error';

  // This will be called by the DialogService to close the component
  public close!: () => void;

  get iconClass(): string {
    return this.type === 'success'
      ? 'fa-solid fa-circle-check'
      : 'fa-solid fa-circle-xmark';
  }
}
