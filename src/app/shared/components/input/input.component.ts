import { CommonModule } from '@angular/common';
import { Component, forwardRef, HostBinding, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

// A unique ID for each input instance
let nextId = 0;

@Component({
  selector: 'app-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  /**
   * The FormControl instance passed from the parent form.
   * This is essential for accessing validation state.
   */
  @Input() control: FormControl = new FormControl();
  @Input() label: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() placeholder: string = '';
  @Input() loading: boolean = false;
  @Input() readonly: boolean = false;

  /**
   * An object to map validation error keys to user-friendly messages.
   * Example: { required: 'This field is mandatory.', minlength: 'Too short.' }
   */
  @Input() validationMessages: { [key: string]: string } = {};

  id = `app-input-${nextId++}`;

  // HostBinding allows us to add a class to the host element (<app-input>)
  // when the input is invalid, so we can style it from the outside if needed.
  @HostBinding('class.is-invalid') get isInvalid() {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }

  /**
   * Gets the first validation error message to display.
   */
  get errorMessage(): string | null {
    if (!this.control.errors || !(this.control.touched || this.control.dirty)) {
      return null;
    }

    const errorKeys = Object.keys(this.control.errors);
    const firstErrorKey = errorKeys[0];

    // Return custom message, or a generic one if no mapping is provided.
    return (
      this.validationMessages[firstErrorKey] ||
      `Invalid input for ${this.label}.`
    );
  }

  // --- ControlValueAccessor implementation ---

  // These are the functions that Angular will call to interact with our component.
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  // This method is called by the Forms module to write a value into our component.
  writeValue(value: any): void {
    // We don't need to do anything here since we are using the formControl directly
  }

  // This method is called when the control's value needs to be updated in the model.
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // This method is called when the control is "touched".
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // We handle the input event to propagate changes.
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }
}
