"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { searchWords } from "@/app/actions";
import { isLegacyKaren } from "@/utils/isLegacyKaren";

type Word = {
    id: string;
    karenWord: string;
    koreanWord: string;
    romanization: string | null;
    partOfSpeech: string | null;
    targetAudience: string | null;
    createdAt: number | null;
};

export function WordList({ initialWords }: { initialWords: Word[] }) {
    const [words, setWords] = useState<Word[]>(initialWords);
    const [query, setQuery] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSearch = (value: string) => {
        setQuery(value);
        startTransition(async () => {
            const results = await searchWords(value);
            setWords(results);
        });
    };

    return (
        <>
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search word in Karen or Korean..."
                    className="pl-9"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                {isPending && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {/* Word List */}
            {words.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-[60vh]">
                    <div className="flex flex-col items-center gap-1 text-center w-full max-w-md p-4">
                        <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-2xl font-bold tracking-tight">
                            {query ? "No matching words" : "No words found"}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            {query
                                ? "Try a different search term."
                                : "Start building the dictionary by adding your first word data!"}
                        </p>
                        {!query && (
                            <Link href="/add" passHref>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Word
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {words.map((word) => (
                        <Link key={word.id} href={`/word/${word.id}`}>
                            <div className="group rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer">
                                <p className={`text-xl font-bold text-primary group-hover:text-primary/80 transition-colors ${isLegacyKaren(word.karenWord) ? 'font-karen-legacy' : ''}`}>
                                    {word.karenWord}
                                </p>
                                <p className="text-base text-foreground mt-1">{word.koreanWord}</p>
                                {word.romanization && (
                                    <p className="text-sm text-muted-foreground mt-0.5">[{word.romanization}]</p>
                                )}
                                <div className="flex gap-2 mt-3">
                                    {word.partOfSpeech && (
                                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full capitalize">
                                            {word.partOfSpeech}
                                        </span>
                                    )}
                                    {word.targetAudience && word.targetAudience !== "all" && (
                                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full capitalize">
                                            {word.targetAudience}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
