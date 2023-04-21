import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user";
import { ProductionCountRequest } from "src/models/requests/productionCountRequest";

@Injectable({
    providedIn: "root",
})

export class ProductionCountService {
    endPoint: string = `${environment.apiUrl}/auth`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "true",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-cache",
    });

    constructor(private http: HttpClient) { }

    submitProductionCount(productionCountRequest: ProductionCountRequest): Observable<any> {
        return this.http.post(`${this.endPoint}/production-count`, productionCountRequest, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

}
