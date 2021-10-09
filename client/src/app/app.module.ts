import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
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
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { HomeListItemComponent } from './components/home-list-item/home-list-item.component';
import { HomeListComponent } from './components/home-list/home-list.component';
import { httpInterceptorProviders } from './http-interceptors/http-interceptors';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { AuthService } from './services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { TeamComponent } from './components/team/team.component';
import { BoardComponent } from './components/board/board.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberListItemComponent } from './components/member-list-item/member-list-item.component';

const graphQlUri = environment.apiUrl + '/graphql'; // <-- add the URL of the GraphQL server here
@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		LoginLayoutComponent,
		AppLayoutComponent,
		HomeComponent,
		ProfileInfoComponent,
		HomeListItemComponent,
		HomeListComponent,
  TeamComponent,
  BoardComponent,
  MemberListComponent,
  MemberListItemComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		FontAwesomeModule,
		SocialLoginModule,
		FormsModule,
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
		AuthService,
		{
			provide: APOLLO_OPTIONS,
			useFactory: (httpLink: HttpLink) => {
				return {
					cache: new InMemoryCache(),
					link: httpLink.create({
						uri: graphQlUri,
					}),
				};
			},
			deps: [HttpLink],
		},
		httpInterceptorProviders,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
