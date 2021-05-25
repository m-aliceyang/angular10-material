import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { UserProfileListResult } from 'src/app/shared/models/user-profile-list.result';

@Component({
    selector: 'app-user-table',
    templateUrl: `./user-table.component.html`,
    styles: [``]
})
export class UserTableComponent implements OnInit {
    displayedColumns: string[] = ['actions', 'name', 'email', 'branch', 'department', 'roles', 'companies', 'createdByUser',
                'createdDate', 'lastUpdatedByUser', 'lastUpdatedDate', 'active'];
    // dataSource: UserProfileListModel[] = [];
    @Input() data$: BehaviorSubject<UserProfileListResult>;
    @Output() view: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private router: Router) { }

    ngOnInit(): void {
    }

    detail(id): void {
        // this.router.navigate(['user', 'edit', id]);
        this.view.emit(id);
    }


}
