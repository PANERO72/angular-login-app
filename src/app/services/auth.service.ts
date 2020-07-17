import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { config } from "./../config/config";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey = config.API_KEY;

  usuarioToken: string;

  constructor(private http: HttpClient) {
    this.obtenerToken();
  }

  // Crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // Inciar sesión
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  logout() {
    localStorage.removeItem('tokenUsuario');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario, returnSecureToken: true
    };

    return this.http.post(`${this.url}signInWithPassword?key=${this.apikey}`, authData).pipe(map(resp => {
      console.log('El operador "map()" funcionó');
      this.guardarToken(resp['idToken']);
      return resp;
    }));
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      //email: usuario.email, password: usuario.password, returnSecureToken: true
      ...usuario, returnSecureToken: true
    };

    return this.http.post(`${this.url}signUp?key=${this.apikey}`, authData).pipe(map(resp => {
      console.log('El operador "map()" funcionó');
      this.guardarToken(resp['idToken']);
      return resp;
    }));
  }

  private guardarToken(idToken: string) {
    this.usuarioToken = idToken;
    localStorage.setItem('tokenUsuario', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expiraToken', hoy.getTime().toString());

  }

  obtenerToken() {
    if (localStorage.getItem('token')) {
      this.usuarioToken = localStorage.getItem('tokenUsuario');
    } else {
      this.usuarioToken = '';
    }

    return this.usuarioToken;
  }

  estaAunteticado(): boolean {
    if (this.usuarioToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expiraToken'));
    const fechaExpiara = new Date();
    fechaExpiara.setTime(expira);

    if (fechaExpiara > new Date()) {
      return true;
    } else {
      return false;
    }

  }
}
