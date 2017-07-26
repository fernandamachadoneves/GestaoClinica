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
package br.com.puc.gestaoclinica.data;

import java.util.Date;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import br.com.puc.gestaoclinica.model.MarcacaoConsulta;
import br.com.puc.gestaoclinica.model.Receita;

@ApplicationScoped
public class ReceitaRepository {

    @Inject
    private EntityManager em;
    
    public List<Receita> recuperarReceitas(Long idPaciente){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from Receita obj ");
		hql.append(" where obj.paciente.id = :idPaciente ");
		hql.append(" and obj.ativo = :ativo ");
		hql.append(" order by obj.dataReceita desc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idPaciente", idPaciente);
			query.setParameter("ativo", Boolean.TRUE);
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public Receita recuperarReceitaPorId(Long idReceita){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from Receita obj ");
		hql.append(" join fetch obj.itemReceita itens");
		hql.append(" where obj.id = :idReceita ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idReceita", idReceita);
			
			return (Receita) query.getSingleResult();
			
		}catch(Exception e){
			return null;
		}
	}

}
