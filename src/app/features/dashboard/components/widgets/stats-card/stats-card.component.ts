import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrl: './stats-card.component.scss',
})
export class StatsCardComponent {
  @Input() title: string = 'Title';
  @Input() value: string | number = '0';
  @Input() icon: string = 'fa-solid fa-question';
  @Input() color: 'blue' | 'green' | 'orange' | 'purple' | string = 'blue';
}
