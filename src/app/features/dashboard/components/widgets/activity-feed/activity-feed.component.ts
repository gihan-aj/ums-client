import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-activity-feed',
  imports: [CommonModule],
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.scss',
})
export class ActivityFeedComponent {
  // Dummy data for the activity feed
  activityItems = [
    {
      icon: 'fa-solid fa-user-pen',
      color: 'blue',
      description: "Jane Smith's profile was updated.",
      time: '2 hours ago',
    },
    {
      icon: 'fa-solid fa-shield-halved',
      color: 'orange',
      description: "A new role 'Auditor' was created.",
      time: '8 hours ago',
    },
    {
      icon: 'fa-solid fa-user-check',
      color: 'green',
      description: "John Doe's account was activated.",
      time: 'Yesterday',
    },
    {
      icon: 'fa-solid fa-user-plus',
      color: 'purple',
      description: "A new user 'Mark Johnson' was created.",
      time: '2 days ago',
    },
    {
      icon: 'fa-solid fa-user-slash',
      color: 'red',
      description: "Alex Ray's account was deactivated.",
      time: '2 days ago',
    },
  ];
}
