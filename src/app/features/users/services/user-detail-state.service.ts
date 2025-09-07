import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';

/**
 * A state management service provided at the component level for the User Detail page.
 * It acts as a single source of truth for all form groups across different tabs.
 */
@Injectable()
export class UserDetailStateService {
  private forms = new Map<string, FormGroup>();
  private formRegistered$ = new BehaviorSubject<string | null>(null);

  constructor() {}

  /**
   * Registers a form group with the service, allowing the parent component to access it.
   * @param name A unique name for the form (e.g., 'profile', 'roles').
   * @param form The FormGroup instance to register.
   */
  registerForm(name: string, form: FormGroup): void {
    this.forms.set(name, form);
    // Announce that the form is ready
    this.formRegistered$.next(name);
  }

  /**
   * Unregisters a form group, typically called in a component's ngOnDestroy.
   * @param name The name of the form to remove.
   */
  unregisterForm(name: string): void {
    this.forms.delete(name);
  }

  /**
   * Retrieves a specific form group by its name.
   */
  getForm(name: string): FormGroup | undefined {
    return this.forms.get(name);
  }

  /**
   * Checks if all registered forms are valid.
   * @returns True if all forms are valid, otherwise false.
   */
  isValid(): boolean {
    for (const form of this.forms.values()) {
      if (form.invalid) {
        return false;
      }
    }
    return true;
  }

  /**
   * Marks all controls in all registered forms as touched. Useful for showing validation errors.
   */
  markAllAsTouched(): void {
    for (const form of this.forms.values()) {
      form.markAllAsTouched();
    }
  }

  /**
   * Gathers the values from all registered form groups and merges them into a single object.
   * @returns A composite object containing the values from all forms.
   */
  getValue(): any {
    let combinedValue = {};
    for (const [name, form] of this.forms.entries()) {
      combinedValue = { ...combinedValue, ...form.getRawValue() };
    }
    return combinedValue;
  }

  /**
   * Returns an observable that emits the FormGroup once it has been registered.
   * This allows parent components to reactively wait for child forms.
   */
  whenFormReady(name: string): Observable<FormGroup> {
    return this.formRegistered$.pipe(
      filter((formName) => formName === name),
      map(() => this.getForm(name)!)
    );
  }
}
