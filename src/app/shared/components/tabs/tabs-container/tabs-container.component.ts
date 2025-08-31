import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, inject, QueryList } from '@angular/core';
import { TabPanelComponent } from '../tab-panel/tab-panel.component';

@Component({
  selector: 'app-tabs-container',
  imports: [CommonModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabPanelComponent) tabs!: QueryList<TabPanelComponent>;
  private cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    // Find the first tab that is not disabled
    const firstEnabledTab = this.tabs.find((tab) => !tab.disabled);

    // If there's an enabled tab, select it by default
    if (firstEnabledTab) {
      this.selectTab(firstEnabledTab);
    }
    // We need to manually trigger change detection here because the tabs are now initialized.
    this.cdr.detectChanges();
  }

  selectTab(tab: TabPanelComponent) {
    // Prevent selection if the tab is disabled
    if (tab.disabled) {
      return;
    }

    // Deactivate all tabs
    this.tabs.toArray().forEach((t) => (t.isActive = false));
    // Activate the clicked tab
    tab.isActive = true;
  }
}
