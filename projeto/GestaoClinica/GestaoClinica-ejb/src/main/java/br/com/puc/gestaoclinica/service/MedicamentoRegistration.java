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
package br.com.puc.gestaoclinica.service;

import br.com.puc.gestaoclinica.model.Medicamento;
import br.com.puc.gestaoclinica.model.Member;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Profissional;

import javax.ejb.Stateless;
import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import java.util.logging.Logger;

// The @Stateless annotation eliminates the need for manual transaction demarcation
@Stateless
public class MedicamentoRegistration {

    @Inject
    private Logger log;

    @Inject
    private EntityManager em;

    @Inject
    private Event<Medicamento> medicamentoEventSrc;

    public void cadastrar(Medicamento medicamento) throws Exception {
        log.info("Registrou Medicamento: " + medicamento.getNomeGenerico());
        medicamento.setAtivo(Boolean.TRUE);
        em.persist(medicamento);
        medicamentoEventSrc.fire(medicamento);
    }
    
    public void editar(Medicamento medicamento) throws Exception {
    	log.info("Editar Medicamento: " + medicamento.getNomeGenerico());
        em.merge(medicamento);
        medicamentoEventSrc.fire(medicamento);
    }
}
