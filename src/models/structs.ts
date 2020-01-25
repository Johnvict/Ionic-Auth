export interface NewRegisterUser {
	name: string;
	email: string;
	phone: string;
	password: string;
	role: string;
}

export interface LoginUser {
	email: string;
	password: string;
}

export interface LoginResponse {
	status: string;
	message: string;
	token: Token;
}

export interface Token {
	token: string;
		token_type: string;
		expires_in: string;
		user_profile: UserProfile;
}

export interface UserProfile {
	is_admin: string;
	is_active: string;
	username?: string;
	email?: string;
	password?: string;
}


export interface LoadingSetter {
	load: boolean;
	text: string;
}

