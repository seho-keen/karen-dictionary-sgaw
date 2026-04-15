import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

import fs from 'fs';

interface DictionaryEntry {
  id: string;
  karen: string;
  pronunciation: string;
  korean: string;
  partOfSpeech: string;
  level: number;
  exampleKaren: string;
  exampleKorean: string;
}

async function main() {
  const filePath = '/Users/sehopark/Dropbox/Mac/Downloads/karen_dictionary_backup.json';
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data: DictionaryEntry[] = JSON.parse(rawData);

  console.log(`Found ${data.length} entries to import.`);

  const { db } = await import('../src/db/index.js');
  const { words, examples } = await import('../src/db/schema.js');

  let successCount = 0;
  for (const item of data) {
    try {
      // Insert the word into the DB and get the auto-generated ID
      const [insertedWord] = await db.insert(words).values({
        karenWord: item.karen,
        koreanWord: item.korean,
        romanization: item.pronunciation,
        partOfSpeech: item.partOfSpeech,
        level: item.level,
      }).returning({ id: words.id });

      // If there are examples, insert them linking to the new word's ID
      if (item.exampleKaren && item.exampleKorean) {
        await db.insert(examples).values({
          wordId: insertedWord.id,
          karenSentence: item.exampleKaren,
          koreanTranslation: item.exampleKorean,
        });
      }
      successCount++;
    } catch (error) {
      console.error(`Failed to import word: ${item.karen}`, error);
    }
  }

  console.log(`Process complete. Successfully imported ${successCount} out of ${data.length} entries.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("An error occurred during import:", error);
  process.exit(1);
});
