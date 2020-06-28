import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;
  texto: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    if (localStorage.getItem('emailUsuario')) {
      this.usuario.email = localStorage.getItem('emailUsuario');
      this.recordarme = true;
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false, type: 'info', text: 'Espere por favor...', timer: 100000
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(resp => {
      console.log(resp);
      Swal.close();

      if (this.recordarme) {
        localStorage.setItem('emailUsuario', this.usuario.email);
      }

      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err.error.error.message);
      if (err.error.error.message === 'EMAIL_NOT_FOUND') {
        this.texto = 'El correo no se encontró.';
      } else if (err.error.error.message === 'INVALID_PASSWORD') {
        this.texto = 'La contraseña no es válida.';
      } else if (err.error.error.message === 'USER_DISABLED') {
        this.texto = 'La cuenta del usuario ha sido desactivada.';
      } else {
        this.texto = 'Otro error...';
      }
      Swal.fire({
        type: 'error', title: 'Error de autenticación', text: this.texto
      });
    });
  }

}
