import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { InfoDialogComponent } from '../../shared/components/dialogs/info-dialog/info-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private rootViewContainerRef!: ViewContainerRef;

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
}
