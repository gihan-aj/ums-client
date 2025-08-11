import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fade', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
    trigger('slide', [
      state('void', style({ transform: 'translateY(-30px) scale(0.95)' })),
      state('*', style({ transform: 'translateY(0) scale(1)' })),
      transition('void <=> *', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ModalComponent {
  @Output() closed = new EventEmitter<void>();

  // Listen for escape key to close the modal
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey() {
    this.close();
  }

  close() {
    this.closed.emit();
  }
}
