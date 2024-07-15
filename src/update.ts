import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';
import CharacterSet from 'characterset';

const UNICODE_VERSION = '16.0.0';

async function unicode() {
  const response = await fetch(
    `https://www.unicode.org/Public/${UNICODE_VERSION}/ucd/UnicodeData.txt`
  );

  const text = await response.text();
  const rows = text.split('\n');
  const names = {};

  for (const row of rows) {
    const [codepoint, name] = row.split(';');

    names[parseInt(codepoint, 16)] = (name || '').trim();
  }

  return names;
}

async function main() {
  const names = await unicode();

  await writeFile(
    './data.js',
    `const names = new Map(Object.entries(${JSON.stringify(names, null, 2)}));
export default names;`
  );
}

main();
