import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AppConfig } from 'src/app/services/app-config.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;

    @ViewChild('sidenav') sidenav: MatSidenav | null = null;

    constructor(
        private router: Router,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef,
        private titleService: Title,
        public appConfig: AppConfig,
        public authService: AuthService
    ) {
        this.titleService.setTitle(this.appConfig.appTitle);

        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logout() {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    closemenu() {
        if (this.sidenav) {
            this.sidenav.close();
        }
    }
}
