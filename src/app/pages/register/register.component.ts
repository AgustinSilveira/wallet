import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  username: string = '';
  email: string = '';
  password: string = '';
  acceptedTerms: boolean = false;
  selectedFile: File | null = null;

  constructor(private authService: AuthService) { }

  signInWithGoogle() {
    this.authService.signInGoogle();
  }

  // img del register
  onFileSelected(event: any): void {
    // Obtener el archivo seleccionado
    this.selectedFile = event.target.files[0] as File;
  }

  signUp() {
    // Verifica que se hayan aceptado los términos
    if (this.acceptedTerms) {
      // Llama al método de registro en tu servicio de autenticación
      this.authService.signUpWithProfilePicture(this.email, this.password, this.username, this.selectedFile)
        .then((user) => {
          // Imprime la información del usuario en la consola
          console.log('Usuario registrado:');
        })
        .catch((error) => {
          console.error('Error al registrar usuario:', error);
        });
    } else {
      console.error('Debe aceptar los términos y condiciones para registrarse.');
    }
  }
}
