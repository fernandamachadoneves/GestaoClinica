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

@ApplicationScoped
public class MarcacaoConsultaRepository {

    @Inject
    private EntityManager em;
    
    public MarcacaoConsulta findById(Long id) {
    	StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from MarcacaoConsulta obj ");
		hql.append(" where obj.id = :id ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("id", id);
			
			return (MarcacaoConsulta) query.getSingleResult();
			
		}catch(Exception e){
			return null;
		}
        
    }
    
    public List<MarcacaoConsulta> recuperarAgendamentos(Long idProfissional, Date data){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from MarcacaoConsulta obj ");
		hql.append(" where obj.profissional.id = :idProfissional ");
		hql.append(" and obj.dataConsulta = :data ");
		hql.append(" and obj.marcado = :ativo ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idProfissional", idProfissional);
			query.setParameter("data", data);
			query.setParameter("ativo", Boolean.TRUE);
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public List<MarcacaoConsulta> recuperarAgendamentosPorIdPaciente(Long id) {
    	StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from MarcacaoConsulta obj ");
		hql.append(" where obj.paciente.id = :id ");
		hql.append(" and obj.marcado = :agendado ");
		hql.append(" order by obj.dataConsulta, obj.horario desc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("id", id);
			query.setParameter("agendado", Boolean.TRUE);
			
			return (List<MarcacaoConsulta>) query.getResultList();
			
		}catch(Exception e){
			return null;
		}
        
    }

 
}
