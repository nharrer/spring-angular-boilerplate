import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ProgressService } from '../services/progress.service';

export const canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);
    const progressService = inject(ProgressService);

    return progressService.wrapLoading(authService.checkLogin()).pipe(
        map((loggedIn) => {
            if (!loggedIn) {
                const s = state;
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
            return loggedIn;
        }),
        catchError(() => {
            router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return of(false);
        })
    );
};

export const canActivateLoggedIn: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => canActivate(route, state);
