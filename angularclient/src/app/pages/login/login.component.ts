import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocalStorageService } from 'ngx-localstorage';
import { ApiErrors } from 'src/app/model/ApiErrors';
import { AuthService } from 'src/app/services/auth.service';
import { ProgressService } from 'src/app/services/progress.service';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    public username = '';
    public password = '';
    public remember = false;
    private returnUrl = '/';
    public error = '';

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private localStorageService : LocalStorageService,
        private authService: AuthService,
        private progressService: ProgressService,
    ) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                // tslint:disable-next-line: no-string-literal
                this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
            }
        });
    }

    public ngOnInit() {
        this.remember = this.localStorageService.get<boolean>('remember') || false;
    }

    public login(): boolean {
        this.progressService.wrapLoading(this.authService.login(this.username, this.password, this.remember)).subscribe({
            next: () => {
                if (this.authService.isLoggedIn) {
                    this.localStorageService.set<boolean>('remember', this.remember);

                    // Redirect to the original page that was targeted before the Authguard redirected to /login
                    this.router.navigateByUrl(this.returnUrl);
                } else {
                    this.router.navigateByUrl('/');
                }
            },
            error: (apiErrors: ApiErrors) => {
                this.error = apiErrors.globalErrorsAsHtml();
            }
        });
        return false;
    }
}
