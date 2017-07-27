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

import java.util.List;
import java.util.logging.Logger;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.ExameRepository;
import br.com.puc.gestaoclinica.model.Exame;
import br.com.puc.gestaoclinica.model.Medicamento;

@Path("/exame")
@RequestScoped
public class ExameResourceRESTService {
    @Inject
    private Logger log;

    @Inject
    private ExameRepository repository;
    
    private static ObjectMapper mapper = new ObjectMapper();
    
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Exame> listarTodosExames() {
        return repository.findAllOrderedByName();
    }

    
    @GET
    @Path("/pesquisar/{nome}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Medicamento> recuperarExamePorNome(@PathParam("nome") String nome) {
        return repository.recuperarExamePorNome(nome);
    }
}
