import { config } from 'dotenv';
import path from 'path';

// Load env variables
config({ path: path.join(process.cwd(), '.env.local') });

import fs from 'fs';

async function main() {
  const filePath = path.join(__dirname, 'karen_extracted.json');
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}. Please run the Python extraction script first.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(rawData);

  console.log(`Found ${data.length} entries to import.`);

  const { db } = await import('../src/db/index.js');
  const { words, examples } = await import('../src/db/schema.js');
  const { getKoreanPronunciation } = await import('../src/utils/pronunciation.js');
  const { eq } = await import('drizzle-orm');

  let successCount = 0;
  let skippedCount = 0;
  for (const item of data) {
    try {
      const existing = await db.select().from(words).where(eq(words.karenWord, item.karen)).limit(1);
      if (existing.length > 0) {
        skippedCount++;
        continue;
      }
      
      const romanizationStr = item.pronunciation || getKoreanPronunciation(item.karen) || null;
      
      const [insertedWord] = await db.insert(words).values({
        karenWord: item.karen,
        koreanWord: item.korean,
        romanization: romanizationStr,
        partOfSpeech: item.partOfSpeech || '단어',
        level: item.level || 1,
      }).returning({ id: words.id });

      if (item.exampleKaren || item.exampleKorean) {
        await db.insert(examples).values({
          wordId: insertedWord.id,
          karenSentence: item.exampleKaren || '',
          koreanTranslation: item.exampleKorean || '',
        });
      }
      successCount++;
    } catch (error) {
      console.error(`Failed to import word: ${item.karen}`, error);
    }
  }

  console.log(`Import summary: successfully inserted ${successCount} new entries (${skippedCount} duplicates skipped).`);
  process.exit(0);
}

main().catch((error) => {
  console.error("An error occurred during import:", error);
  process.exit(1);
});
