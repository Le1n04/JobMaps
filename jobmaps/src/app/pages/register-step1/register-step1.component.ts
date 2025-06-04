// importacion de decoradores y modulos de angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// importacion de servicios personalizados
import { UserService } from '../../services/user.service';
// importacion de servicio de rutas de angular
import { ActivatedRoute } from '@angular/router';

// decorador que define las propiedades del componente
@Component({
  selector: 'app-register-step1', // selector para usar el componente en html
  standalone: true, // componente independiente
  imports: [CommonModule, FormsModule], // modulos importados
  templateUrl: './register-step1.component.html', // ruta del template html
  styleUrls: ['./register-step1.component.scss'],
})
export class RegisterStep1Component {
  // variables para almacenar los datos del formulario
  fullName: string = '';
  age: number | null = null;
  country: string = '';
  acceptedTerms: boolean = false;
  role: string = '';

  // inyeccion de dependencias: router, userService y activatedRoute
  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  // metodo que se ejecuta al iniciar el componente
  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.userService.email = email;
      console.log('Email guardado en UserService:', email);
    }
  }

  // getter para validar que todos los campos del formulario esten completos
  get formValid(): boolean {
    return (
      this.fullName.trim().length > 0 &&
      !!this.age &&
      this.age > 0 &&
      this.country !== '' &&
      this.role !== '' &&
      this.acceptedTerms
    );
  }

  // metodo para continuar al siguiente paso del registro
  continue() {
    if (!this.formValid) return;

    this.userService.fullName = this.fullName;
    this.userService.age = this.age!;
    this.userService.country = this.country;
    this.userService.acceptedTerms = this.acceptedTerms;
    this.userService.role = this.role as 'empresa' | 'desempleado';
    this.router.navigate(['/register-location']);
  }

  // metodo para volver a la pagina anterior
  goBack() {
    this.router.navigate(['/email-login']);
  }
}
