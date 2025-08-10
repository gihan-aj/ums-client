import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

// Define possible button variants
type ButtonVariant = 'primary' | 'secondary' | 'danger';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  /**
   * The visual style of the button.
   * Can be 'primary', 'secondary', or 'danger'.
   */
  @Input() variant: ButtonVariant = 'primary';

  /**
   * Whether the button is in a loading state.
   * Disables the button and shows a spinner.
   */
  @Input() loading: boolean = false;

  /**
   * Whether the button is disabled.
   */
  @Input() disabled: boolean = false;

  /**
   * Binds the 'disabled' attribute to the host element for accessibility
   * and to prevent events on the custom component itself when disabled.
   */
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled || this.loading;
  }
}
