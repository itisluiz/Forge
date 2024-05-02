import { Component, OnInit } from "@angular/core";
import { NavbarComponent } from "../../navbar/navbar.component";
import { MatIcon } from "@angular/material/icon";
import { MatExpansionModule } from '@angular/material/expansion';
import {
	CdkDragDrop,
	CdkDrag,
	CdkDropList,
	CdkDropListGroup,
	moveItemInArray,
	transferArrayItem,
	DragDropModule,
	CdkDragPlaceholder,
  } from '@angular/cdk/drag-drop';

@Component({
	selector: "app-kanban-page",
	standalone: true,
	imports: [
		NavbarComponent, 
		MatIcon, 
		MatExpansionModule, 
		DragDropModule,
		CdkDropListGroup, 
		CdkDropList, 
		CdkDrag,
		CdkDragPlaceholder
	],
	templateUrl: "./epics-page.component.html",
	styleUrl: "./epics-page.component.scss",
})
export class EpicsPageComponent implements OnInit {

	ngOnInit(): void {}

	toDo: any= [
		{
		  name: 'Get to work',
		  description: 'Description for Get to work',
		  currentBehavior: 'Current behavior for Get to work',
		  expectedBehavior: 'Expected behavior for Get to work',
		  photo: '../../../assets/photo.jpeg',
		  type: 'feature'
		},
		{
		  name: 'Pick up groceries',
		  description: 'Description for Pick up groceries',
		  currentBehavior: 'Current behavior for Pick up groceries',
		  expectedBehavior: 'Expected behavior for Pick up groceries',
		  photo: '../../../assets/photo.jpeg',
		  type: 'feature'
		},
		{
		  name: 'Go home',
		  description: 'Description for Go home',
		  currentBehavior: 'Current behavior for Go home',
		  expectedBehavior: 'Expected behavior for Go home',
		  photo: '../../../assets/photo.jpeg',
		  type: 'feature'
		},
		{
		  name: 'Fall asleep',
		  description: 'Description for Fall asleep',
		  currentBehavior: 'Current behavior for Fall asleep',
		  expectedBehavior: 'Expected behavior for Fall asleep',
		  photo: '../../../assets/photo.jpeg',
		  type: 'feature'
		}
	];

	inProgress: any = [
		
	];

	availableReview: any = [

	];

	reviewing: any = [

	];
  
  	done: any = [

	];

	

  	drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}