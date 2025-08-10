import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

// Define possible button variants
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'icon';

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
   * Optional: The CSS class for an icon to display.
   * e.g., 'fa-solid fa-plus' for Font Awesome.
   */
  @Input() icon: string | null = null;

  /**
   * The position of the icon relative to the text.
   */
  @Input() iconPosition: 'left' | 'right' = 'left';

  /**
   * Binds the 'disabled' attribute to the host element for accessibility
   * and to prevent events on the custom component itself when disabled.
   */
  @HostBinding('attr.aria-disabled') get ariaDisabled() {
    return this.disabled || this.loading;
  }

  @HostBinding('class.is-loading') get isLoadingClass() {
    return this.loading;
  }
}
