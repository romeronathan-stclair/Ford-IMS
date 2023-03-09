import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})

export class DepartmentService {
    endPoint: string = `${environment.apiUrl}/auth`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-cache',
    });

    constructor(private http: HttpClient) { }



    getDepartments(query?: string): Observable<any> {

        return this.http.get(`${this.endPoint}/departments${query}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }






}
