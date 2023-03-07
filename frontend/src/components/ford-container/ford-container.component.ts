import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ford-container',
  templateUrl: './ford-container.component.html',
  styleUrls: ['./ford-container.component.scss']
})
export class FordContainerComponent {
  @Input() title: string = '';

}
