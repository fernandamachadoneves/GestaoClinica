package br.com.puc.gestaoclinica.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@XmlRootElement
@Table(name = "ConfiguracaoHorarioProfissional")
public class ConfiguracaoHorarioProfissional {
	
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "horarioInicio")
	private String horarioInicio;
	
	@Column(name = "horarioFinal")
	private String horarioFinal;
	
	@Column(name = "tempoConsulta")
	private Integer tempoConsulta;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHorarioInicio() {
		return horarioInicio;
	}

	public void setHorarioInicio(String horarioInicio) {
		this.horarioInicio = horarioInicio;
	}

	public String getHorarioFinal() {
		return horarioFinal;
	}

	public void setHorarioFinal(String horarioFinal) {
		this.horarioFinal = horarioFinal;
	}

	public Integer getTempoConsulta() {
		return tempoConsulta;
	}

	public void setTempoConsulta(Integer tempoConsulta) {
		this.tempoConsulta = tempoConsulta;
	}
}
