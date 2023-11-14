import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public get isAuthenticated(): boolean { return this.authService.isLoggedIn; }
    public get username(): string { return this.authService.userInfo.username; }

    constructor(
        private authService: AuthService
    ) {
    }
}
