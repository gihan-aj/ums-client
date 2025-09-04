import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PermissionGroup, PermissionTreeComponent } from '../../../../shared/components/permission-tree/permission-tree.component';
import { Permission } from '../../store/users.state';

@Component({
  selector: 'app-user-permissions',
  imports: [CommonModule, PermissionTreeComponent],
  templateUrl: './user-permissions.component.html',
  styleUrl: './user-permissions.component.scss',
})
export class UserPermissionsComponent implements OnChanges {
  // Receives the flat array of permissions from the parent
  @Input() permissions: Permission[] = [];

  public groupedPermissions: PermissionGroup[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // Re-calculate the groups whenever the input permissions change
    if (changes['permissions']) {
      this.groupPermissions();
    }
  }

  /**
   * Transforms the flat permission list into a structure grouped by resource,
   * as required by the app-permission-tree component.
   */
  private groupPermissions(): void {
    const groups = new Map<
      string,
      {
        groupName: string;
        permissions: { name: string; description: string }[];
      }
    >();

    this.permissions.forEach((p) => {
      const parts = p.permissionName.split(':');
      if (parts.length < 2) return; // Skip any malformed permissions

      const resource = parts[0];
      const capitalizedResource =
        resource.charAt(0).toUpperCase() + resource.slice(1);

      // We assume a single client "System" for now, as per your suggestion.
      // This can be enhanced later if the API provides more specific client info.
      const groupName = `System: ${capitalizedResource}`;

      if (!groups.has(groupName)) {
        groups.set(groupName, { groupName: groupName, permissions: [] });
      }

      groups.get(groupName)!.permissions.push({
        name: p.permissionName,
        description: p.description,
      });
    });

    this.groupedPermissions = Array.from(groups.values());
  }
}
