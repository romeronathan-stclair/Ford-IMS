import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private dataKey = '';

    constructor() { }

    setData(data: any) {
        localStorage.setItem(this.dataKey, JSON.stringify(data));
    }

    getData() {
        const data = localStorage.getItem(this.dataKey);
        if (data) {
            return JSON.parse(data);
        }
        return {};
    }

    clearData() {
        console.log('clearing data');
        localStorage.removeItem(this.dataKey);
    }

    setDataKey(key: string) {
        this.dataKey = key;
    }

}
