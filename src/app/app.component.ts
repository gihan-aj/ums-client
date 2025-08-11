import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationContainerComponent } from './shared/components/notification-container/notification-container.component';
import { DialogService } from './core/services/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  title = 'ums-client';
  @ViewChild('dialogHost', { read: ViewContainerRef, static: true })
  dialogHost!: ViewContainerRef;

  constructor(private dialogService: DialogService) {}

  // Use ngAfterViewInit to ensure the view is ready
  ngAfterViewInit() {
    // Now that the view is initialized, dialogHost is available.
    // We can safely pass it to our service.
    this.dialogService.setRootViewContainerRef(this.dialogHost);
  }
}
