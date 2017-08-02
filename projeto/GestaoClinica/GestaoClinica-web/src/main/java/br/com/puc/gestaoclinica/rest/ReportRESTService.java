package br.com.puc.gestaoclinica.rest;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;

import br.com.puc.gestaoclinica.data.PacienteRepository;
import br.com.puc.gestaoclinica.data.PedidoExameRepository;
import br.com.puc.gestaoclinica.data.ProfissionalRepository;
import br.com.puc.gestaoclinica.data.ReceitaRepository;
import br.com.puc.gestaoclinica.model.ItemPedidoExame;
import br.com.puc.gestaoclinica.model.ItemReceita;
import br.com.puc.gestaoclinica.model.Paciente;
import br.com.puc.gestaoclinica.model.Profissional;
import br.com.puc.gestaoclinica.model.Receita;
import br.com.puc.gestaoclinica.service.ReportRegistration;
import br.com.puc.gestaoclinica.util.CORSResponseFilter;

@Path("/relatorio")
@RequestScoped
public class ReportRESTService {
	
	@Context
	private HttpServletResponse response;
	
	@Context
	private HttpServletRequest request;
	
    @Inject
    ReportRegistration registration;
    
    @Inject
    ReceitaRepository receitaRepository;
    
    @Inject
    PedidoExameRepository pedidoExameRepository;
    
    @Inject
    ProfissionalRepository profissionalRepository;
    
    @Inject
    PacienteRepository pacienteRepository;
    
    private static ObjectMapper mapper = new ObjectMapper();
    
    @GET
    @Path("/gerarReceitaMedica/{idReceita:[0-9][0-9]*}")
    @Produces("application/pdf")
	public Response gerarReceitaMedica(@PathParam("idReceita") long idReceita) throws Exception {
		
		Receita receita = receitaRepository.recuperarReceitaPorId(idReceita);
		
		List<ItemReceita> itemReceita = receita.getItemReceita();
	
		Map<String, Object> param = registration.gerarRelatorio(receita);
	
		registration.RunReport(response, request, "receitaMedica.jasper", param, itemReceita);
		
		return Response.ok().build();
		
	}
    
    @GET
    @Path("/gerarResultadoExame/{idItemPedidoExame:[0-9][0-9]*}")
    @Produces("application/pdf")
	public Response gerarResultadoExame(@PathParam("idItemPedidoExame") long idItemPedidoExame) throws Exception {
		
		ItemPedidoExame pedidoExame = pedidoExameRepository.recuperarItemPorIdPedidoExame(idItemPedidoExame);
	
		Map<String, Object> param = registration.gerarResultadoExame(pedidoExame);
	
		registration.RunReport(response, request, "resultadoExame.jasper", param, null);
		
		return Response.ok().build();
		
	}
    
    @POST
    @Path("/gerarPedidoExame/")
    @Produces("application/pdf")
	public Response gerarPedidoExame(JSONObject objeto) throws Exception {
    	
    	List<ItemPedidoExame> listaPedidos = mapper.readValue(objeto.get("listaPedidos").toString(), mapper.getTypeFactory().constructCollectionType(List.class, ItemPedidoExame.class));
    	    
    	Long idPaciente = mapper.readValue(objeto.get("idPaciente").toString(), Long.class);
    	Paciente paciente = pacienteRepository.findById(idPaciente);
    	
    	Long idProfissionalLogado = mapper.readValue(objeto.get("idProfissionalLogado").toString(), Long.class);
    	Profissional profissional = profissionalRepository.findById(idProfissionalLogado);    	
    	
    	List<ItemPedidoExame> listaExamesSeleciados = new ArrayList<>();
    	
    	for (ItemPedidoExame obj: listaPedidos){
    		if (obj.isSelecionado()){
    			listaExamesSeleciados.add(obj);
    		}
    	}
    	
	
		Map<String, Object> param = registration.gerarPedidoExame(listaPedidos, paciente, profissional);
	
		registration.RunReport(response, request, "pedidoMedico.jasper", param, listaExamesSeleciados);
		
		return Response.ok().build();
		
	}
}
