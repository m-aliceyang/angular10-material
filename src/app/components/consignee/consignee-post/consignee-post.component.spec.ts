import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsigneePostComponent } from './consignee-post.component';

describe('ConsigneePostComponent', () => {
  let component: ConsigneePostComponent;
  let fixture: ComponentFixture<ConsigneePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsigneePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsigneePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
