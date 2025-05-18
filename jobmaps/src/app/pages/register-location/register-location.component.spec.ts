import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLocationComponent } from './register-location.component';

describe('RegisterLocationComponent', () => {
  let component: RegisterLocationComponent;
  let fixture: ComponentFixture<RegisterLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
