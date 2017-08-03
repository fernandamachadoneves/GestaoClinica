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
import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import br.com.puc.gestaoclinica.model.ConfiguracaoHorarioProfissional;
import br.com.puc.gestaoclinica.model.Medicamento;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Usuario;

@ApplicationScoped
public class UsuarioRepository {

    @Inject
    private EntityManager em;

    public Usuario findById(Long id) {
        return em.find(Usuario.class, id);
    }

    public List<Usuario> findAllOrderedByName() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Usuario> criteria = cb.createQuery(Usuario.class);
        Root<Usuario> usuario = criteria.from(Usuario.class);
        criteria.select(usuario).where(cb.equal(usuario.get("ativo"), Boolean.TRUE));
        criteria.select(usuario).orderBy(cb.asc(usuario.get("login")));
        return em.createQuery(criteria).getResultList();
    }
    
    public Usuario recuperarUsuarioPorLoginEsenha(String login, String senha){
 		StringBuilder hql = new StringBuilder("select obj ");
 		hql.append(" from Usuario obj ");
 		hql.append(" where obj.login = :login ");
 		hql.append(" and obj.senha = :senha ");
 		hql.append(" and obj.ativo = :ativo ");
 		
 		try{
 			Query query = em.createQuery(hql.toString());
 			query.setParameter("login", login);
 			query.setParameter("senha", senha);
 			query.setParameter("ativo", Boolean.TRUE);

 			
 			return (Usuario) query.getSingleResult();
 			
 		}catch(NoResultException e){
 			return null;
 		}
 	}
   
}
