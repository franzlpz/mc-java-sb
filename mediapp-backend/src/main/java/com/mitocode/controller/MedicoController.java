package com.mitocode.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Medico;
import com.mitocode.service.IMedicoService;


@RestController
@RequestMapping("/medicos")
public class MedicoController {
	
	@Autowired
	private IMedicoService service;
	
	//@PreAuthorize("@authServiceImpl.tieneAcceso('listar')")
	//@PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
	@GetMapping
	public ResponseEntity<List<Medico>> listar() throws Exception{
		List<Medico> lista = service.listar();
		return new ResponseEntity<List<Medico>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Medico> listarPorId(@PathVariable("id") Integer id) throws Exception{
		Medico obj = service.listarPorId(id);
		if(obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO " + id);
		}
		return new ResponseEntity<Medico>(obj, HttpStatus.OK);
	}
	
	//https://docs.spring.io/spring-hateoas/docs/current/reference/html/
	//Hateoas 1.0 = > Spring Boot 2.2
	@GetMapping("/hateoas/{id}")
	public EntityModel<Medico> listarPorIdHateoas(@PathVariable("id") Integer id) throws Exception{
		
		Medico pac = service.listarPorId(id);
		
		//localhost:8080/medicos/{id}
		EntityModel<Medico> recurso = new EntityModel<Medico>(pac);
		WebMvcLinkBuilder linkTo = linkTo(methodOn(this.getClass()).listarPorId(id));
		recurso.add(linkTo.withRel("medico-recurso"));
		return recurso;
	}
	
	/*@PostMapping
	public ResponseEntity<Medico> registrar(@Valid @RequestBody Medico medico){
		Medico obj = service.registrar(medico);
		return new ResponseEntity<Medico>(obj, HttpStatus.CREATED);
	}*/
	
	@PostMapping
	public ResponseEntity<Object> registrar(@Valid @RequestBody Medico medico) throws Exception{
		Medico obj = service.registrar(medico);
		//localhost:8080/medicos/5		
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdMedico()).toUri();
		return ResponseEntity.created(location).build();
	}
	
	@PutMapping
	public ResponseEntity<Medico> modificar(@Valid @RequestBody Medico medico) throws Exception{
		Medico obj = service.modificar(medico);
		return new ResponseEntity<Medico>(obj, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Object> eliminar(@PathVariable("id") Integer id) throws Exception{
		Medico obj = service.listarPorId(id);
		if(obj == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO " + id);
		}
		service.eliminar(id);
		return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
	}

}
