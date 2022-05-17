import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColordialogComponent } from './colordialog.component';

describe('ColordialogComponent', () => {
  let component: ColordialogComponent;
  let fixture: ComponentFixture<ColordialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColordialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColordialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
