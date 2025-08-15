import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const MOBILE_BREAKPOINT = 768; //  Screen width in pixels

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // A BehaviorSubject holds the current value and emits it to new subscribers.
  // We'll default the sidebar to be open on larger screens.
  private _isSidebarOpen$ = new BehaviorSubject<boolean>(true);
  private _isMobile$ = new BehaviorSubject<boolean>(window.innerWidth <= MOBILE_BREAKPOINT)

  // Expose the state as an observable for components to subscribe to.
  public isSidebarOpen$ = this._isSidebarOpen$.asObservable();
  public isMobile$ = this._isMobile$.asObservable();

  constructor(){
    // Initially set the sidebar state on screen size
  }

  /**
   * Toggles the current state of the sidebar.
   */
  public toggleSidebar(): void {
    this._isSidebarOpen$.next(!this._isSidebarOpen$.value);
  }

    /**
   * Checks the screen width and updates the layout state accordingly.
   * This is called by the MainLayoutComponent on window resize.
   * @param width The current window innerWidth.
   */
  public checkScreenSize(width: number): void{
    const isMobile = width <= MOBILE_BREAKPOINT;
    this._isMobile$.next(isMobile);

    // Logic: If we are on a mobile screen, the sidebar should be closed by default.
    // If we are on a desktop screen, it should be open by default.
    this._isSidebarOpen$.next(!isMobile);
  }
}
