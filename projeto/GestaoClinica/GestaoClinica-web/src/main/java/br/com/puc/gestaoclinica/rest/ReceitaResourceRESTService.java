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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
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

import br.com.puc.gestaoclinica.data.ReceitaRepository;
import br.com.puc.gestaoclinica.model.MarcacaoConsulta;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.model.Receita;
import br.com.puc.gestaoclinica.service.ReceitaRegistration;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/paciente")
@RequestScoped
public class ReceitaResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private ReceitaRepository repository;

    @Inject
    ReceitaRegistration registration;
 
    
    private static ObjectMapper mapper = new ObjectMapper();
    
    @POST
    @Path("/pesquisarReceitas/")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Receita> pesquisarReceitas(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	Long idPaciente = mapper.readValue(objeto.get("idPaciente").toString(), Long.class);
    	
        return repository.recuperarReceitas(idPaciente);
    }


    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response criarReceita(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	Receita receita = mapper.readValue(objeto.get("receita").toString(), Receita.class);

        Response.ResponseBuilder builder = null;

        try {

            registration.cadastrar(receita);

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
    
    @POST
    @Path("/excluir")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response excluirReceita(Receita receita) {

    	receita.setAtivo(Boolean.FALSE);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(receita);

            // Create an "ok" response
            builder = Response.ok();
        
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }
    
    @POST
    @Path("/editar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarReceita(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

        Receita receita = mapper.readValue(objeto.get("receita").toString(), Receita.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(receita);

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
}
