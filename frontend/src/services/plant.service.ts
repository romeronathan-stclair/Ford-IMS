import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})

export class PlantService {
    endPoint: string = `${environment.apiUrl}`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': 'true',
        'Access-Control-Allow-Credentials': 'true',
        'Cache-Control': 'no-cache',
    });

    constructor(private http: HttpClient) { }



    getUserPlants(query?: string): Observable<any> {

        return this.http.get(`${this.endPoint}/plants${query}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }
    createPlant(plant: any): Observable<any> {
        return this.http.post(`${this.endPoint}/plant`, plant, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true,
        });
    }




}
