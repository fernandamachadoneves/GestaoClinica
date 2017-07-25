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
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.json.simple.JSONObject;

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

    @POST
    @Path("/gerarReceitaMedica")
    @Produces("application/pdf")
	public Response gerarAta(JSONObject objeto) throws Exception {
		
		Collection<?> list = null;
		
		Map<String, Object> param = registration.gerarRelatorio();
		
		registration.RunReport(response, request, "receitaMedica.jasper", param, list);
		
		return Response.ok().header("Access-Control-Allow-Origin", "*")
	            .header("Access-Control-Allow-Headers", "origin, content-type, accept, authorization")
	            .header("Access-Control-Allow-Credentials", "true")
	            .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD")
	            .header("Access-Control-Max-Age", "1209600").build();
		
	}
    
    @GET
    @Path("/teste")
    @Produces("application/pdf")
	public Response teste() throws Exception {
		
		Collection<?> list = null;
		
		Map<String, Object> param = registration.gerarRelatorio();
		
		registration.RunReport(response, request, "receitaMedica.jasper", param, list);
		
		return Response.ok().header("Access-Control-Allow-Origin", "*").build();
		
	}
}
