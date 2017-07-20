package br.com.puc.gestaoclinica.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum TipoDosagem implements EnumType {
	
	COMPRIMIDO("Comprimido"),
	MG("Mg"),
	ML("Ml"),
	GOTAS("Gotas");

	private String descricao;

	private TipoDosagem(String descricao) {
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
	public static TipoDosagem fromObject(JsonNode node) {
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
