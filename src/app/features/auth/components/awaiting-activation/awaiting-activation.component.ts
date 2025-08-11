import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-awaiting-activation',
  imports: [RouterLink],
  templateUrl: './awaiting-activation.component.html',
  styleUrl: './awaiting-activation.component.scss',
})
export class AwaitingActivationComponent {}
