import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    endPoint: string = `${environment.apiUrl}/auth`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-cache',
    });

    constructor(private http: HttpClient) { }

    setUser(obj: any) {
        const {
            _id,
            name,
            email,
            plants,
            role,
            deactivatedDate,
            passwordResetToken,
            passwordResetExpires,
        } = obj;
        this.user = {
            _id,
            name,
            email,
            plants,
            role,
            deactivatedDate,
            passwordResetToken,
            passwordResetExpires,
        };


    }

    signin(creds: string): Observable<any> {
        return this.http.post<any>(`${this.endPoint}/signin`, creds, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }

    getUser(): Observable<any> {
        return this.http.get(`${this.endPoint}/user`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }


    signout(): Observable<any> {
        return this.http.get(`${this.endPoint}/signout`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }

    signup(creds: String): Observable<any> {
        return this.http.post<any>(`${this.endPoint}/signup/dev`, creds, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }
    forgotPassword(creds: String): Observable<any> {
        return this.http.post<any>(`${this.endPoint}/forget`, creds, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });

    }
    getUsers(query?: string): Observable<any> {
        return this.http.get(`${this.endPoint}/users`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }


}
