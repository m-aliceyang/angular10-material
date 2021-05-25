import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { env } from 'process';
import { BehaviorSubject, forkJoin, observable, Observable, of } from 'rxjs';
import { switchMap, map, finalize, tap, catchError } from 'rxjs/operators';
import { ConsigneeServices } from 'src/app/shared/consignee-services';
import { LoaderService } from 'src/app/shared/loader-service';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { ConsigneePostModel } from 'src/app/shared/models/consignee-post.model';
import { ConsigneeModel } from 'src/app/shared/models/consignee.model';
import { ProfileService } from 'src/app/shared/profile.service';
import { environment } from 'src/environments/environment';
export interface Consignee {
  consigneeCode: string;
  consigneeName: string;
}
@Component({
  selector: 'app-consignee-post',
  templateUrl: './consignee-post.component.html',
  styleUrls: ['./consignee-post.component.scss']
})
export class ConsigneePostComponent implements OnInit, AfterViewInit {
  data$: BehaviorSubject<ConsigneeModel> = new BehaviorSubject<ConsigneeModel>(null);
  form: FormGroup;
  id: string;
  isEdit: boolean;
  companies$: BehaviorSubject<CompanyModel[]> = new BehaviorSubject<CompanyModel[]>([]);
  queryParams: any;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private service: ConsigneeServices,
              private loader: LoaderService,
              private snack: MatSnackBar,
              public profile: ProfileService) { }

  ngOnInit(): void {
    this.formSetup();
    this.dataAirriveSetup();
    this.route.paramMap.subscribe(x => { this.id = x.get('id'); this.isEdit = this.id && this.id.length > 0; });
    this.route.queryParams.subscribe(x => this.queryParams = x);
  }

  ngAfterViewInit(): void {
    const observables = [];
    const companyObservable = this.service.getCompanies().pipe(
      tap(x => {
        this.companies$.next(x);
        if (!this.isEdit && this.profile.companies.length === 1) {
          const cid = this.profile.companies[0].id;
          this.form.get('companyId').patchValue(cid);
        }
      })
    );
    observables.push(companyObservable);
    if (this.isEdit) {
      const consigneeObservable = this.service.getConsigneeById(this.id).pipe(tap(c => this.data$.next(c)));
      observables.push(consigneeObservable);
    }
    forkJoin(observables).subscribe({
      next: () => this.loader.display(false),
      error: (err) => { console.log(err); this.loader.display(false); }
    });
  }

  formSetup(): void {
    this.form = this.fb.group({
      code: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      companyId: new FormControl(null, [Validators.required])
    });
  }

  dataAirriveSetup(): void {
    this.data$.subscribe(x => {
      if (!x) { return; }
      const source: ConsigneePostModel = {
        code: x.code,
        name: x.name,
        companyId: x.companyId
      };
      this.form.setValue(source);
    });
  }

  save(): void {
    if (!this.form.valid) {
      return;
    }
    const model: ConsigneePostModel = this.form.value;
    this.loader.display(true);
    if (this.isEdit) {
      this.service.updateConsignee(this.id, model)
        .pipe(
          catchError(e => {
            this.loader.display(false);
            return of(null);
          })
        )
        .subscribe(x => {
          if (!x) { return; }
          this.form.reset(this.form.value, {onlySelf: true});
          const newData: ConsigneeModel = {...this.form.value, lastUpdatedDate: new Date(),
            lastUpdatedByUser: 'updated', createdByUser: this.data$.value.createdByUser,
            createdDate: this.data$.value.createdDate};
          this.data$.next(newData);
          this.loader.display(false);
          this.snack.open('consignee updated successfully', 'close', {duration: environment.snackDurration});
      });
    } else {
      this.service.createConsignee(model)
        .pipe(
          catchError(e => {
            this.loader.display(false);
            return of(null);
          })
        ).subscribe(x => {
          if (!x) { return; }
          this.loader.display(false);
          this.snack.open(`consignee [${model.code}] has been created successfully`, 'close', {duration: environment.snackDurration});
          this.router.navigate(['consignee', 'edit', x.id]);
        });
    }
  }

  cancel(): void {
    this.router.navigate(['consignee', 'list'], {queryParams: this.queryParams});
  }
}
