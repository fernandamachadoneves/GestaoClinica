package br.com.puc.gestaoclinica.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum TipoResultadoExame implements EnumType {
	NORMAL("Normal"),
	ALTERADO("Alterado"),
	SUSPEITO("Suspeito");

	private String descricao;

	private TipoResultadoExame(String descricao) {
		this.descricao = descricao;
	}

	@Override
	public String getDescricao() {
		return this.descricao;
	}

	@Override
	public String getType() {
		return this.toString();
	}

	@JsonCreator
	public static TipoResultadoExame fromObject(JsonNode node) {
		String type = null;
		if (node.getNodeType().equals(JsonNodeType.STRING)) {
			type = node.asText();
		} else {
			if (!node.has("type")) {
				throw new IllegalArgumentException();
			}
			type = node.get("type").asText();
		}
		return valueOf(type);
	}
}
