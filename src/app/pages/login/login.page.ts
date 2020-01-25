import { RequestsService } from './../../services/requests.service';
import { Component, OnInit } from '@angular/core';
import { LoginUser, UserProfile } from 'src/models/structs';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	attemptingUser: LoginUser = { email: null, password: null };
	deviceUserData: UserProfile = { username: null, is_active: null, is_admin: null };
	showPassword = false;

	constructor(
		private commonService: CommonService, private notification: NotificationService,
		private request: RequestsService, private events: Events, private router: Router,
	) {
		// this.attemptingUser = JSON.parse(localStorage.getItem('user'));
	}

	ngOnInit() {
	}

	ionViewDidEnter() {
		this.fetchUserData();
	}

	async fetchUserData() {
		this.deviceUserData = await this.commonService.getFromLocalStorage('userProfile');
		console.log('user data obtained', this.deviceUserData);
	}


	async login() {
		this.request.setLoader('..processing').then( _ => {
			this.request.login(this.attemptingUser).subscribe( response => {
				console.log(response);
				if (response.status === '00') {
					this.events.publish('user:logged in', [response, this.attemptingUser]);
					this.router.navigate(['/home']);
				}
			}, e => {});

		});

		/**
		 * @networkPlugin Install Network : Should check if device is connected to network
		 * If connected, should try online login
		 *    Then should save user data after login
		 * Else, should try offline login
		 *    If offline unsuccessful
		 *        Then alert "Turn on Internet connection to login first"
		 */

		}

	isUserFound(): boolean {
		if (this.deviceUserData.email.toLowerCase() === this.attemptingUser.email.toLowerCase()) {
			// this.attemptingUser.password = this.deviceUserData.password;
			return true;
		}
		return false;
	}

	async remoteAuth() {
	// 	this.athP.login(this.attemptingUser).subscribe(res => {
	// 		if (res.success) {
	// 			this.cmP.showToast('Login successful', 'bottom', 3000, 'success');
	// 			this.events.publish('done with remote auth', [{ success: res.success, email: res.userData.email }]);
	// 		}
	// 	}, e => {
	// 		this.cmP.showToast('Login unsuccessful', 'bottom', 3000, 'error');
	// 		this.events.publish('done with remote auth', [{ success: false, email: null }]);
	// 	});
	}
}
