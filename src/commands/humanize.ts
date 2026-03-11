import { getApi } from '../config';

export async function humanizeCommand(argv: any) {
  const api = getApi();

  let text: string;

  if (argv.file) {
    const fs = await import('fs');
    text = fs.readFileSync(argv.file, 'utf-8');
  } else if (argv.text) {
    text = Array.isArray(argv.text) ? argv.text.join(' ') : argv.text;
  } else {
    // Read from stdin
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) {
      chunks.push(chunk);
    }
    text = Buffer.concat(chunks).toString('utf-8');
  }

  if (!text || !text.trim()) {
    console.error('Error: No text provided. Use -t "text", -f file.txt, or pipe from stdin.');
    process.exit(1);
  }

  const intensity = argv.intensity || 'medium';

  try {
    const result = await api.humanize(text.trim(), intensity);

    if (argv.raw) {
      // Raw mode: just output the humanized text (for piping)
      process.stdout.write(result.humanizedText);
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error: any) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}
