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

import br.com.puc.gestaoclinica.model.ItemPedidoExame;
import br.com.puc.gestaoclinica.model.PedidoExame;

@ApplicationScoped
public class PedidoExameRepository {

	@Inject
    private EntityManager em;
    
    public List<ItemPedidoExame> recuperarPedidos(Long idPaciente){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from ItemPedidoExame obj ");
		hql.append(" inner join obj.pedidoExame pe ");
		hql.append(" where pe.paciente.id = :idPaciente ");
		hql.append(" and obj.ativo = :ativo ");
		hql.append(" order by pe.dataPedido desc ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idPaciente", idPaciente);
			query.setParameter("ativo", Boolean.TRUE);
			
			return query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public PedidoExame recuperarPedidoExamePorId(Long idPedidoExame){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from PedidoExame obj ");
		hql.append(" join fetch obj.itemPedidoExame itens");
		hql.append(" where obj.id = :idPedidoExame ");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idPedidoExame", idPedidoExame);
			
			return (PedidoExame) query.getSingleResult();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public List<ItemPedidoExame> recuperarItensPorIdPedidoExame(Long idPedidoExame){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from ItemPedidoExame obj ");
		hql.append(" where obj.pedidoExame.id = :idPedidoExame ");
		hql.append(" and obj.ativo = :ativo");
		
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idPedidoExame", idPedidoExame);
			query.setParameter("ativo", Boolean.TRUE);
			
			return (List<ItemPedidoExame>) query.getResultList();
			
		}catch(Exception e){
			return null;
		}
	}
    
    public ItemPedidoExame recuperarItemPorIdPedidoExame(Long idItemPedido){
		StringBuilder hql = new StringBuilder("select obj ");
		hql.append(" from ItemPedidoExame obj ");
		hql.append(" where obj.id = :idItemPedido ");
		hql.append(" and obj.ativo = :ativo ");
		try{
			Query query = em.createQuery(hql.toString());
			query.setParameter("idItemPedido", idItemPedido);
			query.setParameter("ativo", Boolean.TRUE);
			
			return (ItemPedidoExame) query.getSingleResult();
			
		}catch(Exception e){
			return null;
		}
	}

}
