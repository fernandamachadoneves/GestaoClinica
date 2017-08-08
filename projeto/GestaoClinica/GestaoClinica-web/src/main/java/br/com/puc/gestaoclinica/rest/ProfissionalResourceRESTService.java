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
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.NoResultException;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.ValidationException;
import javax.validation.Validator;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.json.simple.JSONObject;
import br.com.puc.gestaoclinica.data.ProfissionalRepository;
import br.com.puc.gestaoclinica.model.ConfiguracaoHorarioProfissional;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.service.ConfiguracaoHorarioProfissionalRegistration;
import br.com.puc.gestaoclinica.service.ProfissionalRegistration;

/**
 * JAX-RS Example
 * <p/>
 * This class produces a RESTful service to read/write the contents of the members table.
 */
@Path("/profissional")
@RequestScoped
public class ProfissionalResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private Validator validator;

    @Inject
    private ProfissionalRepository repository;

    @Inject
    ProfissionalRegistration registration;
    
    @Inject
    ConfiguracaoHorarioProfissionalRegistration configRegistration;
    
    private static ObjectMapper mapper = new ObjectMapper();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Profissional> listarTodosProfissionais() {
        return repository.findAllOrderedByName();
    }

    @GET
    @Path("/{id:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public Profissional recuperarProfissionalPorId(@PathParam("id") long id) {
        Profissional profissional = repository.findById(id);
        if (profissional == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return profissional;
    }
    
    @GET
    @Path("recuperarPorEmail/{email}")
    @Produces(MediaType.APPLICATION_JSON)
    public Profissional recuperarProfissionalPorEmail(@PathParam("email") String email){
        Profissional profissional = repository.recuperarProfissionalPorEmail(email);
        if (profissional == null) {
            throw new WebApplicationException(Response.Status.NOT_FOUND);
        }
        return profissional;
    }
    
    
    @GET
    @Path("/pesquisar/{nome}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Profissional> recuperarProfissionalPorId(@PathParam("nome") String nome) {
        return repository.recuperarProfissionalPorNome(nome);
    }
    
    @GET
    @Path("/pesquisarConfiguracao/{idProfissional:[0-9][0-9]*}")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfiguracaoHorarioProfissional recuperarConfiguracaoPorIdProfissional(@PathParam("idProfissional") Long idProfissional) {
        return repository.recuperarConfiguracaoPorIdProfissional(idProfissional);
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
    public Response criarProfissional(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {
    	
    	Profissional profissional = mapper.readValue(objeto.get("profissional").toString(), Profissional.class);
    	
    	ConfiguracaoHorarioProfissional configProf = mapper.readValue(objeto.get("configProf").toString(), ConfiguracaoHorarioProfissional.class);

        Response.ResponseBuilder builder = null;

        try {
            // Validates member using bean validation
            validate(profissional);

            registration.cadastrar(profissional);
            
            configProf.setProfissional(profissional);
            configRegistration.cadastrar(configProf);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ConstraintViolationException ce) {
            // Handle bean validation issues
            builder = createViolationResponse(ce.getConstraintViolations());
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
    public Response excluirProfissional(Profissional profissional) {

        profissional.setAtivo(Boolean.FALSE);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(profissional);

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
    public Response editarProfissional(JSONObject objeto) throws JsonParseException, JsonMappingException, IOException {

        objeto.get("profissional");
        Profissional profissional = mapper.readValue(objeto.get("profissional").toString(), Profissional.class);
    	
    	ConfiguracaoHorarioProfissional configProf = mapper.readValue(objeto.get("configProf").toString(), ConfiguracaoHorarioProfissional.class);

    	Response.ResponseBuilder builder = null;
    	
        try {
            registration.editar(profissional);
            
            configProf.setProfissional(profissional);
            configRegistration.editar(configProf);

            // Create an "ok" response
            builder = Response.ok();
        } catch (ConstraintViolationException ce) {
            // Handle bean validation issues
            builder = createViolationResponse(ce.getConstraintViolations());
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

    /**
     * <p>
     * Validates the given Member variable and throws validation exceptions based on the type of error. If the error is standard
     * bean validation errors then it will throw a ConstraintValidationException with the set of the constraints violated.
     * </p>
     * <p>
     * If the error is caused because an existing member with the same email is registered it throws a regular validation
     * exception so that it can be interpreted separately.
     * </p>
     * 
     * @param profissional Member to be validated
     * @throws ConstraintViolationException If Bean Validation errors exist
     * @throws ValidationException If member with the same email already exists
     */
    private void validate(Profissional profissional) throws ConstraintViolationException, ValidationException {
        // Create a bean validator and check for issues.
        Set<ConstraintViolation<Profissional>> violations = validator.validate(profissional);

        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(new HashSet<ConstraintViolation<?>>(violations));
        }

        // Check the uniqueness of the email address
        if (emailAlreadyExists(profissional.getEmail())) {
            throw new ValidationException("Unique Email Violation");
        }
    }

    /**
     * Creates a JAX-RS "Bad Request" response including a map of all violation fields, and their message. This can then be used
     * by clients to show violations.
     * 
     * @param violations A set of violations that needs to be reported
     * @return JAX-RS response containing all violations
     */
    private Response.ResponseBuilder createViolationResponse(Set<ConstraintViolation<?>> violations) {
        log.fine("Validation completed. violations found: " + violations.size());

        Map<String, String> responseObj = new HashMap<>();

        for (ConstraintViolation<?> violation : violations) {
            responseObj.put(violation.getPropertyPath().toString(), violation.getMessage());
        }

        return Response.status(Response.Status.BAD_REQUEST).entity(responseObj);
    }

    /**
     * Checks if a member with the same email address is already registered. This is the only way to easily capture the
     * "@UniqueConstraint(columnNames = "email")" constraint from the Member class.
     * 
     * @param email The email to check
     * @return True if the email already exists, and false otherwise
     */
    public boolean emailAlreadyExists(String email) {
        Profissional profissional = null;
        try {
            profissional = repository.findByEmail(email);
        } catch (NoResultException e) {
            // ignore
        }
        return profissional != null;
    }
}
