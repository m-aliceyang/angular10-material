import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { ArrayLengthValidatorFn } from 'src/app/shared/array-length-validator';
import { LoaderService } from 'src/app/shared/loader-service';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { UserProfilePostPutModel } from 'src/app/shared/models/user-profile-post-put.model';
import { UserProfileModel } from 'src/app/shared/models/user-profile.model';
import { UserServices } from 'src/app/shared/user-services';
import { ResetPasswordDialogComponent } from '../reset-password-dialog/reset-password-dialog.component';
import { environment } from '../../../../environments/environment';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog.component';
import { ProfileService } from 'src/app/shared/profile.service';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-post',
  templateUrl: './user-post.component.html',
  styleUrls: ['./user-post.component.scss']
})
export class UserPostComponent implements OnInit, OnDestroy, AfterViewInit {
  form: FormGroup;
  userId: string;
  data$: BehaviorSubject<UserProfileModel> = new BehaviorSubject<UserProfileModel>(null) ;
  isEdit: boolean;
  companies$: BehaviorSubject<CompanyModel[]> = new BehaviorSubject<CompanyModel[]>(null);
  queryParams: any;
  dataArriveSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private serivce: UserServices,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private loader: LoaderService,
              private snack: MatSnackBar,
              public profile: ProfileService) { }

  ngOnInit(): void {
    this.formSetup();
    this.dataArrive();
  }

  ngAfterViewInit(): void {
    const observables = [];
    const companyObservalbe = this.serivce.getCompanies().pipe(
      tap(x => {
        this.companies$.next(x);
        if (!this.isEdit && this.profile.companies.length === 1) {
          const defaultCompanies = this.profile.companies.length === 1 && !this.isEdit ? [this.profile.companies[0].id] : [];
          this.form.get('companies').patchValue(defaultCompanies);
        }
      })
    );
    observables.push(companyObservalbe);

    this.route.paramMap.subscribe(x => {
      this.userId = x.get('id');
      this.isEdit = this.userId && this.userId.length > 0;
      if (this.isEdit) {
        const userObservable = this.serivce.getUserById(this.userId).pipe(
          tap(y => {
            this.data$.next(y);
          })
        );
        observables.push(userObservable);
      }
    });
    this.route.queryParams.subscribe(x => {
      this.queryParams = x;
    });

    forkJoin(observables).pipe(delay(200)).subscribe({
      next: () => this.loader.display(false),
      error: (err) => { console.log(err); this.loader.display(false); }
    });
  }

  ngOnDestroy(): void {
    this.dataArriveSubscription.unsubscribe();
  }

  dataArrive(): void {
    this.dataArriveSubscription = this.data$.subscribe(x => {
      if (!x) { return; }
      const source = {
        name: x.name,
        branch: x.branch,
        department: x.department,
        email: x.email,
        roles: x.roles,
        companies: x.companies.map(y => y.id)
      };
      this.form.setValue(source);
      this.form.get('email').disable();
    });
  }

  formSetup(): void {
    this.form = this.fb.group({
      name: [, [Validators.required, Validators.maxLength(200)]],
      branch: [, [Validators.maxLength(255)]],
      department: [, [Validators.maxLength(255)]],
      email: [, [Validators.email, Validators.required, Validators.maxLength(200)]],
      companies: [[], [ArrayLengthValidatorFn(1)]],
      roles: [[], [ArrayLengthValidatorFn(1)]]
    });
  }

  save(): void {
    if (!this.form.valid) {
      return;
    }
    // const model: UserProfilePostPutModel = {
    //   name: this.form.get('name').value,
    //   email: this.form.get('email').value,
    //   department: this.form.get('department').value,
    //   branch: this.form.get('branch').value,
    //   roles: this.form.get('roles').value,
    //   companies: this.form.get('companies').value
    // };
    this.form.get('email').enable();
    const model: UserProfilePostPutModel = this.form.value;
    if (this.isEdit) {
      this.loader.display(true);
      this.serivce.updateUser(this.userId, model).subscribe(e => {
        this.form.reset(this.form.value, {onlySelf: true});
        const newData: UserProfileModel = {...this.form.value, lastUpdatedDate: new Date(),
          lastUpdatedByUser: 'updated', createdByUser: this.data$.value.createdByUser,
          createdDate: this.data$.value.createdDate, companies: this.data$.value.companies};
        this.data$.next(newData);
        this.form.get('email').disable();
        this.loader.display(false);
        this.snack.open(`user updated successfully`, 'close', {duration: environment.snackDurration});
      });
    } else {
      this.loader.display(true);
      this.serivce.createUser(model).subscribe(e => {
        this.loader.display(false);
        this.snack.open(`user [${e.name}] has been created successfully`, 'close', {duration: environment.snackDurration});
        this.router.navigate(['user', 'edit', e.id]);
      });
    }
  }
  cancel(): void {
    this.router.navigate(['user', 'list'], {queryParams: this.queryParams});
  }

  reset(): void {
    this.dialog.open(ResetPasswordDialogComponent, {
      width: '450px',
      data: {
        id: this.userId,
        name: this.data$.value.name
      }
    });
  }

  suspend(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: `Suspend user: ${this.data$.value.name}`,
        body: `Are you sure to suspend this user?`
      }
    });

    dialogRef.afterClosed().subscribe(e => {
      if (e) {
        this.toggleUserActivation('suspend');
      }
    });
  }

  activate(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: `Activate user: ${this.data$.value.name}`,
        body: `Are you sure to activate this user?`
      }
    });

    dialogRef.afterClosed().subscribe(e => {
      if (e) {
        this.toggleUserActivation('activate');
      }
    });
  }

  toggleUserActivation(action: 'activate' | 'suspend'): void {
    const successful = `${action} user success`;
    const fail = `${action} user failed`;
    const result = action === 'activate' ? true : false;
    const query = action === 'activate' ?
      this.serivce.activateUser(this.userId) :
      this.serivce.suspendUser(this.userId);
    this.loader.display(true);
    query.subscribe(e => {
      this.loader.display(false);
      if (e) {
        const newData: UserProfileModel = {...this.data$.value, isActive: result, lastUpdatedDate: new Date(),
          lastUpdatedByUser: 'updated'};
        this.data$.next(newData);
        this.snack.open(successful, 'close', {duration: environment.snackDurration});
      } else {
        this.snack.open(fail, 'close', {
          duration: environment.snackDurration,
          panelClass: 'app-mat-snack-accent'
        });
      }
    });
  }
}
