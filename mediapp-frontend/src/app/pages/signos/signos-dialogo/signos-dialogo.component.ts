import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PacienteService } from 'src/app/_service/paciente.service';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-signos-dialogo',
  templateUrl: './signos-dialogo.component.html',
  styleUrls: ['./signos-dialogo.component.css']
})
export class SignosDialogoComponent implements OnInit {

  paciente: Paciente;

  constructor(
    private pacienteService : PacienteService,
    private dialogRef: MatDialogRef<SignosDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data : Paciente
  ) { }

  ngOnInit(): void {
    this.paciente = new Paciente();
    this.paciente.idPaciente = this.data.idPaciente;
    this.paciente.nombres = this.data.nombres;
    this.paciente.apellidos = this.data.apellidos;
    this.paciente.dni = this.data.dni;
    this.paciente.direccion = this.data.direccion;
    this.paciente.telefono = this.data.telefono;
  }

  guardar(){

      this.pacienteService.registrar(this.paciente).pipe(switchMap( () => {
        return this.pacienteService.listar();
      })).subscribe(data => {
        this.pacienteService.pacienteCambio.next(data);
        this.pacienteService.mensajeCambio.next('SE REGISTRO');
      });

    this.dialogRef.close();
  }

  cancelar(){
    this.dialogRef.close();
  }

}
