import { getWords } from "./actions";
import { WordList } from "@/components/WordList";

export default async function Home() {
  const allWords = await getWords();

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dictionary Search</h1>
      </div>
      <WordList initialWords={allWords} />
    </>
  );
}
