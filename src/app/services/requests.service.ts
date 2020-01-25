import { CommonService } from './common.service';
import { LoginUser, NewRegisterUser, LoadingSetter } from '../../models/structs';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from './../../environments/environment.prod';

@Injectable({
	providedIn: 'root'
})
export class RequestsService {
	private baseURL = env.baseURL;
	userDataDetails: any;
	accountType: string;
	sessionType: string;
	loader: LoadingSetter = { load: false, text: null};
	constructor( public http: HttpClient ) { }

	async setLoader(text) {
		return this.loader = {load: true, text};
	}

	register(params: NewRegisterUser): Observable<any> {
		return this.http.post<any>(`${this.baseURL}/create`, params);
	}

	login(params: LoginUser): Observable<any> {
		return this.http.post<any>(`${this.baseURL}/auth/token`, params);
	}

	getCategories(): Observable<any> {
		return this.http.get<any>(`${this.baseURL}/category`);
	}

}



