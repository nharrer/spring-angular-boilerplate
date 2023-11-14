import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TestComponent } from './pages/test/test.component';
import { canActivateLoggedIn } from './utils/can-activate-logged-in';

const routes: Routes = [
    {
        path: '', pathMatch: 'full', redirectTo: 'home'
    },
    {
        path: 'home', canActivate: [canActivateLoggedIn], component: HomeComponent
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'test/:orderId', canActivate: [canActivateLoggedIn], component: TestComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(
            routes,
            {
                enableTracing: false,   // <-- debugging purposes only
                useHash: true           // use HashLocationStrategy
            }
        )
    ],
    exports: [
        RouterModule
    ],
    providers: [
    ]
})
export class AppRoutingModule { }
