import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingActivationComponent } from './awaiting-activation.component';

describe('AwaitingActivationComponent', () => {
  let component: AwaitingActivationComponent;
  let fixture: ComponentFixture<AwaitingActivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwaitingActivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwaitingActivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
