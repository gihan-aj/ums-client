import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { Subscription } from 'rxjs';
import { PermissionGroup } from '../../../features/permissions/store/permissions.state';

@Component({
  selector: 'app-permission-tree',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxComponent],
  templateUrl: './permission-tree.component.html',
  styleUrl: './permission-tree.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PermissionTreeComponent),
      multi: true,
    },
  ],
})
export class PermissionTreeComponent
  implements ControlValueAccessor, OnInit, OnChanges, OnDestroy
{
  @Input() allPermissionGroups: PermissionGroup[] = [];
  @Input() mode: 'view' | 'edit' = 'edit';
  @Input() isLoading: boolean = false;

  private fb = inject(FormBuilder);
  private formSubscription: Subscription | undefined;

  permissionForm: FormGroup = this.fb.group({});

  // A Set for quick lookups of selected permissions, used in 'view' mode.
  private selectedPermissionsSet = new Set<string>();

  // Store the last value from writeValue()
  private lastValue: string[] | null = [];

  // ControlValueAccessor methods
  onChange: (value: string[]) => void = () => {};
  onTouched: () => void = () => {};

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isLoading && changes['allPermissionGroups']) {
      this.buildForm();

      // After building the form, re-apply the current value
      this.writeValue(this.lastValue);
    }
  }

  private buildForm(): void {
    // Clear existing controls if the form is being rebuilt
    Object.keys(this.permissionForm.controls).forEach((key) => {
      this.permissionForm.removeControl(key, { emitEvent: false });
    });

    this.allPermissionGroups.forEach((group) => {
      const groupControl = this.fb.group({});
      group.permissions.forEach((permission) => {
        groupControl.addControl(permission.name, this.fb.control(false));
      });
      this.permissionForm.addControl(group.groupName, groupControl);
    });

    this.formSubscription?.unsubscribe();
    this.formSubscription = this.permissionForm.valueChanges.subscribe(
      (value) => {
        const selectedPermissions = this.flattenSelectedPermissions(value);
        this.onChange(selectedPermissions);
      }
    );
  }

  // --- ControlValueAccessor Implementation ---
  writeValue(value: string[] | null): void {
    // Cache the incoming value
    this.lastValue = value;

    const selected = value || [];
    this.selectedPermissionsSet = new Set(selected);

    if (
      this.mode === 'edit' &&
      Object.keys(this.permissionForm.controls).length
    ) {
      const formValue = this.unflattenPermissions(selected);
      this.permissionForm.patchValue(formValue, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.permissionForm.disable({ emitEvent: false });
    } else {
      this.permissionForm.enable({ emitEvent: false });
    }
  }

  // --- Helper Methods ---
  private flattenSelectedPermissions(formValue: any): string[] {
    let selected: string[] = [];
    for (const groupName in formValue) {
      for (const permName in formValue[groupName]) {
        if (formValue[groupName][permName]) {
          selected.push(permName);
        }
      }
    }
    return selected;
  }

  private unflattenPermissions(selected: string[]): any {
    const formValue: { [group: string]: { [perm: string]: boolean } } = {};
    this.allPermissionGroups.forEach((g) => {
      formValue[g.groupName] = {};
      g.permissions.forEach((p) => {
        formValue[g.groupName][p.name] = selected.includes(p.name);
      });
    });
    return formValue;
  }

  // --- Template logic ---
  getGroupControl(groupName: string): FormGroup {
    return this.permissionForm.get(groupName) as FormGroup;
  }

  toggleGroup(groupName: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const groupControl = this.getGroupControl(groupName);
    groupControl.patchValue(
      Object.keys(groupControl.controls).reduce(
        (acc, key) => ({ ...acc, [key]: isChecked }),
        {}
      )
    );
  }

  isGroupIndeterminate(groupName: string): boolean {
    const groupControl = this.getGroupControl(groupName);
    const values = Object.values(groupControl.value);
    const allChecked = values.every((v) => v);
    const noneChecked = values.every((v) => !v);
    return !allChecked && !noneChecked;
  }

  isGroupChecked(groupName: string): boolean {
    const groupControl = this.getGroupControl(groupName);
    return Object.values(groupControl.value).every((v) => v);
  }

  // Helper for view mode to check if a permission is in the selected set
  isPermissionSelected(permissionName: string): boolean {
    return this.selectedPermissionsSet.has(permissionName);
  }

  // Helper for view mode to check if any permissions in a group are selected
  hasAnySelectedInGroup(group: PermissionGroup): boolean {
    return group.permissions.some((p) => this.isPermissionSelected(p.name));
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }
}
