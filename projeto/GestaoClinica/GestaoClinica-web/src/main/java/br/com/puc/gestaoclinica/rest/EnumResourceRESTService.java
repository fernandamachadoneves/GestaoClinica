/*
 * JBoss, Home of Professional Open Source
 * Copyright 2013, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package br.com.puc.gestaoclinica.rest;

import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import br.com.puc.gestaoclinica.model.Perfil;
import br.com.puc.gestaoclinica.model.TipoResultadoExame;


@Path("/enums")
@RequestScoped
public class EnumResourceRESTService {
	
	@GET
	@Path("/TipoResultadoExame")
	@Produces("application/json")
	public List<TipoResultadoExame> tiposResultado() throws Exception {
		return Arrays.asList(TipoResultadoExame.values());
	}
	
	@GET
	@Path("/TipoResultadoPorType/{type}")
	@Produces("application/json")
	public TipoResultadoExame recuperarTipoResultadoPorTipo(@PathParam("type") String type) throws Exception {
		return TipoResultadoExame.valueOf(type);
	}
	
	@GET
	@Path("/Perfil")
	@Produces("application/json")
	public List<Perfil> perfis() throws Exception {
		return Arrays.asList(Perfil.values());
	}
	
	@GET
	@Path("/PerfilPorType/{type}")
	@Produces("application/json")
	public Perfil recuperarPerfilPorTipo(@PathParam("type") String type) throws Exception {
		return Perfil.valueOf(type);
	}
	
}
