import { AttributeDictionary } from './models/attributeDictionary';

export class Helper {
	static createSVGElement(
		name: string,
		attributes?: AttributeDictionary,
		dashValues: boolean = false
	): SVGElement {
		const node = document.createElementNS('http://www.w3.org/2000/svg', name);
		for (let attr in attributes) {
			if (dashValues) {
				node.setAttributeNS(
					null,
					attr.replace(/[A-Z]/g, function (m, p, o, s) {
						return '-' + m.toLowerCase();
					}),
					attributes[attr].toString()
				);
			} else {
				node.setAttributeNS(null, attr, attributes[attr].toString());
			}
		}
		return node;
	}

    static appendTextNode(node: SVGElement, val: string): SVGElement {
        const textNode = document.createTextNode(val);
        node.appendChild(textNode);
        return node;
    }

	static appendNoteName(
		node: SVGElement,
		val: string,
		doubleAccidentalDy: string = "0em",
		doubleAccidentalSize: string = "1.55em"
	): SVGElement {
		const match = val.match(/^([A-G])([𝄪𝄫])$/u);
		if (!match) {
			return this.appendTextNode(node, val);
		}

		node.appendChild(document.createTextNode(match[1]));
		const accidental = this.createSVGElement("tspan", {
			fontSize: doubleAccidentalSize,
			dy: doubleAccidentalDy,
		}, true);
		node.appendChild(this.appendTextNode(accidental, match[2]));
		return node;
	}
}
