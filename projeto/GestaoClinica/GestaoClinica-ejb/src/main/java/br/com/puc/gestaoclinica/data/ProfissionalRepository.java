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

import br.com.puc.gestaoclinica.model.ConfiguracaoHorarioProfissional;
import br.com.puc.gestaoclinica.model.Profissional;

@ApplicationScoped
public class ProfissionalRepository {

    @Inject
    private EntityManager em;

    public Profissional findById(Long id) {
        return em.find(Profissional.class, id);
    }
    
    public List<Profissional> recuperarProfissionalPorNome(String nome){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from Profissional obj ");
		hql.append(" where obj.nome like :nome ");
		hql.append(" and obj.ativo = :ativo ");
		hql.append(" order by obj.nome asc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("nome", "%"+nome+"%");
			query.setParameter("ativo", Boolean.TRUE);
			query.setMaxResults(20);
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public ConfiguracaoHorarioProfissional recuperarConfiguracaoPorIdProfissional(Long idProfissional){
 		StringBuilder hql = new StringBuilder("select obj ");
 		hql.append(" from ConfiguracaoHorarioProfissional obj ");
 		hql.append(" where obj.profissional.id = :idProfissional ");
 		
 		try{
 			Query query = em.createQuery(hql.toString());
 			query.setParameter("idProfissional", idProfissional);

 			return (ConfiguracaoHorarioProfissional) query.getSingleResult();
 			
 		}catch(Exception e){
 			return null;
 		}
 	}
    
    public List<Profissional> recuperarPorNome(String nome) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Profissional> criteria = cb.createQuery(Profissional.class);
        Root<Profissional> profissional = criteria.from(Profissional.class);
        criteria.select(profissional).where(cb.equal(profissional.get("nome"), nome));
        criteria.select(profissional).where(cb.equal(profissional.get("ativo"), Boolean.TRUE));
        criteria.select(profissional).orderBy(cb.asc(profissional.get("nome")));
        return em.createQuery(criteria).getResultList();
    }

    public Profissional findByEmail(String email) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Profissional> criteria = cb.createQuery(Profissional.class);
        Root<Profissional> member = criteria.from(Profissional.class);
        // Swap criteria statements if you would like to try out type-safe criteria queries, a new
        // feature in JPA 2.0
        // criteria.select(member).where(cb.equal(member.get(Member_.name), email));
        criteria.select(member).where(cb.equal(member.get("email"), email));
        return em.createQuery(criteria).getSingleResult();
    }

    public List<Profissional> findAllOrderedByName() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Profissional> criteria = cb.createQuery(Profissional.class);
        Root<Profissional> member = criteria.from(Profissional.class);
        // Swap criteria statements if you would like to try out type-safe criteria queries, a new
        // feature in JPA 2.0
        // criteria.select(member).orderBy(cb.asc(member.get(Member_.name)));
        criteria.select(member).where(cb.equal(member.get("ativo"), Boolean.TRUE));
        criteria.select(member).orderBy(cb.asc(member.get("nome")));
        return em.createQuery(criteria).getResultList();
    }
}
