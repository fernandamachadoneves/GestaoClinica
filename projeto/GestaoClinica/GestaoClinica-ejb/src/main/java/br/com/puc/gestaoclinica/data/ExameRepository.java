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

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import br.com.puc.gestaoclinica.model.Exame;
import br.com.puc.gestaoclinica.model.Medicamento;

@ApplicationScoped
public class ExameRepository {

    @Inject
    private EntityManager em;

    public Exame findById(Long id) {
        return em.find(Exame.class, id);
    }
    
    public List<Exame> recuperarExamePorNome(String nome){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from Exame obj ");
		hql.append(" where obj.nomeExame like :nome ");
		hql.append(" order by obj.nomeExame asc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("nome", "%"+nome+"%");
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public List<Exame> findAllOrderedByName() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Exame> criteria = cb.createQuery(Exame.class);
        Root<Exame> exame = criteria.from(Exame.class);
        criteria.select(exame).orderBy(cb.asc(exame.get("nomeExame")));
        return em.createQuery(criteria).getResultList();
    }
}
