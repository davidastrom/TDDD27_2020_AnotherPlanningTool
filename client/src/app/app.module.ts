import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	GoogleLoginProvider,
	SocialAuthServiceConfig,
	SocialLoginModule,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		LoginLayoutComponent,
		AppLayoutComponent,
		HomeComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		GraphQLModule,
		HttpClientModule,
		FontAwesomeModule,
		SocialLoginModule,
	],
	providers: [
		{
			provide: 'SocialAuthServiceConfig',
			useValue: {
				autoLogin: false,
				providers: [
					{
						id: GoogleLoginProvider.PROVIDER_ID,
						provider: new GoogleLoginProvider(environment.auth.google.clientId),
					},
				],
			} as SocialAuthServiceConfig,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
