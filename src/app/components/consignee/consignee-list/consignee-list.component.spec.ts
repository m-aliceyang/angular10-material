import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneeListComponent } from './consignee-list.component';

describe('ConsigneeListComponent', () => {
  let component: ConsigneeListComponent;
  let fixture: ComponentFixture<ConsigneeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
