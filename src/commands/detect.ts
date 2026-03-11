import { getApi } from '../config';

export async function detectCommand(argv: any) {
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

  try {
    const result = await api.detect(text.trim());
    console.log(JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error(JSON.stringify({ error: error.message }, null, 2));
    process.exit(1);
  }
}
