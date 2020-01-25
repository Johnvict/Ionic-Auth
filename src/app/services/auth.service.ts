import { LoginResponse, LoginUser } from '../../models/structs';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Events } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import * as BCRYPT from 'bcryptjs';
import { CommonService } from './common.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	authStatus: BehaviorSubject<boolean> = new BehaviorSubject(false);
	authType: BehaviorSubject<string> = new BehaviorSubject('local');
	sessionType: BehaviorSubject<string> = new BehaviorSubject('user');
	isUserLoggedIn = false;
	salt = BCRYPT.genSaltSync(2, 10);
	constructor(private events: Events, private commonService: CommonService, private http: HttpClient) {
		console.log('AuthStatus service is working');
		this.loadAuthData();
		this.authStatusWatch();
		this.listenToEvents();
	}

	listenToEvents() {
		this.events.subscribe('user:logged in', ([userData, loginData]) => {
			console.log(userData, loginData);
			this.registerAuth(userData, loginData);
		});
	}

	registerAuth(userData: LoginResponse, loginData) {
		if (userData.status === '00') {
			// REgister on device
			const token = { token: btoa(`Bearer ${userData.token.token}`), expires_in: this.setTokenExpiration(userData.token.expires_in) };
			const userProfile = { ...userData.token.user_profile, ...this.setUserData(loginData) };
			const sessionType = userData.token.user_profile.is_admin === '0' ? 'user' : 'admin';
			const authType = 'remote';

			this.sessionType.next(sessionType);
			this.registerLocalAuth(sessionType, authType);
			this.commonService.saveTolocalStorage({userProfile, token});
		}
	}

	registerLocalAuth(sessionType = 'user', authType = 'local') {
		this.authStatus.next(true);
		this.authType.next(authType);
		this.sessionType.next(sessionType);
		this.commonService.saveTolocalStorage({sessionType, authType});
	}

	setTokenExpiration(timeInMinute: string): number {
		// Cast token expiry into number, subtract 1 minute and return time in the future when token will expire based on time received as timeInMinute
		return new Date(new Date().getTime() + (Number(timeInMinute) - 1) * 60 * 1000).getTime();
	}

	setUserData(loginData): LoginUser {
		return {email: loginData.email, password: this.hashPassword(loginData.password)};
	}

	setUserAuthStatus(isloggedIn: boolean, data?: any) {
		localStorage.setItem('signedInUserData', JSON.stringify(data));
		this.authStatus.next(isloggedIn);
		localStorage.setItem('sessionType', 'user');
	}

	getuserAuthStatus() {
		return this.authStatus.asObservable();
	}

	authStatusWatch() {
		this.getuserAuthStatus().subscribe(status => {
			this.isUserLoggedIn = status;
		});
	}

	loadAuthData() {
		// this.userData = JSON.parse(localStorage.getItem('signedInUserData'));
	}

	async loginDevice(password, harshPassword): Promise<boolean> {
		return await this.checkPassword({password, harshPassword});
	}

	private checkPassword(data: {password: string, harshPassword: string}): boolean {
		return BCRYPT.compareSync(data.password, data.harshPassword);
	}

	hashPassword(password: string): string {
		return BCRYPT.hashSync(password, this.salt);
	}

}
