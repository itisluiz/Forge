import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

const projects : any = [
  {
    name: 'Project 1',
    description: 'Description for Project 1'
  },
  {
    name: 'Project 2',
    description: 'Description for Project 2'
  },
  {
    name: 'Project 3',
    description: 'Description for Project 3'
  }
]

@Component({
  selector: 'app-select-project-page',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ],
  templateUrl: './select-project-page.component.html',
  styleUrl: './select-project-page.component.scss'
})
export class SelectProjectPageComponent {

  dataSource = [...projects];

}
