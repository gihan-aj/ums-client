import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TabPanelComponent } from '../../../../shared/components/tabs/tab-panel/tab-panel.component';
import { TabsContainerComponent } from '../../../../shared/components/tabs/tabs-container/tabs-container.component';
import { UserDetails } from '../../store/users.state';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule, TabsContainerComponent, TabPanelComponent],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  @Input() user!: UserDetails;
  @Input() isEditMode: boolean = false;
}
