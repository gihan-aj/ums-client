import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, ButtonComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  /**
   * The current active page number.
   */
  @Input() currentPage: number = 1;

  /**
   * The total number of items in the dataset.
   */
  @Input() totalItems: number = 0;

  /**
   * The number of items to display per page.
   */
  @Input() pageSize: number = 10;

  /**
   * Emits the new page number when the user clicks a page button.
   */
  @Output() pageChange = new EventEmitter<number>();

  totalPages: number = 0;
  startItem: number = 0;
  endItem: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePagination();
  }

  private updatePagination(): void {
    if (this.totalItems === 0) {
      this.totalPages = 0;
      this.startItem = 0;
      this.endItem = 0;
      return;
    }

    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.startItem = (this.currentPage - 1) * this.pageSize + 1;
    this.endItem = Math.min(
      this.startItem + this.pageSize - 1,
      this.totalItems
    );
  }

  /**
   * Emits the pageChange event with the new page number.
   * @param newPage The page number to navigate to.
   */
  goToPage(newPage: number): void {
    if (
      newPage >= 1 &&
      newPage <= this.totalPages &&
      newPage !== this.currentPage
    ) {
      this.pageChange.emit(newPage);
    }
  }
}
