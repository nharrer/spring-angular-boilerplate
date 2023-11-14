import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { finalize, mergeMap, tap } from 'rxjs/operators';

declare var $:any;

@Injectable({
    providedIn: 'root'
})
export class ProgressService {
    constructor(
    ) {
    }

    public wrapLoading<T>(source: Observable<T>): Observable<T> {
        const delay = 0;
        let timer: any = null;

        const obsShowLoading = of(null).pipe(
            tap(() => {
                timer = setTimeout(() => {
                    // fade-Zeit auf 0 gestellt. Wenn das höher ist, dann erscheint die
                    // Animation oft nicht, wenn man nach dem finalize der ersten Animation
                    // sofort eine Neue startet.
                    // console.log('progress started');
                    $.LoadingOverlay('show', { fade: [0, 0] });
                }, delay);
            }),
            mergeMap(() => {
                return source;
            }),
            finalize(() => {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                $.LoadingOverlay('hide');
                // console.log('progress finished');
            })
        );

        return obsShowLoading;
    }
}
