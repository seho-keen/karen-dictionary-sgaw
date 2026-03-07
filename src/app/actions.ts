"use server";

import { put } from "@vercel/blob";
import { db } from "@/db";
import { words, examples, relates, media } from "@/db/schema";
import { eq, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ─── Add Word ───────────────────────────────────────────
export async function addWord(formData: FormData) {
  const karenWord = formData.get("karenWord") as string;
  const koreanWord = formData.get("koreanWord") as string;
  const romanization = (formData.get("romanization") as string) || null;
  const partOfSpeech = (formData.get("partOfSpeech") as string) || null;
  const targetAudience = (formData.get("targetAudience") as string) || "all";

  if (!karenWord || !koreanWord) {
    throw new Error("Karen word and Korean translation are required.");
  }

  // Insert the word
  const wordId = crypto.randomUUID();
  await db.insert(words).values({
    id: wordId,
    karenWord,
    koreanWord,
    romanization,
    partOfSpeech,
    targetAudience,
  });

  // Helper to handle media uploads to Vercel Blob
  const processMedia = async (file: File | null, mediaType: "image" | "audio" | "video") => {
    if (file && file.size > 0 && file.name !== "undefined") {
      const uniqueId = crypto.randomUUID();
      let ext = "";
      if (file.name && file.name.includes(".")) {
        ext = file.name.substring(file.name.lastIndexOf("."));
      }
      if (!ext) {
        ext = mediaType === "image" ? ".jpg" : mediaType === "audio" ? ".m4a" : ".mp4";
      }
      const filename = `${uniqueId}${ext}`;

      // Upload to Vercel Blob
      const blob = await put(filename, file, { access: 'public' });

      await db.insert(media).values({
        id: crypto.randomUUID(),
        wordId,
        mediaType,
        mediaUrl: blob.url,
      });
    }
  };

  // Process all media types
  await processMedia(formData.get("mediaImage") as File | null, "image");
  await processMedia(formData.get("mediaAudio") as File | null, "audio");
  await processMedia(formData.get("mediaVideo") as File | null, "video");

  // Insert examples (dynamic count from form)
  const exampleKarenEntries = formData.getAll("exampleKaren") as string[];
  const exampleKoreanEntries = formData.getAll("exampleKorean") as string[];

  for (let i = 0; i < exampleKarenEntries.length; i++) {
    const karenSentence = exampleKarenEntries[i]?.trim();
    const koreanTranslation = exampleKoreanEntries[i]?.trim();
    if (karenSentence && koreanTranslation) {
      await db.insert(examples).values({
        id: crypto.randomUUID(),
        wordId,
        karenSentence,
        koreanTranslation,
      });
    }
  }

  revalidatePath("/");
  redirect("/");
}

// ─── Get All Words ──────────────────────────────────────
export async function getWords() {
  const allWords = await db
    .select()
    .from(words)
    .orderBy(words.karenWord);
  return allWords;
}

// ─── Search Words ───────────────────────────────────────
export async function searchWords(query: string) {
  if (!query.trim()) {
    return getWords();
  }
  const pattern = `%${query}%`;
  const results = await db
    .select()
    .from(words)
    .where(
      or(
        like(words.karenWord, pattern),
        like(words.koreanWord, pattern),
        like(words.romanization, pattern)
      )
    )
    .orderBy(words.karenWord);
  return results;
}

// ─── Get Word By ID (with examples & relates) ──────────
export async function getWordById(id: string) {
  const word = await db
    .select()
    .from(words)
    .where(eq(words.id, id))
    .limit(1);

  if (!word.length) return null;

  const wordExamples = await db
    .select()
    .from(examples)
    .where(eq(examples.wordId, id));

  // Get related words (synonyms and antonyms)
  const wordRelates = await db
    .select()
    .from(relates)
    .where(eq(relates.wordId, id));

  // Resolve related word names
  const relatedWordDetails = await Promise.all(
    wordRelates.map(async (rel) => {
      const relatedWord = await db
        .select()
        .from(words)
        .where(eq(words.id, rel.relatedWordId))
        .limit(1);
      return {
        ...rel,
        relatedKarenWord: relatedWord[0]?.karenWord ?? "",
        relatedKoreanWord: relatedWord[0]?.koreanWord ?? "",
      };
    })
  );

  const wordMedia = await db
    .select()
    .from(media)
    .where(eq(media.wordId, id));

  return {
    ...word[0],
    examples: wordExamples,
    relates: relatedWordDetails,
    media: wordMedia,
  };
}

// ─── Delete Word ────────────────────────────────────────
export async function deleteWord(id: string) {
  await db.delete(words).where(eq(words.id, id));
  revalidatePath("/");
  redirect("/");
}
