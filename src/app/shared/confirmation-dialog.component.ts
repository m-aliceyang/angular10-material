import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ConfirmationDialogModel} from '../shared/models/confirmation-dialog.model';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
  <div fxFlex="100" fxLayout="column">
    <h2 mat-dialog-title fxFlex="100">{{title}}</h2>
    <mat-dialog-content fxFlex="100">
      {{body}}
    </mat-dialog-content>
    <mat-dialog-actions fxFlex="100" fxLayoutAlign="end end">
      <button mat-stroked-button color="default" (click)="close(false)">Cancel</button>
      <button mat-stroked-button color="primary" (click)="close(true)">Confirm</button>
    </mat-dialog-actions>
  </div>
  `,
  styles: [`
    mat-dialog-actions {
      margin-top: 2rem;
      border-top: 1px solid #cfcfcf;
    }
  `]
})
export class ConfirmationDialogComponent {
  title: string;
  body: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogModel,
              public dialogRef: MatDialogRef<ConfirmationDialogComponent>)
  {
    this.title = data.title;
    this.body = data.body;
  }

  close(confirmed): void {
    this.dialogRef.close(confirmed);
  }
}
