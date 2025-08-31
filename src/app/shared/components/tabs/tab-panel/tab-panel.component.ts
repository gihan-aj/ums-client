import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  imports: [],
  templateUrl: './tab-panel.component.html',
  styleUrl: './tab-panel.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPanelComponent {
  @Input() title: string = 'Tab';
  @Input() disabled: boolean = false;
  isActive: boolean = false;
}
