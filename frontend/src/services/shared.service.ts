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
                console.log('setting data' + data + " " + this.dataKey + "");
                localStorage.setItem(this.dataKey, JSON.stringify(data));
                resolve(true);

            } catch (error) {
                reject(error);
            }
        });
    }

    getData() {
        const data = localStorage.getItem(this.dataKey);

        console.log('getting data', this.dataKey);
        if (data) {
            return JSON.parse(data);
        }
        return {};
    }

    clearData(key: string) {
        console.log('clearing data', key);
        localStorage.removeItem(key);
    }

    setDataKey(key: string) {
        this.dataKey = key;
    }

}
