import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoaderService } from 'src/app/shared/loader-service';
import { ProfileService } from 'src/app/shared/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private loader: LoaderService,
              public profile: ProfileService,
              private route: ActivatedRoute) { }

  error$ = new BehaviorSubject<string>('');

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(x => {
      const msg = x.get('error');
      if (msg && msg.length > 0) {
        this.error$.next(msg);
      }
    });
  }

  get hasError(): boolean {
    return this.error$.value && this.error$.value.length > 0;
  }

  ngAfterViewInit(): void {
    if (!this.profile.identity) {
      this.profile.identity$.subscribe(x => this.loader.display(!this.profile.identity));
    } else {
      setTimeout(() => {
        this.loader.display(false);
      }, 200);
    }
  }
}
