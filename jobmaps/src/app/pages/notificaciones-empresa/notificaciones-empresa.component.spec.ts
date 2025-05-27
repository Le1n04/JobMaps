import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionesEmpresaComponent } from './notificaciones-empresa.component';

describe('NotificacionesEmpresaComponent', () => {
  let component: NotificacionesEmpresaComponent;
  let fixture: ComponentFixture<NotificacionesEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionesEmpresaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificacionesEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
