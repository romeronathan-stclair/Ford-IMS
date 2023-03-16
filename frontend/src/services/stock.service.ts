import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})

export class StockService {
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

  getStocks(query?: string): Observable<any> {
    return this.http.get(`${this.endPoint}/stock${query}`, {
      headers: this.baseHeaders,
      observe: 'response',
      withCredentials: true
    });
  }

  createStock(stock: any): Observable<any> {
    return this.http.post(`${this.endPoint}/stock`, stock, {
      headers: this.multiFormDataHeaders,
      observe: 'response',
      withCredentials: true
    });
  }

  editStock(stock: any): Observable<any> {
    return this.http.put(`${this.endPoint}/stock`, stock, {
      headers: this.multiFormDataHeaders,
      observe: 'response',
      withCredentials: true
    });
  }

}
