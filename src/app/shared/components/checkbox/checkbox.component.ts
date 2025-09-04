import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // The forwardRef() is necessary because the component refers to itself.
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true, // This allows multiple value accessors on the same element.
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() label: string = '';

  // Internal state for the checkbox
  public isChecked: boolean = false;
  public isDisabled: boolean = false;

  // A unique ID for associating the label and input for accessibility
  public uniqueId = `app-checkbox-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  // --- ControlValueAccessor implementation ---

  // Placeholder functions for the form to register its callbacks
  private onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  /**
   * This method is called by the Angular Forms module to write a value into our component.
   * It's the bridge from the model to the view.
   */
  writeValue(value: any): void {
    this.isChecked = !!value; // Coerce any input value to a boolean
  }

  /**
   * Registers a callback function that should be called when the checkbox value changes in the UI.
   * This is how we notify the outside world (the form) of changes.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers a callback function that should be called when the control receives a blur event.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * This function is called by the Forms module when the control's disabled state changes.
   */
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Handles the click event on the checkbox, updates the internal state,
   * and notifies the Forms module of the change.
   */
  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.isChecked = target.checked;
    this.onChange(this.isChecked);
    this.onTouched(); // Mark the control as touched when the user interacts with it
  }
}
