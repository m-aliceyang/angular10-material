import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShipmentDnDialogModel } from '../../../shared/models/shipment-dn-dailog.model';
import { ImportTrackingPostPutAmountModel } from '../../../shared/models/import-tracking-post-put.model';

@Component({
  selector: 'app-shipment-dn.dialog',
  templateUrl: './shipment-dn.dialog.component.html',
  styleUrls: ['./shipment-dn.dialog.component.scss']
})
export class ShipmentDnDialogComponent implements OnInit {
  data: {
    systemRef?: string;
    amounts?: ImportTrackingPostPutAmountModel[]
  };

  constructor(private dialogRef: MatDialogRef<ShipmentDnDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public input: ShipmentDnDialogModel) { }

  ngOnInit(): void {
    if (!this.input.amounts || this.input.amounts === [] || this.input.amounts.length === 0) {
      const amts: ImportTrackingPostPutAmountModel[] = [
        { id: 0, debitNoteNumber: '', currency: '', amount: 0, isDirty: false, isRemove: false },
        { id: 0, debitNoteNumber: '', currency: '', amount: 0, isDirty: false, isRemove: false }
      ];
      this.data = {...this.input, amounts: amts};
    } else if (this.input.amounts.length === 1) {
      this.input.amounts
        .push({ id: 0, debitNoteNumber: '', currency: '', amount: 0, isDirty: false, isRemove: false });
      this.data = {...this.input};
    } else {
      this.data = {...this.input};
    }
  }

  valueChanged(item: ImportTrackingPostPutAmountModel): void {
    item.isDirty = true;
  }

  close(save?: boolean): void {
    if (save) {
      this.dialogRef.close(this.data.amounts);
    } else {
      this.dialogRef.close();
    }
  }
}
