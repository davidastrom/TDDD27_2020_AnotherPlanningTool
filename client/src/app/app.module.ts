import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

@NgModule({
	declarations: [AppComponent, LoginComponent, ProfileListComponent],
	imports: [BrowserModule, AppRoutingModule, GraphQLModule, HttpClientModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
