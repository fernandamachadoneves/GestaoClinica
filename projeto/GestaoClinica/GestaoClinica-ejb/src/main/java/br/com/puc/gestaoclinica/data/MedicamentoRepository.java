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

import br.com.puc.gestaoclinica.model.Medicamento;
import br.com.puc.gestaoclinica.model.Paciente;

@ApplicationScoped
public class MedicamentoRepository {

    @Inject
    private EntityManager em;

    public Medicamento findById(Long id) {
        return em.find(Medicamento.class, id);
    }
    
    public List<Medicamento> recuperarMedicamentoPorNomeGenerico(String nome){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from Medicamento obj ");
		hql.append(" where obj.nomeGenerico like :nome ");
		hql.append(" and obj.ativo = :ativo");
		hql.append(" order by obj.nome asc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("nome", "%"+nome+"%");
			query.setParameter("ativo", Boolean.TRUE);
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public List<Medicamento> findAllOrderedByName() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Medicamento> criteria = cb.createQuery(Medicamento.class);
        Root<Medicamento> medicamento = criteria.from(Medicamento.class);
        criteria.select(medicamento).where(cb.equal(medicamento.get("ativo"), Boolean.TRUE));
        criteria.select(medicamento).orderBy(cb.asc(medicamento.get("nomeGenerico")));
        return em.createQuery(criteria).getResultList();
    }
   
}
