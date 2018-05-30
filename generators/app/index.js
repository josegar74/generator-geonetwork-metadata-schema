'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const uuidv4 = require('uuid/v4');

const copyTemplates = generator => {
  generator.props.uuid = uuidv4();
  generator.destinationRoot(`${generator.destinationPath(generator.props.name)}`);
  const root = generator.templatePath();
  const files = glob.sync('**', { dot: true, nodir: true, cwd: root });
  for (let i in files) {
    generator.fs.copyTpl(
      generator.templatePath(`./${files[i]}`),
      generator.destinationPath(files[i]),
      generator.props
    );
  }
}

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the epic ${chalk.red('generator-gn-schema')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Metadata schema name',
        default: 'iso19139.test'
      },
      {
        type: 'input',
        name: 'title',
        message: 'Metadata schema title',
        default: 'Test schema'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Metadata schema description',
        default: 'Test schema description'
      },
      {
        type: 'input',
        name: 'version',
        message: 'Metadata schema pom version',
        default: '3.4.3-SNAPSHOT'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    /*this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    );

    this.fs.copyTpl(this.templatePath('pom.xml'), this.destinationPath('pom.xml'), {
      name: this.props.name,
      version: this.props.version
    });*/

    copyTemplates(this);

    this.fs.move(
      this.destinationPath('src/main/plugin/schemaname/**'),
      this.destinationPath('src/main/plugin/' + this.props.name)
  );
  }

  install() {
    //this.installDependencies();
  }
};
