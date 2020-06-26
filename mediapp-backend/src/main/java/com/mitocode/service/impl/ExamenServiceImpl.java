package com.mitocode.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mitocode.model.Examen;
import com.mitocode.repo.IExamenRepo;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.service.IExamenService;

@Service
public class ExamenServiceImpl extends GenericServiceImpl<Examen, Integer> implements IExamenService{

	@Autowired
	private IExamenRepo repo;
	
	@Override
	protected IGenericRepo<Examen, Integer> getRepo() {		
		return repo; 
	}
	
	/*
	@Override
	public Examen registrar(Examen obj) {
		return repo.save(obj);
	}

	@Override
	public Examen modificar(Examen obj) {		
		return repo.save(obj);
	}

	@Override
	public List<Examen> listar() {
		return repo.findAll();
	}

	@Override
	public Examen listarPorId(Integer id) {
		Optional<Examen> op = repo.findById(id);
		return op.isPresent() ? op.get() : new Examen();
	}

	@Override
	public boolean eliminar(Integer id) {
		repo.deleteById(id);
		return true;
	}*/

}
