import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNgxLocalstorage } from 'ngx-localstorage';
import { Observable } from 'rxjs';
import packageJson from '../../package.json';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './pages/app/app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { TestComponent } from './pages/test/test.component';
import { AppConfig } from './services/app-config.service';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { JwtInterceptor } from './services/jwt-interceptor';
import { ProgressService } from './services/progress.service';
import {MatInputModule} from '@angular/material/input';

function initializeApp(appConfig: AppConfig): () => Observable<any> {
    return () => appConfig.loadAppConfig();
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        TestComponent
    ],
    imports: [
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatRadioModule,
        MatListModule,
        MatInputModule
    ],
    providers: [
        AppConfig,
        DataService,
        ProgressService,
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        provideNgxLocalstorage({ prefix: packageJson.name }),
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [AppConfig],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
