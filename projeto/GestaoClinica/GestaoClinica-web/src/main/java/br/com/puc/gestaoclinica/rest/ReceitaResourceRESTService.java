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
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.simple.ItemList;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.ReceitaRepository;
import br.com.puc.gestaoclinica.model.ItemReceita;
import br.com.puc.gestaoclinica.model.MarcacaoConsulta;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.model.Receita;
import br.com.puc.gestaoclinica.service.ItemReceitaRegistration;
import br.com.puc.gestaoclinica.service.ReceitaRegistration;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/receita")
@RequestScoped
public class ReceitaResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private ReceitaRepository repository;

    @Inject
    ReceitaRegistration registration;
    
    @Inject
    ItemReceitaRegistration itemReceitaRegistration;
 
    
    private static ObjectMapper mapper = new ObjectMapper();
    
    @GET
    @Path("/pesquisarReceitas/{idPaciente:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Receita> pesquisarReceitas(@PathParam("idPaciente") long idPaciente) throws JsonParseException, JsonMappingException, IOException {
    	
        return repository.recuperarReceitas(idPaciente);
    }


    @POST
    @Path("/adicionar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response criarReceita(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

    	Long idPaciente = mapper.readValue(objeto.get("idPaciente").toString(), Long.class);
    	List<ItemReceita> itemReceita = mapper.readValue(objeto.get("itensReceita").toString(), mapper.getTypeFactory().constructCollectionType(List.class, ItemReceita.class));
    	
    	//Long idProfissional = mapper.readValue(objeto.get("idProfissional").toString(), Long.class);
    	// TODO: Alterar quando recuperar o medico logado no sistema, retirar o valor fixo
    	Long idProfissional = new Long(1);
    	
    	Receita receita = new Receita();
    	receita.setAtivo(Boolean.TRUE);
    	receita.setPaciente(new Paciente(idPaciente));
    	receita.setProfissional(new Profissional(idProfissional));
    	receita.setDataReceita(new Date());

        Response.ResponseBuilder builder = null;

        try {

            Receita receitaCriada = registration.cadastrar(receita);
            
            for (ItemReceita obj: itemReceita){
            	obj.setReceita(receitaCriada);
            	
            	itemReceitaRegistration.cadastrar(obj, receita);
            	
            }

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
        } catch (Exception e) {
            // Handle generic exceptions
            Map<String, String> responseObj = new HashMap<>();
            responseObj.put("error", e.getMessage());
            builder = Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
        }

        return builder.build();
    }
    
    @POST
    @Path("/editarItens")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarItens(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

    	List<ItemReceita> itemReceita = mapper.readValue(objeto.get("itensReceita").toString(), mapper.getTypeFactory().constructCollectionType(List.class, ItemReceita.class));
    	
    	Receita receita = mapper.readValue(objeto.get("receita").toString(), Receita.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            for (ItemReceita obj: itemReceita){
            	if (obj.getId()==null) {            		
            		itemReceitaRegistration.cadastrar(obj, receita);
            	} else {
            		itemReceitaRegistration.editar(obj, receita);
            	}
            }
            
            List<ItemReceita> listaBanco = repository.recuperarItensPorIdReceita(receita.getId());
            for (ItemReceita obj: listaBanco) {
            	Boolean continua = Boolean.FALSE;
            	for (ItemReceita obj2: itemReceita) {
            		if (obj.getId().equals(obj2.getId())) {
            			continua = Boolean.TRUE;
            		}
            	}
            	if (!continua) {
            		obj.setAtivo(Boolean.FALSE);
            		itemReceitaRegistration.editar(obj, receita);
            	}
            }

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
    
    @GET
    @Path("/recuperarItensPorIdReceita/{idReceita:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ItemReceita> recuperarItensPorIdReceita(@PathParam("idReceita") long idReceita) throws JsonParseException, JsonMappingException, IOException {
    	
        return repository.recuperarItensPorIdReceita(idReceita);
    }
}
