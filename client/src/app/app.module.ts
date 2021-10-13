import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
	GoogleLoginProvider,
	SocialAuthServiceConfig,
	SocialLoginModule,
} from 'angularx-social-login';
import { DragDropModule } from '@angular/cdk/drag-drop';
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
import { InMemoryCache, split } from '@apollo/client/core';
import { AuthService } from './services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { TeamComponent } from './components/team/team.component';
import { BoardComponent } from './components/board/board.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { MemberListItemComponent } from './components/member-list-item/member-list-item.component';
import { BoardListComponent } from './components/board-list/board-list.component';
import { BoardListTaskComponent } from './components/board-list-task/board-list-task.component';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

const graphQlUri = environment.apiUrl + '/graphql';
const graphQlWsUri = environment.apiWsUrl + '/graphql'; // <-- add the URL of the GraphQL server here
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
		BoardListComponent,
		BoardListTaskComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		HttpClientModule,
		FontAwesomeModule,
		SocialLoginModule,
		FormsModule,
		DragDropModule,
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
				const https = httpLink.create({
					uri: graphQlUri,
				});

				const wss = new WebSocketLink({
					uri: graphQlWsUri,
					options: {
						reconnect: true,
						connectionParams: {
							authorization: localStorage.getItem('apt-auth-token') || null,
						},
					},
				});

				interface Definition {
					kind: string;
					operation?: string;
				}

				const link = split(
					// split based on operation type
					({ query }) => {
						const { kind, operation }: Definition = getMainDefinition(query);
						return (
							kind === 'OperationDefinition' && operation === 'subscription'
						);
					},
					wss,
					https
				);

				return {
					cache: new InMemoryCache(),
					link: link,
				};
			},
			deps: [HttpLink],
		},
		httpInterceptorProviders,
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
