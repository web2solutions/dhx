$dhx.xml = {
	/**

		$dhx.xml.fromJSON( { menu: [
			{ item : { id: "recarregagrid", text : "reload", img : "atualizar.png", imgdis : "atualizar.png"}, child : [
				{ item : { id: "file_sep_0", text : "select all", img : "select_all.gif", imgdis : "select_all.gif"} }
			] }
			,{ item : { id: "file_sep_1", type : "separator"} }
			,{ item : { id: "selecionartodos", text : "select all", img : "select_all.gif", imgdis : "select_all.gif"} }
			,{ item : { id: "file_sep_2", type : "separator"} }
			,{ item : { id: "excluir", text : "delete selected", img : "excluir.png", imgdis : "excluir.png"} }

		] } )

		*/
	fromJSON: function (json, isRoot, parentNode, xmlDoc) {
		/**
				@parameter json - mandatory JSON:
			*/
		var self = $dhx;
		(typeof isRoot === 'undefined') ? isRoot = true: "";
		(typeof xmlDoc === 'undefined') ? xmlDoc = null: "";
		(typeof parentNode === 'undefined') ? parentNode = false: "";
		for (var root in json) {
			var rootText;
			//create root
			if (isRoot) {
				rootText = root;
				xmlDoc = document.implementation.createDocument(null, root, null);
				isRoot = false;
			}
			// if value from key is an array, lets append childs
			if (self.isArray(json[root])) {
				for (var index = 0; index < json[root].length; index++) {
					// { item : { id: "recarregagrid", text : "reload", img : "atualizar.png", imgdis : "atualizar.png"} }
					var nodeObj = json[root][index];
					//console.log( JSON.stringify(nodeObj) );
					//if nodeObj is a object
					if (self.isObject(nodeObj)) {
						//console.log(nodeObj);
						// iterates over nodeObj object and add a new node to parent node
						var pNodeName = '';
						var pNode = '';
						for (var nodeText in nodeObj) {
							var node = null;
							if ($dhx.isArray(nodeObj[nodeText])) {
								this.fromJSON(nodeObj, false, pNode, xmlDoc);
							}
							else {
								pNodeName = nodeText;
								node = xmlDoc.createElement(pNodeName);
								var attributes = nodeObj[nodeText];
								if (self.isObject(attributes)) {
									for (var attribute in attributes) {
										node.setAttribute(attribute, attributes[attribute]);
									}
								}
								(parentNode) ? parentNode.appendChild(node): xmlDoc.documentElement.appendChild(node);
								pNode = node;
							}
						}
					}
				}
			}
		}
		return xmlDoc;
	}
	, serialize: function (xmlNode) {
		if (typeof window.XMLSerializer != "undefined") {
			return (new window.XMLSerializer()).serializeToString(xmlNode);
		}
		else if (typeof xmlNode.xml != "undefined") {
			return xmlNode.xml;
		}
		return "";
	}
}