import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoritosPageComponent } from './favoritos-page.component';

describe('FavoritosPageComponent', () => {
  let component: FavoritosPageComponent;
  let fixture: ComponentFixture<FavoritosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoritosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
