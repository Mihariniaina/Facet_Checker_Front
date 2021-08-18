import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspaceMessageBottomComponent } from './espace-message-bottom.component';

describe('EspaceMessageBottomComponent', () => {
  let component: EspaceMessageBottomComponent;
  let fixture: ComponentFixture<EspaceMessageBottomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspaceMessageBottomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EspaceMessageBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
