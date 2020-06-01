import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { LoginComponent } from './components/login/login.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';

import { AuthService } from './auth/auth.service';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
	declarations: [AppComponent, LoginComponent, ProfileListComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		GraphQLModule,
		HttpClientModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatCardModule,
		FlexLayoutModule,
		MatButtonModule,
		FontAwesomeModule,
	],
	providers: [AuthService],
	bootstrap: [AppComponent],
})
export class AppModule {}
