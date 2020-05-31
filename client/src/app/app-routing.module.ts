import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', component: ProfileListComponent },
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
