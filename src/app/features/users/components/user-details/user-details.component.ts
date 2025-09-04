import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabPanelComponent } from '../../../../shared/components/tabs/tab-panel/tab-panel.component';
import { TabsContainerComponent } from '../../../../shared/components/tabs/tabs-container/tabs-container.component';
import { UserDetails } from '../../store/users.state';
import { UserProfileFormComponent } from '../user-profile-form/user-profile-form.component';
import { UserRolesFormComponent } from '../user-roles-form/user-roles-form.component';
import { UserPermissionsComponent } from '../user-permissions/user-permissions.component';

@Component({
  selector: 'app-user-details',
  imports: [
    CommonModule,
    TabsContainerComponent,
    TabPanelComponent,
    UserProfileFormComponent,
    UserRolesFormComponent,
    UserPermissionsComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  @Input() user!: UserDetails;
  @Input() isEditMode: boolean = false;
}
