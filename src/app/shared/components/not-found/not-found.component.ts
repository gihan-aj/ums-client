import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  RouterLink,
} from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  @Input() title: string = 'Resource Not Found';
  @Input() message: string =
    "We're sorry, but the resource you're looking for doesn't exist or could not be found.";
  @Input() backLink: string | any[] = '/';
  @Input() backLinkText: string = 'Go Back Home';

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const title = this.route.snapshot.data['title'];
    if (title) {
      this.title = title;
    }

    const message = this.route.snapshot.data['message'];
    if (message) {
      this.message = message;
    }
  }
}
