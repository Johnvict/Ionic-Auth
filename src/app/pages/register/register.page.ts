import { Component, OnInit } from '@angular/core';
import { NewRegisterUser } from 'src/models/structs';
import { CommonService } from 'src/app/services/common.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

	newUser: NewRegisterUser = { name: null, email: null, phone: null, password: null, role: '0' };
	isSessionAdmin = false;
	showPassword = false;
	responseFromAuth: { success: boolean, email: string } = { success: false, email: '' };
	constructor(
		private commonService: CommonService, private notification: NotificationService,
		private request: RequestsService, private events: Events, private router: Router,
	) { }

	ngOnInit() {
	}

	ionViewDidEnter() {
		// localStorage.clear();
		const sessionType = this.commonService.getFromLocalStorage('sessionType');
		if (sessionType && sessionType === 'admin') {
			this.newUser.role = '1';
			this.isSessionAdmin = true;
		}
	}


	async register() {
		console.table(this.newUser);
		this.request.setLoader('..creating account').then(_ => {
			this.request.register(this.newUser).subscribe(response => {
				console.log(response);
				if (response.status === '00') {
					this.notification.showAlert('Please login to complete your profile setup', 'Successfull', [{
						text: 'Ok',
						cssClass: 'primary',
						handler: () => this.router.navigate(['/login'])
					}]);
				}
			}, e => { });

		});
	}

}
