import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { InfoDialogComponent } from '../../shared/components/dialogs/info-dialog/info-dialog.component';
import { AddUserModalComponent } from '../../features/users/components/add-user-modal/add-user-modal.component';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { UsersActions } from '../../features/users/store/users.actions';
import { ConfirmationDialogComponent } from '../../shared/components/dialogs/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private rootViewContainerRef!: ViewContainerRef;
  private destroy$ = new Subject<void>();

  constructor(private actions$: Actions) {}

  setRootViewContainerRef(ref: ViewContainerRef) {
    this.rootViewContainerRef = ref;
  }

  openInfoDialog(data: {
    title: string;
    messages: string[];
    type: 'success' | 'error';
  }) {
    if (!this.rootViewContainerRef) {
      console.error('DialogService: Root ViewContainerRef not set!');
      return;
    }

    // Create the component
    const componentRef: ComponentRef<InfoDialogComponent> =
      this.rootViewContainerRef.createComponent(InfoDialogComponent);

    // Pass data to the component instance
    componentRef.instance.title = data.title;
    componentRef.instance.messages = data.messages;
    componentRef.instance.type = data.type;

    // Provide the close function
    const closeFn = () => {
      this.rootViewContainerRef.remove(
        this.rootViewContainerRef.indexOf(componentRef.hostView)
      );
    };
    componentRef.instance.close = closeFn;
  }

  /**
   * Opens the modal for adding a new user.
   * It also listens for the success action to close itself automatically.
   */
  openAddUserModal() {
    if (!this.rootViewContainerRef) {
      console.error('DialogService: Root ViewContainerRef not set!');
      return;
    }

    const componentRef: ComponentRef<AddUserModalComponent> =
      this.rootViewContainerRef.createComponent(AddUserModalComponent);

    const closeFn = () => {
      this.destroy$.next();
      this.destroy$.complete();
      this.rootViewContainerRef.remove(
        this.rootViewContainerRef.indexOf(componentRef.hostView)
      );
    };
    componentRef.instance.close = closeFn;

    // Listen for the AddUserSuccess action and close the modal automatically
    this.actions$
      .pipe(ofType(UsersActions.addUserSuccess), takeUntil(this.destroy$))
      .subscribe(() => {
        closeFn();
      });
  }

  /**
   * Opens a confirmation dialog.
   * @returns An observable that emits `true` if confirmed, and completes otherwise.
   */
  openConfirmationDialog(data: {
    title: string;
    message: string;
  }): Observable<boolean> {
    const confirmationSubject = new Subject<boolean>();

    const componentRef: ComponentRef<ConfirmationDialogComponent> =
      this.rootViewContainerRef.createComponent(ConfirmationDialogComponent);

    componentRef.instance.title = data.title;
    componentRef.instance.message = data.message;

    const closeDialog = () => {
      confirmationSubject.complete();
      this.rootViewContainerRef.remove(
        this.rootViewContainerRef.indexOf(componentRef.hostView)
      );
    };

    componentRef.instance.onConfirm = () => {
      confirmationSubject.next(true);
      closeDialog();
    };

    componentRef.instance.onCancel = () => {
      confirmationSubject.next(false);
      closeDialog();
    };

    return confirmationSubject.asObservable().pipe(take(1));
  }
}
