import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  @Input() title: string = 'Resource Not Found';
  @Input() message: string =
    "We're sorry, but the resource you're looking for doesn't exist or could not be found.";
  @Input() backLink: string | any[] = '/';
  @Input() backLinkText: string = 'Go Back Home';
}
