import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { detectCommand } from './commands/detect';
import { humanizeCommand } from './commands/humanize';
import { creditsCommand } from './commands/credits';
import type { Argv } from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('humanizerai')
  .usage('$0 <command> [options]')
  .command(
    'detect',
    'Detect AI-generated text (free, no credits used)',
    (yargs: Argv) => {
      return yargs
        .option('text', {
          alias: 't',
          describe: 'Text to analyze',
          type: 'string',
        })
        .option('file', {
          alias: 'f',
          describe: 'Path to text file to analyze',
          type: 'string',
        })
        .example('$0 detect -t "Your text here"', 'Detect AI in inline text')
        .example('$0 detect -f essay.txt', 'Detect AI in a file')
        .example('echo "text" | $0 detect', 'Pipe text from stdin');
    },
    detectCommand as any
  )
  .command(
    'humanize',
    'Humanize AI-generated text (uses credits: 1 word = 1 credit)',
    (yargs: Argv) => {
      return yargs
        .option('text', {
          alias: 't',
          describe: 'Text to humanize',
          type: 'string',
        })
        .option('file', {
          alias: 'f',
          describe: 'Path to text file to humanize',
          type: 'string',
        })
        .option('intensity', {
          alias: 'i',
          describe: 'Humanization intensity',
          type: 'string',
          choices: ['light', 'medium', 'aggressive'],
          default: 'medium',
        })
        .option('raw', {
          alias: 'r',
          describe: 'Output only the humanized text (for piping)',
          type: 'boolean',
          default: false,
        })
        .example('$0 humanize -t "Your AI text"', 'Humanize with medium intensity')
        .example('$0 humanize -t "Text" -i aggressive', 'Humanize with max bypass')
        .example('$0 humanize -f draft.txt -r > final.txt', 'Humanize file and save output')
        .example('echo "AI text" | $0 humanize -r', 'Pipe in and get clean output');
    },
    humanizeCommand as any
  )
  .command(
    'credits',
    'Check credit balance and plan status',
    {},
    creditsCommand as any
  )
  .demandCommand(1, 'You need at least one command')
  .help()
  .alias('h', 'help')
  .version()
  .alias('v', 'version')
  .epilogue(
    'For more information, visit: https://humanizerai.com\n\n' +
    'Set your API key: export HUMANIZERAI_API_KEY=hum_your_key\n\n' +
    'Discover more AI agent skills at https://agentskill.sh'
  )
  .parse();
