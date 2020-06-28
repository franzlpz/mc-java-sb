import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SignosService } from 'src/app/_service/signos.service';
import { Signos } from 'src/app/_model/signos';
import { switchMap, map } from 'rxjs/operators';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Paciente } from 'src/app/_model/paciente';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SignosDialogoComponent } from '../signos-dialogo/signos-dialogo.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  pacientes: Paciente[] = [];
  pacienteSeleccionado: Paciente;
  pacientesFiltrados: Observable<any[]>;
  //utiles para el autocomplete
  myControlPaciente: FormControl = new FormControl();

  frm: FormGroup;
  id: number;
  edicion: boolean;
  mensaje: string;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private pacienteService: PacienteService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.frm = new FormGroup({
      'id' : new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha' : new FormControl(''),
      'temperatura' : new FormControl(''),
      'pulso' : new FormControl(''),
      'ritmo' : new FormControl('')
    })

    this.route.params.subscribe( (params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
    });

    this.listarPacientes();

    this.pacientesFiltrados = this.myControlPaciente.valueChanges.pipe(map(val => this.filtrarPacientes(val)))
  }

  get f() { return this.frm.controls; }


  initForm(){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.frm = new FormGroup({
          'id': new FormControl(data.idSignos),
          'paciente': new FormControl(data.paciente),
          'fecha' : new FormControl(data.fecha),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmo': new FormControl(data.ritmo)
        });
      });
    }


  }

  registrar(){

    if(this.frm.invalid){
      return;
    }

    let signos = new Signos();
    signos.idSignos = this.frm.value['id'];
    signos.paciente = this.frm.value['paciente'];
    signos.fecha = this.frm.value['fecha'];
    signos.temperatura = this.frm.value['temperatura'];
    signos.pulso = this.frm.value['pulso'];
    signos.ritmo = this.frm.value['ritmo'];

    if(this.edicion){
      //FORMA COMUN
      this.signosService.modificar(signos).subscribe( ()=> {
        this.signosService.listar().subscribe(data => {
          this.signosService.signosCambio.next(data);
          this.signosService.mensajeCambio.next('SE MODIFICO');
        });
      });
    }else{
      //BUENA PRACTICA
      this.signosService.registrar(signos).pipe(switchMap( ()=>{
        return this.signosService.listar();
      })).subscribe( data => {
        this.signosService.signosCambio.next(data);
        this.signosService.mensajeCambio.next('SE REGISTRO');
      });
    }
    this.router.navigate(['signos']);
  }


  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    })
  }

  filtrarPacientes(val : any){
    if(val != null && val.idPaciente > 0){
      return this.pacientes.filter(x =>
        x.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || x.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || x.dni.includes(val.dni)
      );
    }else{
      //string
      return this.pacientes.filter(x =>
        x.nombres.toLowerCase().includes(val.toLowerCase()) || x.apellidos.toLowerCase().includes(val.toLowerCase()) || x.dni.includes(val)
      );
    }
  }

  seleccionarPaciente(e : any){
    this.pacienteSeleccionado = e.option.value;
  }

  mostrarPaciente(val : Paciente){
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  estadoBotonRegistrar() {
    return (this.pacienteSeleccionado === null);
  }

  abrirDialogo(paciente?: Paciente) {
    let pacient = paciente != null ? paciente : new Paciente();
    this.dialog.open(SignosDialogoComponent, {
      width: '250px',
      data: pacient
    });
  }

  limpiarControles() {
    this.pacienteSeleccionado = null;
    this.fechaSeleccionada = new Date();
    this.fechaSeleccionada.setHours(0);
    this.fechaSeleccionada.setMinutes(0);
    this.fechaSeleccionada.setSeconds(0);
    this.fechaSeleccionada.setMilliseconds(0);
    this.mensaje = '';
  }

}
