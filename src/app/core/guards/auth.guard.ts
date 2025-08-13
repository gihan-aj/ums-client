import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { Store } from "@ngrx/store";
import { map, Observable, take } from "rxjs";
import { selectAccessToken } from "../../features/auth/store/auth.reducer";

export const authGuard: CanActivateFn = () : Observable<boolean | UrlTree> => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(selectAccessToken).pipe(
        take(1),
        map(token => {
            const isLoggedIn = !!token;
             if(isLoggedIn){
                return true;
             }

             return router.createUrlTree(['/auth/login'], {
                queryParams: {
                    returnUrl: router.routerState.snapshot.url
                }
             });
        })
    )
}