import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppConfig {
    public appName = 'democlient';
    public appTitle = 'Demo Client';
    public apiurl = environment.apiurl;
    public version = environment.version;

    constructor(private http: HttpClient) { }

    /**
     * Loads additional runtime configs from assets/data/runtime-config.json.
     * This is used in APP_INITIALIZER to load stuff before the app is initialized.
     * NOTE: Do not use configs in constructors, which might be called before this.
     * Use ngOnInit() instead.
     * @returns Observable<any>
     */
    public loadAppConfig(): Observable<any> {
        return this.http.get(`./assets/data/runtime-config.json?id=${Date.now()}`).pipe(
            tap((data: any) => {
                if (data.appTitle) {
                    this.appTitle = data.appTitle;
                }
            }),
            catchError(() => of(true))
        );
    }
}
