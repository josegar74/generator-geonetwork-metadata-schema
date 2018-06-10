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

  const templatePath = generator.props.gnversion.substring(0, 3);
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
    this.log(yosay(`Welcome to the epic ${chalk.red('generator-gn-schema')} generator!`));

    const prompts = [
      {
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
