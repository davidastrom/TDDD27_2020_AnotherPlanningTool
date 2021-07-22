import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
// import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', component: ProfileListComponent, 
	// canActivate: [AuthGuard] 
},
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
