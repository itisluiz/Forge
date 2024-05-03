import { Component, ViewChild, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTable, MatTableModule } from '@angular/material/table';

export interface History {
  type: string;
  key: string;
  subject: string;
  status: string;
  assignee: string;
  priority: string;
  created: string;
}

const ELEMENT_DATA: History[] = [
  { 
    type: 'Feature',
    key: 'TASK-001',
    subject: 'Implement login functionality',
    status: 'In Progress',
    assignee: 'John Doe',
    priority: 'High',
    created: '2022-01-01'
  },
  { 
    type: 'Bug',
    key: 'BUG-001',
    subject: 'Fix navigation bar alignment',
    status: 'Backlog',
    assignee: 'Jane Smith',
    priority: 'Medium',
    created: '2022-01-02'
  },
  { 
    type: 'Tests',
    key: 'BUG-001',
    subject: 'Fix navigation bar alignment',
    status: 'Done',
    assignee: 'Jane Smith',
    priority: 'Low',
    created: '2022-01-02'
  }
];

@Component({
  selector: 'app-backlog-page',
  standalone: true,
  imports: [
    NavbarComponent, 
		MatIcon, 
		MatExpansionModule,
    MatTableModule,
  ],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.scss'
})

export class BacklogPageComponent implements AfterViewInit{

  @ViewChildren('itemCell')
  itemCell!: QueryList<ElementRef>;

  @ViewChildren('statusContainer')
  statusContainer!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.itemCell.forEach(cell => {
      let color;
      switch (cell.nativeElement.textContent.trim()) {
        case 'Feature':
          color = '#6dc955';
          break;
        case 'Bug':
          color = '#CA7B1D';
          break;
        default:
          color = '#1A73DC';
      }
      cell.nativeElement.style.borderLeft = `4px solid ${color}`;
    });

    this.statusContainer.forEach(cell => {
      let color;
      let background;
      let textDecoration;
      let fontWeight;

      switch (cell.nativeElement.textContent.trim()) {
        case 'In Progress':
          color = '#fff';
          background = '#93C088';
          break;
        case 'Available to review':
          color = '#fff';
          background = '#93C088';
          break;
        case 'In review':
          color = '#fff';
          background = '#93C088';
        break;
        case 'Done':
          color = '#fff';
          background = '#187600';
          textDecoration = 'line-through';
          break;
        default:
          color = '#7A7A7A';
          background = '#D8D8D8';
          fontWeight = '400';
      }
      cell.nativeElement.style.backgroundColor = `${background}`;
      cell.nativeElement.style.color = `${color}`;
      cell.nativeElement.style.textDecoration = `${textDecoration}`;
      cell.nativeElement.style.fontWeight = `${fontWeight}`;
    });
  }

  displayedColumns: string[] = ['type', 'key', 'subject', 'status', 'assignee', 'priority', 'created'];
  dataSource = [...ELEMENT_DATA];

  @ViewChild(MatTable)
  table!: MatTable<History>;

  priorityParser(priority: string){
    let pre = "../../../../../assets/";
    let pos = ".svg";

    return pre + priority.toLowerCase() + pos;
  }

}
