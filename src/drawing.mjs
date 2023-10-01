// drawing.js
// Importing the file system promises API for writing to a file
const fs = await import('fs/promises');

// GenericElement class to create and manage SVG elements
class GenericElement {
    // constructor initializes the element with a name and empty attributes and children arrays
    constructor(name) {
        this.name = name;
        this.attributes = {};
        this.children = [];
    }

    // Adds an attribute to the element's attributes object
    addAttr(name, value) {
        this.attributes[name] = value;
    }

    // Merges multiple attributes into the element's attributes object
    addAttrs(obj) {
        Object.assign(this.attributes, obj);
    }

    // Removes an array of attributes from the element's attributes object
    removeAttrs(arr) {
        arr.forEach(attr => delete this.attributes[attr]);
    }

    // Sets the value of a specific attribute in the element's attributes object
    setAttr(name, value) {
        this.attributes[name] = value;
    }

    // Adds a child element to the element's children array
    addChild(child) {
        this.children.push(child);
    }

    // Converts the element to a string representation, including its attributes and children
    toString() {
        let attrs = '';
        for (const [key, value] of Object.entries(this.attributes)) {
            attrs += ` ${key}="${value}"`;
        }
        const children = this.children.map(child => child.toString()).join('');
        return `<${this.name}${attrs}>${children}</${this.name}>\n`;
    }
}

// RootElement class for the root SVG element, extending the GenericElement class
class RootElement extends GenericElement {
    constructor() {
        super('svg');
        // Adds the xmlns attribute required for SVG elements
        this.addAttr('xmlns', 'http://www.w3.org/2000/svg');
    }

    // Writes the string representation of the SVG to a file
    write(fileName, cb) {
        fs.writeFile(fileName, this.toString(), cb);
    }
}

// RectangleElement class for creating rectangle elements, extending the GenericElement class
class RectangleElement extends GenericElement {
    constructor(x, y, width, height, fill) {
        super('rect');
        // Adds attributes for positioning, dimensions, and fill color
        this.addAttrs({ x, y, width, height, fill });
    }
}

// TextElement class for creating text elements, extending the GenericElement class
class TextElement extends GenericElement {
    constructor(x, y, fontSize, fill, content) {
        super('text');
        // Adds attributes for positioning, font size, fill color, and text content
        this.addAttrs({ x, y, 'font-size': fontSize, fill });
        this.content = content;
    }

    // Converts the text element to a string representation, including its content
    toString() {
        let attrs = '';
        for (const [key, value] of Object.entries(this.attributes)) {
            attrs += ` ${key}="${value}"`;
        }
        return `<${this.name}${attrs}>${this.content}</${this.name}>\n`;
    }
}

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));