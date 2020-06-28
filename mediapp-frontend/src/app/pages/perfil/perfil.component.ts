import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../../_model/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: Usuario;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.obtenerNombreUsuarioRol();
  }

  obtenerNombreUsuarioRol(){
    const helper = new JwtHelperService();
    let decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.usuario = new Usuario();
    this.usuario.nombre = decodedToken.user_name;
    this.usuario.roles = decodedToken.authorities;
  }

  irAlHome(){
    this.router.navigate(['paciente']);
  }
}
