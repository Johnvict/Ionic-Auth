import { Injectable } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	loading: any;
	constructor(
		private toastCtrl: ToastController,
		private loadCtrl: LoadingController,
		private alertCtrl: AlertController) {
	}
	async showToast($msg, duration?, position?) {
		const toast = await this.toastCtrl.create({
		message: $msg,
		duration: duration ? duration : 2000,
		position: position ? position : 'top'
		});
		toast.present();
	}

	async showLoading($msg) {
		const loading = await this.loadCtrl.create({
		message: $msg,
		duration: 2000
		});
		await loading.present();
	}

	async showAlert($msg: string, $header= 'Notification', button?: [{text: string, role?: string, cssClass?: string, handler?: object}]) {
		const alert = await this.alertCtrl.create({
			header: $header,
			message: $msg,
			buttons: !button ? [{text: 'Ok'}] : button.map( btn => ({ text: btn.text, cssClass: btn.cssClass, handler: () => btn.handler, role: btn.role }))
		});
		await alert.present();
	}

	async customLoading($msg: string) {
		return await this.loadCtrl.create({
		message: $msg
		});
	}

	async ShowAdvanceAlert($msg, $header, $button) {
		const alert = await this.alertCtrl.create({
		header: $header,
		message: $msg,
		buttons: $button
		});
		await alert.present();
	}

	async showCustomAlert(header, input?, buttons?, loading?) {
		const alert = await this.alertCtrl.create({
		header,
		inputs: input ? input : null,
		buttons: buttons ? buttons : ['Ok']
		});
		alert.present();
	}
}
