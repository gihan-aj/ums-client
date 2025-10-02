import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterContentInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '150ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '150ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class DropdownComponent implements AfterContentInit {
  @Input() align: 'left' | 'right' = 'right';
  public isOpen = false;

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngAfterContentInit(): void {
    this.cdr.detectChanges();
  }

  // Close the dropdown if a click happens outside of this component
  @HostListener('document:click', ['$event'])
  onDoucumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
