import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDn.DialogComponent } from './shipment-dn.dialog.component';

describe('ShipmentDn.DialogComponent', () => {
  let component: ShipmentDn.DialogComponent;
  let fixture: ComponentFixture<ShipmentDn.DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShipmentDn.DialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentDn.DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
