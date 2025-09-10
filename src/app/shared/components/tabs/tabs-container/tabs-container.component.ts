import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  inject,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { TabPanelComponent } from '../tab-panel/tab-panel.component';
import { startWith, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tabs-container',
  imports: [CommonModule],
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss',
})
export class TabsContainerComponent implements AfterContentInit, OnDestroy {
  // Query for all TabPanelComponents passed in via <ng-content>
  @ContentChildren(TabPanelComponent) tabs!: QueryList<TabPanelComponent>;
  private destroy$ = new Subject<void>();
  // private cdr = inject(ChangeDetectorRef);

  ngAfterContentInit(): void {
    this.tabs.changes
      .pipe(startWith(null), takeUntil(this.destroy$))
      .subscribe(() => {
        // Defer the tab selection to the next microtask to avoid the ExpressionChangedAfterItHasBeenCheckedError.
        Promise.resolve().then(() => {
          this.initializeActiveTab();
        });
      });
    // // Find the first tab that is not disabled
    // const firstEnabledTab = this.tabs.find((tab) => !tab.disabled);

    // // If there's an enabled tab, select it by default
    // if (firstEnabledTab) {
    //   this.selectTab(firstEnabledTab);
    // }
    // // We need to manually trigger change detection here because the tabs are now initialized.
    // this.cdr.detectChanges();
  }

  private initializeActiveTab(): void {
    const activeTabs = this.tabs.filter((tab) => tab.isActive);

    // If no tab is currently active or the active tab is no longer present,
    // select the first available, non-disabled tab.
    if (activeTabs.length === 0 || !this.tabs.some((t) => t.isActive)) {
      const firstEnabledTab = this.tabs.find((tab) => !tab.disabled);
      if (firstEnabledTab) {
        this.selectTab(firstEnabledTab);
      }
    }
  }

  selectTab(selectedTab: TabPanelComponent): void {
    // Do nothing if the tab is disabled or already active
    if (selectedTab.disabled || selectedTab.isActive) {
      return;
    }

    // Deactivate all other tabs
    this.tabs.forEach((tab) => {
      tab.isActive = false;
    });

    // Activate the selected tab
    selectedTab.isActive = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
