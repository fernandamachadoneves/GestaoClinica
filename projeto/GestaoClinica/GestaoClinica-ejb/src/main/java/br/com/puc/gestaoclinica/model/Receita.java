package br.com.puc.gestaoclinica.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@XmlRootElement
@Table(name = "Receita")
public class Receita implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "dataReceita")
	private Date dataReceita;
	
	@ManyToOne
	@JoinColumn(name = "paciente")
	private Paciente paciente;
	
	@ManyToOne
	@JoinColumn(name = "profissional")
	private Profissional profissional;
	
	@Column(name = "ativo")
	private Boolean ativo;
	
	@JsonBackReference
	@OneToMany(mappedBy="receita")
	private List<ItemReceita> itemReceita;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getDataReceita() {
		return dataReceita;
	}

	public void setDataReceita(Date dataReceita) {
		this.dataReceita = dataReceita;
	}

	public Paciente getPaciente() {
		return paciente;
	}

	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}

	public Profissional getProfissional() {
		return profissional;
	}

	public void setProfissional(Profissional profissional) {
		this.profissional = profissional;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}

	public List<ItemReceita> getItemReceita() {
		return itemReceita;
	}

	public void setItemReceita(List<ItemReceita> itemReceita) {
		this.itemReceita = itemReceita;
	}
}