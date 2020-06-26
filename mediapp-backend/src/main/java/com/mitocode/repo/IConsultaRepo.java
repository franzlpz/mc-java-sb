package com.mitocode.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.mitocode.model.Consulta;

//@Repository
public interface IConsultaRepo extends IGenericRepo<Consulta, Integer>{
	
	//JQPL
	@Query("FROM Consulta c WHERE c.paciente.dni =:dni OR LOWER(c.paciente.nombres) like %:nombreCompleto% or LOWER(c.paciente.apellidos) like %:nombreCompleto%")
	List<Consulta> buscar(@Param("dni") String dni, @Param("nombreCompleto") String nombreCompleto);
	
	// >= <
	@Query("FROM Consulta c WHERE c.fecha between :fechaConsulta and :fechaSgte") //2020-04-30T21:30:52
	List<Consulta> buscarFecha(@Param("fechaConsulta") LocalDateTime fechaConsulta, @Param("fechaSgte") LocalDateTime fechaSgte);
	
	@Query(value = "select * from fn_listarResumen()", nativeQuery = true)
	List<Object[]>listarResumen();
	
	
	//cantidad		fecha
	//[5		,	09/04/2020]
	//[2		, 	28/04/2020]
	//[3		, 	30/04/2019]
}
