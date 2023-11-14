import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService
    ) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        if (this.authService.isLoggedIn) {
            const jwttoken = this.authService.jwttoken;
            const isApiUrl = request.url.startsWith(environment.apiurl);
            if (isApiUrl) {
                request = request.clone({
                    setHeaders: { Authorization: `Bearer ${jwttoken}` }
                });
            }
        }

        return next.handle(request);
    }
}
