import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { GetValuePipe } from '../../pipes/get-value.pipe';

/**
 * Defines the structure for a column in the data table.
 */
export interface ColumnDef<T> {
  key: keyof T | string; // The property name in the data object
  header: string; // The text to display in the table header
  sortable?: boolean; // Whether the column can be sorted
  cellTemplate?: TemplateRef<any>; // Optional custom template for the cell
}

/**
 * Represents the current sort state of the table.
 */
export interface SortChange{
  column: string;
  direction: 'asc' | 'desc'
}

@Component({
  selector: 'app-table',
  imports: [CommonModule, GetValuePipe],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent<T> {
  /**
   * The array of data to be displayed in the table.
   */
  @Input() data: T[] | null = [];

  /**
   * An array of column definitions that configure the table's columns.
   */
  @Input() columns: ColumnDef<T>[] = [];

  /**
   * Whether to display the loading indicator over the table.
   */
  @Input() isLoading: boolean = false;

  /**
   * Emits an event when a sortable column header is clicked.
   */
  @Output() sortChange = new EventEmitter<SortChange>();

  currentSort: SortChange | null = null;

  // A dummy array to create a fixed number of skeleton rows
  skeletonRows = Array(5).fill(0);

  /**
   * Handles the click event on a sortable column header.
   * It determines the new sort direction and emits the sortChange event.
   * @param columnKey The key of the column being sorted.
   */
  onSort(columnKey: keyof T | string): void {
    if (!this.currentSort || this.currentSort.column !== columnKey) {
      // Start with ascending sort for a new column
      this.currentSort = { column: columnKey as string, direction: 'asc' };
    } else if (this.currentSort.direction === 'asc') {
      // Switch to descending
      this.currentSort.direction = 'desc';
    } else {
      // Clear the sort
      this.currentSort = null;
    }

    if (this.currentSort) {
      this.sortChange.emit(this.currentSort);
    }
  }
}
