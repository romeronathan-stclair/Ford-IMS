import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { PlantService } from 'src/services/plant.service';
import { SharedService } from 'src/services/shared.service';
import { SpinnerService } from 'src/services/spinner.service';

@Component({
  selector: 'app-invite-one-user',
  templateUrl: './invite-one-user.component.html',
  styleUrls: ['./invite-one-user.component.scss']
})
export class InviteOneUserComponent {
  
}
