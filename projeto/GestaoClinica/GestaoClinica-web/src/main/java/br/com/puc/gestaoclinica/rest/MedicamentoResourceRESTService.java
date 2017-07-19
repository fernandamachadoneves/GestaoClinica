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
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.validation.ValidationException;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.MedicamentoRepository;
import br.com.puc.gestaoclinica.data.PacienteRepository;
import br.com.puc.gestaoclinica.model.Medicamento;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.service.MedicamentoRegistration;
import br.com.puc.gestaoclinica.service.PacienteRegistration;

@Path("/medicamento")
@RequestScoped
public class MedicamentoResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private MedicamentoRepository repository;

    @Inject
    MedicamentoRegistration registration;
 
    
    private static ObjectMapper mapper = new ObjectMapper();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Medicamento> listarTodosPacientes() {
        return repository.findAllOrderedByName();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Medicamento recuperarPacientePorId(@PathParam("id") long id) {
    	Medicamento medicamento = repository.findById(id);
        if (medicamento == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return medicamento;
    }
    
    @GET
    @Path("/pesquisar/{nome}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Medicamento> recuperarMedicamentoPorNomeGenerico(@PathParam("nome") String nome) {
        return repository.recuperarMedicamentoPorNomeGenerico(nome);
    }

    /**
     * Creates a new member from the values provided. Performs validation, and will return a JAX-RS response with either 200 ok,
     * or with a map of fields, and related errors.
     * @throws IOException 
     * @throws JsonMappingException 
     * @throws JsonParseException 
     */
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response criarPaciente(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	Medicamento medicamento = mapper.readValue(objeto.get("medicamento").toString(), Medicamento.class);

        Response.ResponseBuilder builder = null;

        try {

            registration.cadastrar(medicamento);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("nomeGenerico", "Nome inválido");
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
    public Response excluirMedicamento(Medicamento medicamento) {

    	medicamento.setAtivo(Boolean.FALSE);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(medicamento);

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
    public Response editarMedicamento(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

        Medicamento medicamento = mapper.readValue(objeto.get("medicamento").toString(), Medicamento.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(medicamento);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("nomeGenerico", "Nome genérico");
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
