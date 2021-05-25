import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as _moment from 'moment';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TranTypeModel } from 'src/app/shared/models/tran-type.model';
import { DestinationModel } from 'src/app/shared/models/destination.model';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { Co2Services } from 'src/app/shared/co2-services';
import { Co2SearchModel } from 'src/app/shared/models/co2-search.model';
import { Co2Model } from 'src/app/shared/models/co2.model';
import { KeyValuePairModel } from 'src/app/shared/models/key-value-pair.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { ProfileService } from 'src/app/shared/profile.service';
import { LoaderService } from 'src/app/shared/loader-service';

const moment = (_moment as any).default || _moment;

@Component({
  selector: 'app-co2',
  templateUrl: './co2.component.html',
  styleUrls: ['./co2.component.scss'],
})
export class Co2Component implements OnInit, AfterViewInit {
  type: 'card' | 'table' = 'table';
  data$: BehaviorSubject<Co2Model[]> = new BehaviorSubject<Co2Model[]>([]);
  tranTypes$: BehaviorSubject<TranTypeModel[]> = new BehaviorSubject<TranTypeModel[]>([]);
  destinations$: BehaviorSubject<DestinationModel[]> = new BehaviorSubject<DestinationModel[]>([]);
  origins$: BehaviorSubject<DestinationModel[]> = new BehaviorSubject<DestinationModel[]>([]);
  companies$: BehaviorSubject<CompanyModel[]> = new BehaviorSubject<CompanyModel[]>([]);
  years$: BehaviorSubject<KeyValuePairModel[]> = new BehaviorSubject<KeyValuePairModel[]>([]);
  periods$: BehaviorSubject<KeyValuePairModel[]> = new BehaviorSubject<KeyValuePairModel[]>([]);
  panelOpenState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  model: Co2SearchModel = {
    resultType: '1'
  };

  constructor(private service: Co2Services,
              private bar: MatSnackBar,
              public profile: ProfileService,
              private loader: LoaderService)
  {
  }

  ngOnInit(): void {
    let currentYear = 2015;
    const year = [];
    while (currentYear <= new Date().getFullYear()) {
      year.push({key: currentYear, value: currentYear});
      currentYear++;
    }
    this.years$.next(year);

    const months = [];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthNames.forEach((s, i) => {
      months.push({key: i + 1, value: s});
    });
    this.periods$.next(months);
  }

  ngAfterViewInit(): void {
    this.selectSetup();
  }

  selectSetup(): void {
    const companyOb = this.service.getCompanies().pipe(tap(x => {
      this.companies$.next(x);
      if (this.profile.companies.length === 1) {
        this.model.companies = [this.profile.companies[0].id];
      }
    }));
    const tranTypeOb = this.service.getTranTypes().pipe(tap(x => this.tranTypes$.next(x)));
    const destinationOb = this.service.getDestinations().pipe(tap(x => this.destinations$.next(x)));
    const originOb = this.service.getOrigins().pipe(tap(x => this.origins$.next(x)));

    forkJoin([companyOb, tranTypeOb, destinationOb, originOb])
      .subscribe({
        next: (values) => {
          this.loader.display(false);
        },
        error: (err) => {
          console.log(err);
          this.loader.display(false);
        }
      });
  }

  search(): void {
    if (!this.validateModel()){
      this.panelOpenState$.next(true);
      return;
    }
    this.loader.display(true);
    this.service.search(this.model).subscribe(x => {
      this.data$.next(x);
      this.panelOpenState$.next(false);
      this.loader.display(false);
      if (x.length === 0) {
        this.bar.open('there is not record return', 'close', {duration: environment.snackDurration});
      }
    });
  }

  panelOpened(): void {
    this.panelOpenState$.next(true);
  }

  validateModel(): boolean {
    if (!this.profile.isSuper && this.profile?.companies.length === 1) {
      this.model.companies = [this.profile.companies[0].id];
    }
    if (!this.model.companies || this.model.companies.length === 0) {
      this.bar.open('company is required', 'close', {duration: environment.snackDurration, panelClass: 'app-mat-snack-accent'});
      return false;
    }
    if (this.model.resultType === '1' && (!this.model.year1 || !this.model.period1)) {
      this.bar.open('please specify both year 1 and period 1', 'close', {duration: environment.snackDurration, panelClass: 'app-mat-snack-accent'});
      return false;
    } else if (this.model.resultType === '2' && (!this.model.year1 || !this.model.period1 || !this.model.period2)) {
      this.bar.open('please specify year 1, period 1 and period 2', 'close', {duration: environment.snackDurration, panelClass: 'app-mat-snack-accent'});
      return false;
    } else if (this.model.resultType === '3' && (!this.model.year1 || !this.model.period1 || !this.model.year2)) {
      this.bar.open('please specify year 1, period 1 and year 2', 'close', {duration: environment.snackDurration, panelClass: 'app-mat-snack-accent'});
      return false;
    } else if (this.model.resultType === '4' && (!this.model.year1 || !this.model.period1 || !this.model.year2 || !this.model.period2)) {
      this.bar.open('please specify year 1, period 1, year 2 and period 2', 'close', {duration: environment.snackDurration, panelClass: 'app-mat-snack-accent'});
      return false;
    }
    this.model.destination = this.model.destination ? this.model.destination.filter(x => x && x.length > 0) : [];
    this.model.origin = this.model.origin ? this.model.origin.filter(x => x && x.length > 0) : [];
    this.model.tranType = this.model.tranType || '';
    return true;
  }

  reset(): void {
    this.model = {
      resultType: '1'
    };
  }

  clearOD(type: 'origin' | 'destination'): void {
    if (type === 'origin') {
      this.model.origin = [];
    } else {
      this.model.destination = [];
    }
  }

  export(): void {
    if (!this.validateModel()){ return; }
    this.loader.display(true);
    this.service.export(this.model).subscribe(x => {
      const filePrefix = [this.model.origin, this.model.destination, this.model.year1,
        this.model.period1, this.model.year2, this.model.period2];
      const notEmpty = filePrefix.filter(f => f);
      const filename = notEmpty.join('-') + '.csv';

      const url = window.URL.createObjectURL(x);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.loader.display(false);
    });
  }
}
