import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from '@angular/material/expansion';
import {MatTable, MatTableModule} from '@angular/material/table';

	export interface History {
		key: string;
		name: string;
		description: string;
		status: string;
		priority: string;
		time_created: string;
	}

	const HISTORIES_DATA: History[] = [
		{
			key: 'HTY-1',
			name: 'História 1',
			description: 'Descrição 1',
			status: "Backlog",
			priority: "Low",
			time_created: '2024-02-01' 	
		},
		{
			key: 'HTY-2',
			name: 'História 2',
			description: 'Descrição 2',
			status: "Development",
			priority: "Medium",
			time_created: '2024-02-01'
		},
		{
			key: 'HTY-3',
			name: 'História 3',
			description: 'Descrição 3',
			status: "Production",
			priority: "Medium",
			time_created: '2024-02-01'
		},
		{
			key: 'HTY-4',
			name: 'História 4',
			description: 'Descrição 4',
			status: "Homologation",
			priority: "High",
			time_created: '2024-02-01'
		}
	];

@Component({
	selector: "app-kanban-page",
	standalone: true,
	imports: [
		NavbarComponent, 
		MatIcon, 
		MatExpansionModule, 
		MatTable,
		MatTableModule,
	],
	templateUrl: "./epics-page.component.html",
	styleUrl: "./epics-page.component.scss",
})
export class EpicsPageComponent implements AfterViewInit {

  displayedColumns: string[] = ['key', 'name', 'description', 'status', 'priority', 'time_created'];

	histories = [...HISTORIES_DATA];

	@ViewChildren('statusContainer')
  statusContainer!: QueryList<ElementRef>;

	ngAfterViewInit(): void {
    this.statusContainer.forEach(cell => {
      let color;
    	let background;
      let textDecoration;
      let fontWeight;

      switch (cell.nativeElement.textContent.trim()) {
        case 'Development': // IN_DEVELOPMENT
          color = '#fff';
          background = '#93C088';
          break;
        case 'Homologation': // IN_HOMOLOGATION
          color = '#fff';
					background = '#1A73DC';
          break;
        case 'Production': // IN_PRODUCTION
					color = '#fff';
          background = '#187600';
          textDecoration = 'line-through';
        break;
        default: // BACKLOG
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

  priorityParser(priority: string){
    let pre = "../../../../../assets/";
    let pos = ".svg";

    return pre + priority.toLowerCase() + pos;
  }

}