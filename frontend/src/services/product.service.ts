import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user";

@Injectable({
    providedIn: "root",
})

export class ProductService {
    endPoint: string = `${environment.apiUrl}/auth`;
    user: User = {} as User;

    baseHeaders: HttpHeaders = new HttpHeaders({
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "true",
        "Access-Control-Allow-Credentials": "true",
        "Cache-Control": "no-cache",
    });
    multiFormDataHeaders: HttpHeaders = new HttpHeaders({
        'Access-Control-Allow-Origin': 'true',
        'Cache-Control': 'no-cache',
    });
    constructor(private http: HttpClient) { }

    getProducts(query?: string): Observable<any> {
        return this.http.get(`${this.endPoint}/product${query}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

    createProduct(product: any): Observable<any> {
        return this.http.post(`${this.endPoint}/product`, product, {
            headers: this.multiFormDataHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

    editProduct(product: any): Observable<any> {
        return this.http.put(`${this.endPoint}/product`, product, {
            headers: this.multiFormDataHeaders,
            observe: 'response',
            withCredentials: true
        });
    }
    reassignProductStock(request: any): Observable<any> {
        return this.http.post(`${this.endPoint}/product/reassign-stock`, request, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

    reassignProductDunnage(request: any): Observable<any> {
        return this.http.post(`${this.endPoint}/product/reassign-dunnage`, request, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }
    changeProductionCount(request: any): Observable<any> {
        return this.http.put(`${this.endPoint}/product/change-production-target`, request, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

    deleteProduct(product: any): Observable<any> {
        return this.http.delete(`${this.endPoint}/product/${product}`, {
            headers: this.baseHeaders,
            observe: 'response',
            withCredentials: true
        });
    }

}
