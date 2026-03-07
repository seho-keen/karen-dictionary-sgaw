import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// WORDS TABLE
export const words = sqliteTable('words', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    karenWord: text('karen_word').notNull(),
    koreanWord: text('korean_word').notNull(),
    romanization: text('romanization'),
    partOfSpeech: text('part_of_speech'),
    targetAudience: text('target_audience').default('all'),
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
});

// MEDIA TABLE
export const media = sqliteTable('media', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    wordId: text('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
    mediaType: text('media_type').notNull(), // 'image', 'audio', 'video'
    mediaUrl: text('media_url').notNull(),
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
});

// EXAMPLES TABLE
export const examples = sqliteTable('examples', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    wordId: text('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
    karenSentence: text('karen_sentence').notNull(),
    koreanTranslation: text('korean_translation').notNull(),
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
});

// RELATES (Synonyms/Antonyms) TABLE
export const relates = sqliteTable('relates', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    wordId: text('word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
    relatedWordId: text('related_word_id').notNull().references(() => words.id, { onDelete: 'cascade' }),
    relationType: text('relation_type').notNull(), // 'synonym', 'antonym'
    createdAt: integer('created_at').default(sql`(strftime('%s', 'now'))`),
});
