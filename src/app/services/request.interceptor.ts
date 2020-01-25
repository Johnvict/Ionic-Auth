import { CommonService } from './common.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { RequestsService } from './requests.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
	loader;
	constructor(
		private notification: NotificationService,
		private router: Router,
		private requests: RequestsService,
		private commonService: CommonService,
		@Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number
		) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		request = request.clone({
			setHeaders: {
				'content-type': 'application/json',
				Accept: 'application/json'
			}
		});

		const token = this.commonService.getFromLocalStorage('token');
		if (token) {
			request = request.clone({
				setHeaders: {
					Authorization: atob(token.token)
				}
			});
		}
		const timeoutValue = request.headers.get('timeout') || this.defaultTimeout;
		if (this.requests.loader.load) {
			this.notification.customLoading(this.requests.loader.text).then(async loader => {
				this.loader = await loader;
				this.loader.present();
			});
		}
		const timeoutValueNumeric = Number(timeoutValue);
		let timer = 0;
		timer += 1;
		return next.handle(request).pipe(timeout(timeoutValueNumeric), map((event: HttpEvent<any>) => {
				const inter = setInterval(() => {
					timer += 1;
					if (timer === 60) {
						timer = 0;
						if (this.requests.loader.load) {
							this.notification.showToast('Request timed out!');
							this.loader.dismiss();
							this.requests.loader.load = false;
						}
						clearInterval(inter);
					}
				}, 1000);
				if (event instanceof HttpResponse) {
					if (timer >= 60) {
						this.notification.showToast('Request timed out! Check your network and try again');
					}
					clearInterval(inter);
					if (this.requests.loader.load) {
						this.loader.dismiss();
						this.requests.loader.load = false;
					}
				}
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				if (this.requests.loader.load) {
					this.loader.dismiss();
					this.requests.loader.load = false;
				}
				if (error.error instanceof ErrorEvent) {
					// A client-side or network error occurred. Handle it accordingly.
					this.manageError({type: 'client-side', message: error.message});
					return throwError(this.manageError({type: 'server-side', message: error.error.message}));
				} else {
					if (error.status === 419) {
						this.notification.showAlert('Please login again to continue', 'Session Expired', [{
							text: 'Ok',
							cssClass: 'primary',
							handler: () => this.router.navigate(['/login'])
						}]);
						this.notification.showToast('Session expired');
						return throwError(this.manageError({type: null, message: null}, false));
					} else {
						return throwError(this.manageError({type: 'server-side', message: error.error.message}));
					}
				}
			})
		);
	}

	manageError(error: {type: string, message: string}, show = true) {
		if (show) { this.notification.showAlert(error.message, 'Request Failed!'); }
	}
}
