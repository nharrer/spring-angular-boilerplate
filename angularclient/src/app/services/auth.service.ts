import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { UserInfo } from '../model/UserInfo';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public static readonly ROLE_USER = 'USER';
    public static readonly ROLE_ADMIN = 'ADMIN';

    public jwttoken = '';
    public userInfo = new UserInfo();
    public isInitialized = false;
    public get isLoggedIn(): boolean {
        return this.jwttoken !== '';
    }

    public get isAdmin(): boolean {
        return this.userInfo && this.userInfo.roles && this.userInfo.roles.some((role) => role === AuthService.ROLE_ADMIN);
    }

    constructor(
        private dataService: DataService,
        private localStorageService: LocalStorageService
    ) {
    }

    public checkLogin(): Observable<boolean> {
        const obs = new Observable<boolean>((subscriber) => {
            // Hier alles innerhalb eines Observable ausführen.
            // Hier können Exceptions passieren, wenn im localStorage
            // Blödsinn drinnen steht
            let loginObservable = of(false);

            if (!this.isLoggedIn) {
                const jwttoken = this.localStorageService.get<string>('jwttoken');
                if (jwttoken) {
                    const userInfo = this.decodeToken(jwttoken);
                    if (userInfo.username !== '') {
                        this.jwttoken = jwttoken;
                        this.userInfo = userInfo;
                    }
                }
            }

            if (this.isLoggedIn) {
                loginObservable = this.checkAuth();
            }

            // nested observable ausführen
            loginObservable.subscribe({
                next: (result) => { subscriber.next(result); },
                error: (err) => { subscriber.error(err); },
                complete: () => { subscriber.complete(); }
            });
        });

        return obs.pipe(
            catchError((err) => {
                this.logout();
                console.log('checkLogin failed:');
                console.log(err);
                return of(false);
            })
        );
    }

    public login(username: string, password: string, remember: boolean | null = null): Observable<boolean> {
        return this.dataService.authenticate(username, password).pipe(
            mergeMap((token) => {
                // console.log('auth ok');
                this.jwttoken = token;
                this.userInfo = this.decodeToken(token);
                console.log(this.userInfo);

                if (remember !== null) {
                    if (remember) {
                        this.localStorageService.set('jwttoken', this.jwttoken);
                    } else {
                        this.localStorageService.remove('jwttoken');
                    }
                }

                return this.loadMasterData();
            })
        );
    }

    public checkAuth(): Observable<boolean> {
        return this.dataService.checkAuth().pipe(
            mergeMap((username: string) => {
                // Also load master data after successful login
                return this.loadMasterData();
            })
        );
    }

    private loadMasterData(): Observable<boolean> {
        return of(true);
        // LOAD MASTER DATA here
    }

    public decodeToken(jwttoken: string): UserInfo {
        const userInfo = new UserInfo();
        const decoded = jwtDecode(jwttoken);
        if (decoded.sub && decoded.exp) {
            const exp = decoded.exp;
            const now = Date.now() / 1000;
            if (exp < now) {
                console.log('JWT token is expired');
                this.logout();
                return userInfo;
            }
            userInfo.username = decoded.sub;
            const authorities = (<any>decoded).authorities;
            if (authorities && Array.isArray(authorities)) {
                authorities.forEach(a => {
                    if (a && a.authority) {
                        userInfo.roles.push(a.authority);
                    }
                });
            }
        }
        return userInfo;
    }

    public logout(): void {
        this.jwttoken = '';
        this.userInfo = new UserInfo();
        this.localStorageService.remove('jwttoken');
    }
}
