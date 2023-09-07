import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExitListComponent } from './material-exit-list.component';

describe('MaterialExitListComponent', () => {
  let component: MaterialExitListComponent;
  let fixture: ComponentFixture<MaterialExitListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialExitListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialExitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
