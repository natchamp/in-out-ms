import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialExitComponent } from './material-exit.component';

describe('MaterialExitComponent', () => {
  let component: MaterialExitComponent;
  let fixture: ComponentFixture<MaterialExitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialExitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialExitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
