package br.com.puc.gestaoclinica.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Collection;
import java.util.Map;

import javax.ejb.Stateless;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JRExporterParameter;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRPdfExporter;

@Stateless
public class ReportUtil {
	
	/**
	 * Variável que indica que o relatório será gerado em pdf.
	 */
	public static final String TIPO_RELATORIO_PDF = "pdf";
	
	
	private static synchronized ByteArrayOutputStream exportToPdf(JasperPrint jasperPrint)
			throws JRException, IOException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		JRPdfExporter exp = new JRPdfExporter();
		exp.setParameter(JRExporterParameter.JASPER_PRINT, jasperPrint);
		exp.setParameter(JRExporterParameter.OUTPUT_STREAM, out);
		exp.exportReport();		
		
		return out;
	}

	
	/**
	 * Método que dispara a geração do relatório.
	 * 
	 * @param jasperFile - caminho do arquivo .jasper
	 * @param exportType - tipo do relatório (excel, pdf, html, doc, email_pdf_anexo)
	 * @param parameters - map de parâmetros que serão passados para o relatório: <nomeParametro, parametro>
	 * @param list - lista contendo os valores referente ao detail do relatório.
	 * @param fileName - nome do arquivo gerado.
	 * @throws Exception
	 */
	@SuppressWarnings("deprecation")
	public static synchronized void execute(String jasperFile, String exportType, Map<String, Object> parameters, Collection<?> list, String fileName, HttpServletResponse response) throws Exception {
		
		JasperPrint jasperPrint = JasperFillManager.fillReport(jasperFile, parameters, new JRBeanCollectionDataSource(list));
		

		if (exportType.equals(TIPO_RELATORIO_PDF)) {
			load(exportToPdf(jasperPrint), "application/pdf", fileName + ".pdf", response);
		}
		
	}
	
	public static synchronized void load(ByteArrayOutputStream array, String content, String fileName, HttpServletResponse response ) throws IOException {
		byte[] bytes = array.toByteArray();
		response.setContentLength(bytes.length);
		response.setContentType(content);
		response.setCharacterEncoding("ISO-8859-1");
		response.setHeader("Content-disposition", "attachment; filename=" + fileName);
		ServletOutputStream output = response.getOutputStream();
		output.write(bytes);
		output.flush();
		output.close();
	}
}
