
# GeoNetwork metadata schema generator
 
Yeoman generator to create a new metadata schemas based in iso19139 schema for [GeoNetwork opensource](https://geonetwork-opensource.org/) 

## Installation

First, install [Yeoman](http://yeoman.io) using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
```

Install the GeoNetwork metadata schema generator:

```bash
git clone https://github.com/josegar74/generator-geonetwork-metadata-schema.git
cd generator-geonetwork-metadata-schema
npm install
npm link
```

## Usage

To generate your new project:

```bash
yo geonetwork-metadata-schema
```

Enter the following information:

- Metadata schema name: enter the name of the metadata schema. For ISO19139 metadata schemas, should follow this format: `iso19139.name`.
- Metadata schema title: descriptive title of the metadata schema.
- Metadata schema description: description of the metadata schema.
- GeoNetwork version: select one of the provided choices. Current versions supported:
   - 3.4.1
   - 3.4.2
   - 3.4.3+ (since 3.4.3 pom version management is different than from previous 3.4 releases)

Example:   
 
```
? Metadata schema name iso19139.gdpr
? Metadata schema title ISO19139 GDPR Profile Version 1.0
? Metadata schema description The European General Data Protection Regulation recommends to set up a registry to capture for each dataset containing sensitive personal data details about the treatment of the 
dataset. This profile extends the ISO 19139 schema to facilitate to capture typical GDPR metadata elements, that do not fit in any of the ISO 19139 fields.
? GeoNetwork version 3.4.3+
? Create Java plugin code? No
```

## License

MIT © [Jose García]()

