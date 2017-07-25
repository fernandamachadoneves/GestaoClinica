package br.com.puc.gestaoclinica.service;

import java.text.SimpleDateFormat;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.ejb.Stateless;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import br.com.puc.gestaoclinica.util.ReportUtil;

@Stateless
public class ReportRegistration {
	
	public static final String REPORTS_DIR_PATH = "reports";
	public static final String IMAGE_DIR_PATH = "img";
	
	public static final String CAMINHO_LOGO_CLINICA = "/img/logo_pm.png";
	
	
	public void RunReport(HttpServletResponse response, HttpServletRequest request, String nomeRelatorio, Map<String, Object> param,  Collection<?> list) throws Exception {
		try {
			Map<String, Object> params = new HashMap<String, Object>();
			params.put("REPORT_LOCALE", new Locale("pt", "BR"));
			params.put("imagePath", IMAGE_DIR_PATH);
			params.put("logoClinica", request.getRealPath(CAMINHO_LOGO_CLINICA));
			//params.put("nroRegistros", getDataSource().size());
			Map<String, Object> customParams = param;
			customParams.putAll(params);
			
			exportReport(customParams, response, request, nomeRelatorio, list);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public void exportReport(Map<String, Object> parameters, HttpServletResponse response, HttpServletRequest request, String nomeRelatorio, Collection<?> list) throws Exception {
		String jasperFile = request.getRealPath(REPORTS_DIR_PATH) + "\\" + nomeRelatorio;

		ReportUtil.execute(jasperFile, ReportUtil.TIPO_RELATORIO_PDF, parameters, list, nomeRelatorio, response);	
		
	}
	
	public Map<String, Object> gerarRelatorio(){
	
		Map<String, Object> params = new HashMap<String, Object>();
		
		SimpleDateFormat dt = new SimpleDateFormat("dd 'de' MMMM 'de' yyyy");
		String dataImpressao = dt.format(new Date());
		params.put("dataImpressao", dataImpressao);
		
		return params;
	}

}