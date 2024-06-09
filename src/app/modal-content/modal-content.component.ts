import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrl: './modal-content.component.scss'
})
export class ModalContentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { genre: any, director: any, description: string }) {
    //data.director.birthdate = data.director.birthdate.split('T')[0];
  }
}