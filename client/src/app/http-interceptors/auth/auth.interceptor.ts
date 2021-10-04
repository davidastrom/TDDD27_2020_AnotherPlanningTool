import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from 'src/app/services/token/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private tokenService: TokenService) {}

	intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		let authReq = request;
		let token = this.tokenService.getToken();

		if (token) {
			authReq = request.clone({
				headers: request.headers.set('Authorization', `Bearer ${token}`),
			});
		}

		return next.handle(authReq);
	}
}
