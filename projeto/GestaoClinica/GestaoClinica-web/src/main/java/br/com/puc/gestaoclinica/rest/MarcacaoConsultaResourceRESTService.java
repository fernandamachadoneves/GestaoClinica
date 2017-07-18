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

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.MarcacaoConsultaRepository;
import br.com.puc.gestaoclinica.model.MarcacaoConsulta;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.service.MarcacaoConsultaRegistration;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/marcacaoConsulta")
@RequestScoped
public class MarcacaoConsultaResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private MarcacaoConsultaRepository repository;

    @Inject
    MarcacaoConsultaRegistration registration;
 
    
    private static ObjectMapper mapper = new ObjectMapper();

    
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response marcarConsulta(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	MarcacaoConsulta consulta = mapper.readValue(objeto.get("consulta").toString(), MarcacaoConsulta.class);
    	
//    	Paciente paciente = mapper.readValue(objeto.get("paciente").toString(), Paciente.class);
//    	Profissional profissional = mapper.readValue(objeto.get("profissional").toString(), Profissional.class);
//    	String horario = mapper.readValue(objeto.get("horario").toString(), String.class);

        Response.ResponseBuilder builder = null;

        try {
        	
            //registration.cadastrar(criarObjetoMarcacaoConsulta(paciente, profissional, horario));
        	registration.cadastrar(consulta);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("email", "Email taken");
            builder = Response.status(Response.Status.CONFLICT).entity(responseObj);
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }
    
//    public MarcacaoConsulta criarObjetoMarcacaoConsulta(Paciente paciente, Profissional profissional, String horario){
//    	
//    	MarcacaoConsulta consulta = new MarcacaoConsulta();
//    	consulta.setPaciente(paciente);
//    	consulta.setProfissional(profissional);
//    	consulta.setHorario(horario);
//    	consulta.setMarcado(Boolean.TRUE);
//    	
//    	return consulta;
//    }
}
