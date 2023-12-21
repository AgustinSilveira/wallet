import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  

  email: string = '';
  password: string = '';

  

  constructor(private authService: AuthService) {
    
   }
  
login() {
  // Llama al método de inicio de sesión en tu servicio de autenticación
  this.authService.signIn(this.email, this.password, null)
    .then((user) => {
      // Imprime la información del usuario en la consola
      console.log('Usuario autenticado:');
    })
    .catch((error) => {
      console.error('Error al iniciar sesión:', error);
    });
}


  signInWithGoogle(): void {
    this.authService.signInGoogle();
  }

  signInWithFacebook(): void {
    this.authService.signInWithFacebook();
  }

  ngOnInit() {}

}
