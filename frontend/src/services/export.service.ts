import { Injectable } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { Event } from 'src/models/event';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    constructor() { }

    exportToCsv(event: Event, fileName: string): void {
        let header: string[] = [];
        let csvData: any[] = [];

        if (event.modelType === 'Cycle-check') {
            header = [
                'Department Name',
                'Type',
                'Name',
                'Market Location',
                'Part Number',
                'Current Count',
            ];

            event.cycleCheckForm.forEach((cycleCheckForm, index) => {
                const departmentName = cycleCheckForm.departmentName;

                cycleCheckForm.stockList.forEach((stock: any) => {
                    csvData.push({
                        'Department Name': departmentName,
                        Type: 'STOCK',
                        Name: stock.name,
                        'Market Location': stock.marketLocation,
                        'Part Number': stock.partNumber,
                        'Current Count': stock.currentCount,
                    });
                });

                cycleCheckForm.dunnage.forEach((dunnage: any) => {
                    csvData.push({
                        'Department Name': departmentName,
                        Type: 'EMPTY DUNNAGE',
                        Name: dunnage.name,
                        'Market Location': dunnage.marketLocation,
                        'Part Number': '',
                        'Current Count': dunnage.currentCount,
                    });
                });

                // Add an empty row between departments, except for the last department
                if (index < event.cycleCheckForm.length - 1) {
                    csvData.push({});
                }
            });
        }
        else if (event.modelType === 'Sub-assembly') {
            header = [
                'Department Name',
                'Type',
                'Name',
                'Market Location',
                'Part Number',
                'Current Count',
            ];

            event.subAssemblyForm.forEach((subAssemblyForm, index) => {
                const departmentName = subAssemblyForm.departmentName;
                const departmentId = subAssemblyForm.departmentId;


                subAssemblyForm.stockList.forEach((stock: any) => {
                    csvData.push({
                        'Department Name': departmentName,
                        Type: 'STOCK',
                        Name: stock.name,
                        'Market Location': stock.marketLocation,
                        'Part Number': stock.partNumber,
                        'Current Count': stock.currentCount,
                    });
                });
                if (index < event.subAssemblyForm.length - 1) {
                    csvData.push({});
                }
            });
        } else if (event.modelType === 'Production-count') {
            header = [
                'Department Name',
                'Type',
                'Name',
                'Market Location',
                'Part Number',
                'Current Count',
            ];


            event.productionCountForm
                .forEach((productionCountForm,
                    index) => {
                    const departmentName = productionCountForm
                    .departmentName;

                    productionCountForm
.productList.forEach((product: any) => {
                        csvData.push({
                            'Department Name': departmentName,
                            Type: product.modelType,
                            Name: product.name,
                            'Market Location': product.marketLocation,
                            'Part Number': product.partNumber,
                            'Products Built': product.productQtyBuilt,
                        });
                    });


                    // Add an empty row between departments, except for the last department
                    if (index < event.cycleCheckForm.length - 1) {
                        csvData.push({});
                    }
                });
        }

        // Handle other event types similarly...

        const options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: false,
            useBom: true,
            noDownload: false,
            headers: header,
        };

        new ngxCsv(csvData, fileName, options);
    }
}
