import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, merge, Subscription } from 'rxjs';
import { UserProfileListResult } from '../../../shared/models/user-profile-list.result';
import { UserServices } from '../../../shared/user-services';
import { KeywordSearchModel } from '../../../shared/models/keyword-search.model';
import { LoaderService } from 'src/app/shared/loader-service';
import { delay } from 'rxjs/operators';
import { UserTableComponent } from './user-table/user-table.component';
import { UserCardComponent } from './user-card/user-card.component';
import { ChooseTypeComponent } from 'src/app/shared/choose-type.component';
import { ProfileService } from 'src/app/shared/profile.service';

@Component({
  selector: 'app-user',
  templateUrl: 'user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit, OnDestroy {
  type: 'card' | 'table' = 'table';
  keyword: string;
  result$: BehaviorSubject<UserProfileListResult> = new BehaviorSubject<UserProfileListResult>(
    {
      page: 0,
      pageSize: 10,
      pages: 0,
      order: 'name',
      dir: 'acs',
      records: 0,
      data: []
    });
  isSwitched = true;
  @ViewChild(UserTableComponent) tableView: UserTableComponent;
  @ViewChild(UserCardComponent) cardView: UserCardComponent;
  @ViewChild(ChooseTypeComponent) chooseType: ChooseTypeComponent;
  subscription$: Subscription;

  constructor(private router: Router,
              private userServices: UserServices,
              private loader: LoaderService,
              private route: ActivatedRoute,
              public profile: ProfileService) { }

  ngOnInit(): void {
    this.switchView('table');
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }

  switchView(type: 'card' | 'table'): void {
    this.isSwitched = true;
    this.type = type;
    setTimeout(() => {
      if (this.type === 'table') {
        this.tableSubscription();
      } else {
        this.cardSubscription();
      }}, 10);
  }

  tableSubscription(): void {
    this.tableView.paginator.pageIndex = this.result$.value.page;
    this.subscription$ = merge(this.tableView.paginator.page, this.tableView.sort.sortChange).subscribe((x) => {
      this.isSwitched = false;
      const model = {
        dir: this.tableView.sort.direction,
        page: this.tableView.paginator.pageIndex || 0,
        pageSize: this.tableView.paginator.pageSize || 10,
        order: this.tableView.sort.active || this.result$.value.order
      };
      this.onSearch(model);
    });
  }

  cardSubscription(): void {
    this.cardView.paginator.pageIndex = this.result$.value.page;
    this.subscription$ = merge(this.cardView.paginator.page, this.cardView.sort.sortChange)
      .subscribe((x) => {
        this.isSwitched = false;
        const model = {
          dir: this.cardView.sort.direction,
          page: this.cardView.paginator.pageIndex || 0,
          pageSize: this.cardView.paginator.pageSize || 10,
          order: this.cardView.sort.active || this.result$.value.order
        };
        this.onSearch(model);
    });
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(delay(200)).subscribe((x: KeywordSearchModel) => {
      if (!x || !x.page || !x.pageSize) { this.loader.display(false); return; }
      this.chooseType.changeType(x.view || 'table');
      this.isSwitched = false;
      const model: UserProfileListResult = {
        ...x, data: []
      };
      this.keyword = x.keyword;
      this.result$.next(model);
      this.onSearch(x);
    });
  }

  clearKeyword(): void {
    this.keyword = '';
  }

  onSearch($event?: any): void {
    if (!this.keyword || this.keyword.length === 0 || this.isSwitched) {
      return;
    }
    const model: KeywordSearchModel = $event ? {...$event, keyword: this.keyword} : this.mapModel();

    this.loader.display(true);
    this.userServices.searchUserByKeyWord(model).subscribe(r => {
      this.result$.next(r);
      this.loader.display(false);
    });
  }

  navigateTo(): void {
    this.router.navigate(['user', 'post']);
  }

  edit(id: string): void {
    this.router.navigate(['user', 'edit', id], {queryParams: this.mapModel()});
  }

  mapModel(): KeywordSearchModel {
    const result: KeywordSearchModel = {
      page: this.result$.value ? this.result$.value.page : 0,
      pageSize: this.result$.value ? this.result$.value.pageSize : 10,
      order: this.result$.value ? this.result$.value.order : 'name',
      dir: this.result$.value ? this.result$.value.dir : 'acs',
      keyword: this.keyword,
      view: this.type
    };
    return result;
  }
}
