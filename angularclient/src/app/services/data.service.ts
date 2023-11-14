import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiError, ApiErrors } from '../model/ApiErrors';
import { UserInfo } from '../model/UserInfo';
import { AppConfig } from './app-config.service';

export const STATUS_NOTFOUND = 'Service not found';
export const STATUS_UNAUTHORIZED = 'Authorization failed';
export const STATUS_FORBIDDEN = 'Access denied';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(
        private httpClient: HttpClient,
        private appConfig: AppConfig
    ) {
    }

    public authenticate(email: string, password: string): Observable<string> {
        const body = {
            email: email,
            password: password
        };
        const url = this.appConfig.apiurl + 'auth/authenticate';
        console.log(`API Call: ${url}`);

        return this.httpClient.post(url, body, { responseType: 'text' }).pipe(
            map((data) => {
                const token = plainToInstance(UserInfo, data);
                return token;
            }),
            catchError(this.handleError)
        );
    }

    public checkAuth(): Observable<string> {
        const url = this.appConfig.apiurl + 'auth/user';
        console.log(`API Call: ${url}`);

        return this.httpClient.get(url, { responseType: 'text' }).pipe(
            map((data) => {
                return data;
            }),
            catchError(this.handleError)
        );
    }

    public test(): Observable<any> {
        const url = this.appConfig.apiurl + 'users/test';
        console.log(`API Call: ${url}`);

        return this.httpClient.get(url).pipe(
            map((data) => {
                return data;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Bei einem Request der einen Blob liefert, ist im Fehlerfall der Content ein json errors-Objekt.
     * Diese Methode wandelt den Blob in das Objekt um.
     */
    private extractErrorsFromBlob(response: any): Observable<never> {
        // Zuerst den Blob in einen string umwandeln
        const fileAsTextObservable =
            new Observable<string>((observer) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const responseText = (e.target as any).result;
                    observer.next(responseText);
                    observer.complete();
                };
                reader.readAsText(response.error);
            });

        // Dann den string als json interpretieren und ein Objekt zurücklieferen mit dem
        // handleError() etwas anfangen kann.
        return fileAsTextObservable.pipe(
            switchMap((errMsgJsonAsText) => {
                const obj = {
                    status: response.status,
                    error: JSON.parse(errMsgJsonAsText)
                };
                return throwError(() => obj);
            })
        );
    }

    private handleError(error: any): Observable<any> {
        const errors = new ApiErrors();
        errors.cause = error;
        console.log(error);

        if (error.error) {
            const errorMessages = error.error;
            if (errorMessages) {
                if (errorMessages.errors) {
                    for (const err of errorMessages.errors) {
                        errors.add(new ApiError(err.message, err.field));
                    }
                } else {
                    errors.add(new ApiError(error.error));
                }
            }
        }

        if (error.status) {
            if (error.status === 404) {
                errors.add(new ApiError(STATUS_NOTFOUND));
            } else if (error.status === 401) {
                errors.add(new ApiError(STATUS_UNAUTHORIZED));
            } else if (error.status === 403) {
                errors.add(new ApiError(STATUS_FORBIDDEN));
            } else if (error.status === 0) {
                errors.add(new ApiError('Server nicht erreichbar'));
            }
        }

        if (errors.errors.length === 0) {
            errors.add(new ApiError('Server Fehler'));
        }

        return throwError(() => errors);
    }
}
