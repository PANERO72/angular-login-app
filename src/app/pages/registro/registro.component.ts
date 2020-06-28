import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from '../../models/usuario.model';
import { EMAIL_USER } from '../../config/config';
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  recordarme = false;
  texto: string;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();

    //this.usuario.email = EMAIL_USER;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false, type: 'info', text: 'Espere por favor...'
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(resp => {
      console.log(resp);
      Swal.fire({
        type: 'success', text: '¡Usuario creado con éxito!', showConfirmButton: false, timer: 5000
      });
      //Swal.close();
      if (this.recordarme) {
        localStorage.setItem('emailUsuario', this.usuario.email);
      }
      this.router.navigateByUrl('/home');
    }, (err) => {
      console.log(err.error.error.message);
      if (err.error.error.message === 'EMAIL_EXISTS') {
        this.texto = 'El correo ya existe.';
      } else if (err.error.error.message === 'INVALID_EMAIL') {
        this.texto = 'El correo no es válido.';
      } else if (err.error.error.message === 'TOKEN_EXPIRED') {
        this.texto = 'El Token ha caducado.';
      } else {
        this.texto = 'Otro error...';
      }

      Swal.fire({
        type: 'error', title: 'Error al crear usuario.', text: this.texto
      });
    });
  }

}
