import { IDictionary } from './models/IDictionary';

export class Helper {
	static createSVGElement(name: string, attributes?: IDictionary) {
		const node = document.createElementNS('http://www.w3.org/2000/svg', name);
		for (let attr in attributes) {
			node.setAttributeNS(null, attr, attributes[attr]);
		}
		return node;
	}
}
