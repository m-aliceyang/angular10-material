import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServices } from 'src/app/shared/user-services';
import { ResetPasswordDialogData } from '../../../shared/models/reset-password-dialog-data';
import { PasswordStrengthValidatorFn } from '../../../shared/password-strength-validator';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reset-password-dialog',
  templateUrl: './reset-password-dialog.component.html',
  styleUrls: ['./reset-password-dialog.component.scss']
})
export class ResetPasswordDialogComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder,
              private snackbar: MatSnackBar,
              private service: UserServices,
              private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ResetPasswordDialogData) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      pwd: [, [PasswordStrengthValidatorFn(8, 3), Validators.required, Validators.maxLength(64)]],
      sendEmail: [false, []],
      forceChange: [false, []]
    });
  }

  generate(): void {
    this.form.get('pwd').setValue(this.generatePassword());
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  save(): void {
    this.service.resetPassword(this.data.id, this.form.get('pwd').value,
        this.form.get('forceChange').value, this.form.get('sendEmail').value)
        .subscribe(x => {
          if (!x) { return; }
          this.snackbar.open('Reset password successed', 'Done', {
            duration: environment.snackDurration
          });
          this.dialogRef.close(true);
        });
  }

  generatePassword = (
    length = 20,
    wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$@$!%*#?&'
  ) =>
    Array.from(crypto.getRandomValues(new Uint32Array(length)))
      .map((x) => wishlist[x % wishlist.length])
      .join('')
}

