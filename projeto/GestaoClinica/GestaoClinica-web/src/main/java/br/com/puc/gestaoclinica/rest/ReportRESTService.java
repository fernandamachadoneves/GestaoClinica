package br.com.puc.gestaoclinica.rest;

import java.util.Collection;
import java.util.Map;

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

import br.com.puc.gestaoclinica.data.ReceitaRepository;
import br.com.puc.gestaoclinica.model.Receita;
import br.com.puc.gestaoclinica.service.ReceitaRegistration;
import br.com.puc.gestaoclinica.service.ReportRegistration;

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

    @POST
    @Path("/gerarReceitaMedica")
    @Produces("application/pdf")
	public Response gerarAta(JSONObject objeto) throws Exception {
		
		Collection<?> list = null;
//		
//		Receita receita = receitaRepository.recuperarReceitaPorId(idReceita);
//		
//		Map<String, Object> param = registration.gerarRelatorio();
//		
	//	registration.RunReport(response, request, "receitaMedica.jasper", param, list);
		
		return Response.ok().header("Access-Control-Allow-Origin", "*")
	            .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
	            .header("Access-Control-Allow-Credentials", "true")
	            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
	            .header("Access-Control-Max-Age", "1209600").build();
		
	}
    
    @GET
    @Path("/teste/{idReceita:[0-9][0-9]*}")
    @Produces("application/pdf")
	public Response teste(@PathParam("idReceita") long idReceita) throws Exception {
		
		Collection<?> list = null;
		
		Receita receita = receitaRepository.recuperarReceitaPorId(idReceita);
		
		Map<String, Object> param = registration.gerarRelatorio(receita);
		
		registration.RunReport(response, request, "receitaMedica.jasper", param, list);
		
		return Response.ok().header("Access-Control-Allow-Origin", "*").build();
		
	}
}
