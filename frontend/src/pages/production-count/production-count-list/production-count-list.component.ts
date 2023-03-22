import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-production-count-list',
  templateUrl: './production-count-list.component.html',
  styleUrls: ['./production-count-list.component.scss']
})
export class ProductionCountListComponent {
  currentPage = 0;
  length = 100;
  pageSize = 10;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  activePlantId: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  departments: any[] = [];
  displayedColumns: string[] = [
    "name",
    "editInformation",
    "viewProducts"
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private authService: AuthService) { }

  ngOnInit() {
    this.spinnerService.showHide();
    this.activePlantId = this.authService.user.activePlantId;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
  }
}
