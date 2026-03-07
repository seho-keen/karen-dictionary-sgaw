import { getWordById } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, PlaySquare, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { DeleteWordButton } from "@/components/DeleteWordButton";
import Image from "next/image";

export default async function WordDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const word = await getWordById(id);

    if (!word) {
        notFound();
    }

    const synonyms = word.relates.filter((r) => r.relationType === "synonym");
    const antonyms = word.relates.filter((r) => r.relationType === "antonym");

    return (
        <div className="grid flex-1 items-start gap-4 mx-auto max-w-4xl w-full">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link href="/" passHref>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Word Details</h1>
                </div>
                <DeleteWordButton wordId={word.id} />
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
                {/* Main Word Header */}
                <Card className="md:col-span-2">
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-4xl md:text-5xl mb-2 font-black text-primary">
                                    {word.karenWord}
                                </CardTitle>
                                <CardDescription className="text-xl text-foreground font-medium">
                                    {word.koreanWord}
                                </CardDescription>
                                {word.romanization && (
                                    <p className="text-muted-foreground mt-1">[{word.romanization}]</p>
                                )}
                            </div>
                            <div className="flex gap-2 flex-col items-end">
                                {word.partOfSpeech && (
                                    <Badge variant="secondary" className="capitalize">{word.partOfSpeech}</Badge>
                                )}
                                {word.targetAudience && (
                                    <Badge variant="outline" className="capitalize">{word.targetAudience} Audience</Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {word.media.length > 0 && (
                            <div className="flex flex-col gap-4 mt-4">
                                {word.media.filter((m) => m.mediaType === "image").map((img) => (
                                    <div key={img.id} className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted/20 border">
                                        <Image src={img.mediaUrl} alt={`Image for ${word.karenWord}`} fill className="object-cover" />
                                    </div>
                                ))}
                                <div className="flex flex-col gap-4">
                                    {word.media.filter((m) => m.mediaType === "audio").map((audio) => (
                                        <div key={audio.id} className="w-full border rounded-lg p-2 bg-muted/20">
                                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground px-1">
                                                <Volume2 className="w-4 h-4" /> Audio Pronunciation
                                            </div>
                                            <audio controls src={audio.mediaUrl} className="w-full" />
                                        </div>
                                    ))}
                                    {word.media.filter((m) => m.mediaType === "video").map((video) => (
                                        <div key={video.id} className="w-full border rounded-lg p-2 bg-muted/20">
                                            <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground px-1">
                                                <PlaySquare className="w-4 h-4" /> Sign Language Video
                                            </div>
                                            <video controls src={video.mediaUrl} className="w-full aspect-video rounded-md bg-black" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Relates (Synonyms/Antonyms) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Related Words</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Synonyms (유의어)</h4>
                            {synonyms.length > 0 ? (
                                <ul className="space-y-2">
                                    {synonyms.map((syn) => (
                                        <li key={syn.id}>
                                            <Link href={`/word/${syn.relatedWordId}`} className="text-primary hover:underline">
                                                {syn.relatedKarenWord} ({syn.relatedKoreanWord})
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No synonyms yet</p>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Antonyms (반의어)</h4>
                            {antonyms.length > 0 ? (
                                <ul className="space-y-2">
                                    {antonyms.map((ant) => (
                                        <li key={ant.id}>
                                            <Link href={`/word/${ant.relatedWordId}`} className="text-primary hover:underline">
                                                {ant.relatedKarenWord} ({ant.relatedKoreanWord})
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No antonyms yet</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Examples */}
                <Card className="md:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Example Sentences</CardTitle>
                            <Button variant="ghost" size="sm">
                                <PlusCircle className="h-4 w-4 mr-2" /> Add Example
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {word.examples.length > 0 ? (
                            word.examples.map((ex) => (
                                <div key={ex.id} className="p-4 rounded-lg bg-muted/40 border">
                                    <p className="text-lg font-medium mb-1">{ex.karenSentence}</p>
                                    <p className="text-muted-foreground">{ex.koreanTranslation}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No examples added yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
