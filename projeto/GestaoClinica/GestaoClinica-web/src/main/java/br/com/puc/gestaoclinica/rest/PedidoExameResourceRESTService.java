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

import org.eclipse.jdt.core.compiler.ITerminalSymbols;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.PedidoExameRepository;
import br.com.puc.gestaoclinica.model.ItemPedidoExame;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.PedidoExame;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.service.ItemPedidoRegistration;
import br.com.puc.gestaoclinica.service.PedidoExameRegistration;


@Path("/pedidoExame")
@RequestScoped
public class PedidoExameResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private PedidoExameRepository repository;

    @Inject
    PedidoExameRegistration registration;
    

    @Inject
    ItemPedidoRegistration itemPedidoRegistration;
 
    
    private static ObjectMapper mapper = new ObjectMapper();
    
    @GET
    @Path("/pesquisarPedidos/{idPaciente:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ItemPedidoExame> pesquisarPedidos(@PathParam("idPaciente") long idPaciente) throws JsonParseException, JsonMappingException, IOException {
    	
        return repository.recuperarPedidos(idPaciente);
    }
    
    @GET
    @Path("/recuperarItemPedidoExamePorId/{idItemPedido:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ItemPedidoExame> recuperarItemPedidoExamePorId(@PathParam("idItemPedido") long idItemPedido) throws JsonParseException, JsonMappingException, IOException {
    	
        return repository.recuperarItensPorIdPedidoExame(idItemPedido);
    }


    @POST
    @Path("/adicionar")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response criarPedidoExame(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

    	Long idPaciente = mapper.readValue(objeto.get("idPaciente").toString(), Long.class);
    	List<ItemPedidoExame> itemPedido = mapper.readValue(objeto.get("itensPedidoExame").toString(), mapper.getTypeFactory().constructCollectionType(List.class, ItemPedidoExame.class));
    	
    	String idProfissional = mapper.readValue(objeto.get("idProfissional").toString(), String.class);

    	PedidoExame pedido = new PedidoExame();
    	pedido.setPaciente(new Paciente(idPaciente));
    	pedido.setProfissional(new Profissional(Long.valueOf(idProfissional)));
    	pedido.setDataPedido(new Date());

        Response.ResponseBuilder builder = null;

        try {

            PedidoExame pedidoCriado = registration.cadastrar(pedido);
            
            for (ItemPedidoExame obj: itemPedido){
            	obj.setPedidoExame(pedidoCriado);
            	
            	itemPedidoRegistration.cadastrar(obj, pedido);
            	
            }

            // Create an "ok" response
            builder = Response.ok();
        } catch (ValidationException e) {
            // Handle the unique constrain violation
            Map<String, String> responseObj = new HashMap<>();
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
    public Response excluirItemPedidoExame(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	ItemPedidoExame itemPedidoExame = mapper.readValue(objeto.get("itemPedidoExame").toString(), ItemPedidoExame.class);

    	itemPedidoExame.setAtivo(Boolean.FALSE);

    	Response.ResponseBuilder builder = null;
    	
        try {
            itemPedidoRegistration.editarResultadoExame(itemPedidoExame);

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
    public Response editarPedidoExame(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

        ItemPedidoExame itemPedidoExame = mapper.readValue(objeto.get("itemPedidoExame").toString(), ItemPedidoExame.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            itemPedidoRegistration.editarResultadoExame(itemPedidoExame);

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

    	List<ItemPedidoExame> itemPedidoExame = mapper.readValue(objeto.get("itensPedidoExame").toString(), mapper.getTypeFactory().constructCollectionType(List.class, ItemPedidoExame.class));
    	
    	PedidoExame pedidoExame = mapper.readValue(objeto.get("pedidoExame").toString(), PedidoExame.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            for (ItemPedidoExame obj: itemPedidoExame){
            	if (obj.getId()==null) { 
            		itemPedidoRegistration.cadastrar(obj, pedidoExame);
            	} else {
            		itemPedidoRegistration.editar(obj, pedidoExame);
            	}
            }
            
            List<ItemPedidoExame> listaBanco = repository.recuperarItensPorIdPedidoExame(pedidoExame.getId());
            for (ItemPedidoExame obj: listaBanco) {
            	Boolean continua = Boolean.FALSE;
            	for (ItemPedidoExame obj2: itemPedidoExame) {
            		if (obj.getId().equals(obj2.getId())) {
            			continua = Boolean.TRUE;
            		}
            	}
            	if (!continua) {
            		obj.setAtivo(Boolean.FALSE);
            		itemPedidoRegistration.editar(obj, pedidoExame);
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
    @Path("/recuperarItensPorIdPedidoExame/{idPedidoExame:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<ItemPedidoExame> recuperarItensPorIdReceita(@PathParam("idPedidoExame") long idPedidoExame) throws JsonParseException, JsonMappingException, IOException {
    	
        return repository.recuperarItensPorIdPedidoExame(idPedidoExame);
    }
    
    @POST
    @Path("/lancarResultadoExame")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response lancarResultadoExame(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	ItemPedidoExame itemPedidoExame = mapper.readValue(objeto.get("itemPedidoExame").toString(), ItemPedidoExame.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            
        	itemPedidoRegistration.editarResultadoExame(itemPedidoExame);

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
}
