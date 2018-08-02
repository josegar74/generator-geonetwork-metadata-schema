'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

const copyTemplates = generator => {
  generator.props.uuid = uuidv4();

  if (generator.props.createjava) {
    generator.props.beanName = generator.props.name.toUpperCase().replace('.', '');
  } else {
    generator.props.beanName = 'ISO19139';
  }

  if (generator.props.gnversion === '3.4.3+') {
    generator.props.pomversion = '3.4';
  } else {
    generator.props.pomversion = generator.props.gnversion + '-0';
  }

  generator.props.branchname = generator.props.gnversion.substring(0, 3) + '.x';

  const templatePath = (generator.props.is19139schema?"iso19139/":"non-iso19139/") + generator.props.gnversion.substring(0, 3);
  generator.log(templatePath);
  generator.destinationRoot(`${generator.destinationPath(generator.props.name)}`);
  const root = generator.templatePath(templatePath);
  const pattern = generator.props.createjava ? '**' : '**/!(*.java)';
  const files = glob.sync(pattern, { dot: true, nodir: true, cwd: root });
  for (let i in files) {
    generator.fs.copyTpl(
      generator.templatePath(templatePath, `./${files[i]}`),
      generator.destinationPath(files[i]),
      generator.props
    );
  }
};

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the epic ${chalk.red('geonetwork-metadata-schema')} generator!`)
    );
    this.log(
      'This generator facilitates the creation of the basic structure for metadata schemas to be used in GeoNetwork opensource (https://geonetwork-opensource.org/).\n'
    );

    this.log(
      'Creating the structure of the metadata schema is just a first step to develop a new metadata schema for GeoNetwork opensource. You need to add any developments/customisations required for your schema, among others: metadata editor customisations, validation rules, etc.\n'
    );

    this.log(
      'By default, the generator creates metadata schemas based on ISO19139, delegating most of the code to the existing ISO19139 schema in GeoNetwork.\n'
    );

    this.log(
      'It\'s also possible to create schemas NON based on ISO19139, but this requires much more development effort.\n'
    );

    this.log(
      'For further information about developing metadata schemas for GeoNetwork opensource, see https://geonetwork-opensource.org/manuals/3.4.x/en/customizing-application/implementing-a-schema-plugin.html\n'
    );

    const prompts = [
      {
        type: 'confirm',
        name: 'is19139schema',
        message:
          'Do you want to generate a metadata schema based on ISO19139?',
        default: true
      },
      {
        when: function(props) {
          return props.is19139schema;
        },
        type: 'input',
        name: 'name',
        message: 'Metadata schema name',
        default: 'iso19139.test',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            if (value.startsWith('iso19139.')) {
              return true;
            }
            return "Please enter a valid schema name. Valid schema names should start with 'iso19139.'";
          }
          return 'Please enter a non empty metadata schema name';
        }
      },
      {
        when: function(props) {
          return !props.is19139schema;
        },
        type: 'input',
        name: 'name',
        message: 'Metadata schema name',
        default: 'test',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            return true;
          }
          return 'Please enter a non empty metadata schema name';
        }
      },
      {
        type: 'input',
        name: 'title',
        message: 'Metadata schema title',
        default: 'Test schema',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            return true;
          }

          return 'Please enter a non empty metadata schema title';
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Metadata schema description',
        default: 'Test schema description',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            return true;
          }

          return 'Please enter a non empty metadata schema description';
        }
      },
      {
        type: 'list',
        name: 'gnversion',
        message: 'GeoNetwork version',
        choices: ['3.4.1', '3.4.2', '3.4.3+'],
        default: '3.4.3+'
      },
      {
        when: function(props) {
          return props.is19139schema;
        },
        type: 'confirm',
        name: 'identifymetadatastandard',
        message:
          'Use metadata standard name (gmd:metadataStandardName) and version (gmd:metadataStandardVersion) elements to identify the metadata',
        default: false
      },
      {
        when: function(props) {
          return props.identifymetadatastandard;
        },
        type: 'input',
        name: 'metadatastandardname',
        message:
          'Metadata standard name (multiple values can be entered separated by | )',
        default: 'ISO 19115',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            return true;
          }

          return 'Please enter a non empty metadata standard name';
        }
      },
      {
        when: function(props) {
          return props.identifymetadatastandard;
        },
        type: 'input',
        name: 'metadatastandardversion',
        message:
          'Metadata standard version (multiple values can be entered separated by | )',
        default: '1.0',
        validate: function(value) {
          var pass = !_.isEmpty(_.trim(value));

          if (pass) {
            return true;
          }

          return 'Please enter a non empty metadata standard version';
        }
      },
      {
        when: function(props) {
          return props.is19139schema;
        },
        type: 'confirm',
        name: 'createjava',
        message: 'Create Java plugin code?',
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    copyTemplates(this);

    this.fs.move(
      this.destinationPath('src/main/plugin/schemaname/**'),
      this.destinationPath('src/main/plugin/' + this.props.name)
    );

    if (this.props.createjava) {
      this.fs.move(
        this.destinationPath(
          'src/main/java/org/fao/geonet/schema/schemaname/ISO19139Namespaces.java'
        ),
        this.destinationPath(
          'src/main/java/org/fao/geonet/schema/' +
            this.props.name.replace('.', '_') +
            '/' +
            this.props.name.toUpperCase().replace('.', '') +
            'Namespaces.java'
        )
      );

      this.fs.move(
        this.destinationPath(
          'src/main/java/org/fao/geonet/schema/schemaname/ISO19139SchemaPlugin.java'
        ),
        this.destinationPath(
          'src/main/java/org/fao/geonet/schema/' +
            this.props.name.replace('.', '_') +
            '/' +
            this.props.name.toUpperCase().replace('.', '') +
            'SchemaPlugin.java'
        )
      );
    }
  }

  install() {
    // This.installDependencies();
  }
};
