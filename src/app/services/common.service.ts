import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import * as BCRYPT from 'bcryptjs';
import * as storageKeys from './app.variables';
@Injectable({
	providedIn: 'root'
})
export class CommonService {

	// errorCode = [
	// 	{ '00': 'Successful', statusCode: 200},
	// 	{ '01': 'Request Token Expired.', statusCode: 419},
	// 	{ '02': 'Created', statusCode: 201},
	// 	{ '03': 'Invalid Credentials', statusCode: 401},
	// 	{ '04': 'User not allowed. Contact Administrator for support', statusCode: 403},
	// 	{ '05': 'Validation Error', statusCode: 406},
	// 	{ '06': 'No Result found', statusCode: 404},
	// 	{ '07': 'Item has been Deleted', statusCode: 410}
	// ];

	constructor( private events: Events ) { }

	onBroadcastEvent(eventTitle, eventData?) {
		eventData ? this.events.publish(eventTitle, eventData) : this.events.publish(eventTitle);
	}

	savePassword(password) {
		localStorage.setItem('password', this.hashPassword(password));
	}


	validatePassword(password): boolean {
		return this.checkPassword({ password, hash: localStorage.getItem('password') });
	}

	private checkPassword(pass: { password: string, hash: string }) {
		return BCRYPT.compareSync(pass.password, pass.hash);
	}

	private hashPassword(pass: string) {
		const salt = BCRYPT.genSaltSync(2, 10);
		const hash = BCRYPT.hashSync(pass, salt);
		return hash;
	}

	async saveTolocalStorage(data): Promise<boolean | ErrorEvent> {
		return new Promise((resolved, reject) => {
			if (typeof(data) === 'object') {
				for (const key in data) {
					if (key) {
						localStorage.setItem(key, JSON.stringify(data[key]));
					}
				}
				resolved(true);
			} else {
				reject (new Error('invalid data provided for local storage'));
			}
		});
	}

	getFromLocalStorage(key) {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	}
	deleteFromLocalStorage(key) {
		return localStorage.removeItem(key);
	}

	setUpNewSession() {
		storageKeys.sessionStorageKeys.forEach(key => this.deleteFromLocalStorage(key));
	}
}

