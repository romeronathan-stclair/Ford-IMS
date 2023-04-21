import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/services/auth.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-production-count',
  templateUrl: './production-count.component.html',
  styleUrls: ['./production-count.component.scss']
})
export class ProductionCountComponent {

}
