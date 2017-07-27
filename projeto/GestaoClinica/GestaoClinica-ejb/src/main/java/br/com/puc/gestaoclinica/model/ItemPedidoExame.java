package br.com.puc.gestaoclinica.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

@Entity
@XmlRootElement
@Table(name = "ItemPedidoExame")
public class ItemPedidoExame implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne
	@JoinColumn(name = "pedidoExame")
	private PedidoExame pedidoExame;
	
	@ManyToOne
	@JoinColumn(name = "exame")
	private Exame exame;
	
	@Column(name = "justificativa")
	private String justificativa;
	
	@Column(name = "resultado")
	private String resultado;
	
	@Column(name = "dataRealizacao")
	private Date dataRealizacao;
	
	@Column(name = "observacao")
	private String observacao;
	
	@Column(name = "ativo")
	private Boolean ativo;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public PedidoExame getPedidoExame() {
		return pedidoExame;
	}

	public void setPedidoExame(PedidoExame pedidoExame) {
		this.pedidoExame = pedidoExame;
	}

	public Exame getExame() {
		return exame;
	}

	public void setExame(Exame exame) {
		this.exame = exame;
	}

	public String getResultado() {
		return resultado;
	}

	public void setResultado(String resultado) {
		this.resultado = resultado;
	}

	public String getJustificativa() {
		return justificativa;
	}

	public void setJustificativa(String justificativa) {
		this.justificativa = justificativa;
	}

	public Boolean getAtivo() {
		return ativo;
	}

	public void setAtivo(Boolean ativo) {
		this.ativo = ativo;
	}
}