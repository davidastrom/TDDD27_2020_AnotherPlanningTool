import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './components/board/board.component';
import { HomeComponent } from './components/home/home.component';
import { TeamComponent } from './components/team/team.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { AppLayoutComponent } from './layouts/app-layout/app-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';

const routes: Routes = [
	{ path: 'login', component: LoginLayoutComponent },
	{
		path: '',
		component: AppLayoutComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: '',
				component: HomeComponent,
			},
			{
				path: 'team/:teamId',
				component: TeamComponent,
			},
			{
				path: 'board/:boardId',
				component: BoardComponent,
			}
		],
	},
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
exports: [RouterModule],
})
export class AppRoutingModule {}
