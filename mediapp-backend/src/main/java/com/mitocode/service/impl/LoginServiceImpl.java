package com.mitocode.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mitocode.model.Usuario;
import com.mitocode.repo.ILoginRepo;
import com.mitocode.service.ILoginService;

@Service
public class LoginServiceImpl implements ILoginService{
	
	@Autowired
	private ILoginRepo repo;

	@Override
	public Usuario verificarNombreUsuario(String usuario) {
		return repo.verificarNombreUsuario(usuario);
	}

	@Override
	public void cambiarClave(String clave, String nombre) {
		repo.cambiarClave(clave, nombre);
	}
	
	

}
