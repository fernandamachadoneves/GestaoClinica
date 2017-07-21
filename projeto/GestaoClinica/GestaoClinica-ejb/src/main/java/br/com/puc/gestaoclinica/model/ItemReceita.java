package br.com.puc.gestaoclinica.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@XmlRootElement
@Table(name = "ItemReceita")
public class ItemReceita implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "receita")
	private Receita receita;
	
	@ManyToOne
	@JoinColumn(name = "medicamento")
	private Medicamento medicamento;
	
	@Enumerated(EnumType.STRING)
	@Column(name = "tipoDosagem")
	private TipoDosagem tipoDosagem;
	
	@Column(name = "quantidade")
	private Integer quantidade;
	
	@Column(name = "dias")
	private Integer dias;
	
	@Column(name = "frequencia")
	private String frequencia;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public TipoDosagem getTipoDosagem() {
		return tipoDosagem;
	}

	public void setTipoDosagem(TipoDosagem tipoDosagem) {
		this.tipoDosagem = tipoDosagem;
	}

	public Integer getQuantidade() {
		return quantidade;
	}

	public void setQuantidade(Integer quantidade) {
		this.quantidade = quantidade;
	}

	public Integer getDias() {
		return dias;
	}

	public void setDias(Integer dias) {
		this.dias = dias;
	}

	public String getFrequencia() {
		return frequencia;
	}

	public void setFrequencia(String frequencia) {
		this.frequencia = frequencia;
	}

	public Medicamento getMedicamento() {
		return medicamento;
	}

	public void setMedicamento(Medicamento medicamento) {
		this.medicamento = medicamento;
	}

	public Receita getReceita() {
		return receita;
	}

	public void setReceita(Receita receita) {
		this.receita = receita;
	}
}