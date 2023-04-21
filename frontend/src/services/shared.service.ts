import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private updateForecastDashboard = new BehaviorSubject<boolean>(false);
    private dataKey = '';

    constructor() { }

    activePlantChanged$ = this.updateForecastDashboard.asObservable();

    refreshDashboardForecast(changed: boolean) {
        this.updateForecastDashboard.next(changed);
    }
    setData(data: any) {
        return new Promise((resolve, reject) => {
            try {
                localStorage.setItem(this.dataKey, JSON.stringify(data));
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    }

    getData() {
        const data = localStorage.getItem(this.dataKey);
        if (data) {
            return JSON.parse(data);
        }
        return {};
    }

    clearData(key: string) {
        localStorage.removeItem(key);
    }

    setDataKey(key: string) {
        this.dataKey = key;
    }

}
