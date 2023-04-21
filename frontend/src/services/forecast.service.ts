import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { ProductionCountRequest } from "src/models/requests/productionCountRequest";

@Injectable({
    providedIn: "root",
})

export class ForecastService {
    endPoint: string = `${environment.apiUrl}/auth`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "true",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-cache",
    });

    constructor(private http: HttpClient) { }

    getLowPlantForecasts(): Observable<any> {
        return this.http.get(`${this.endPoint}/forecast/plant/low`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

    getForecast(query: string): Observable<any> {

        return this.http.get(`${this.endPoint}/forecast${query}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }
    getProductForecast(productId: string): Observable<any> {

        return this.http.get(`${this.endPoint}/forecast/${productId}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

}
