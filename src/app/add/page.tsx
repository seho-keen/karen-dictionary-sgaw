"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Mic, Camera, FileVideo, Loader2, CheckCircle, X } from "lucide-react";
import { addWord } from "@/app/actions";

export default function AddWordPage() {
    const [examples, setExamples] = useState([{ karen: "", korean: "" }]);
    const [saving, setSaving] = useState(false);

    // Previews
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewAudio, setPreviewAudio] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);

    // Refs
    const fileInputImageRef = useRef<HTMLInputElement>(null);
    const fileInputAudioRef = useRef<HTMLInputElement>(null);
    const fileInputVideoRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "audio" | "video") => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            if (type === "image") setPreviewImage(url);
            if (type === "audio") setPreviewAudio(url);
            if (type === "video") setPreviewVideo(url);
        }
    };

    const clearMedia = (type: "image" | "audio" | "video") => {
        if (type === "image") {
            setPreviewImage(null);
            if (fileInputImageRef.current) fileInputImageRef.current.value = "";
        }
        if (type === "audio") {
            setPreviewAudio(null);
            if (fileInputAudioRef.current) fileInputAudioRef.current.value = "";
        }
        if (type === "video") {
            setPreviewVideo(null);
            if (fileInputVideoRef.current) fileInputVideoRef.current.value = "";
        }
    };

    const addExample = () => setExamples([...examples, { karen: "", korean: "" }]);
    const removeExample = (index: number) => {
        setExamples(examples.filter((_, i) => i !== index));
    };

    const handleExampleChange = (index: number, field: "karen" | "korean", value: string) => {
        const newExamples = [...examples];
        newExamples[index][field] = value;
        setExamples(newExamples);
    };

    const handleSubmit = async (formData: FormData) => {
        setSaving(true);
        try {
            await addWord(formData);
        } catch {
            setSaving(false);
        }
    };

    return (
        <form action={handleSubmit} className="grid flex-1 items-start gap-4 mx-auto max-w-4xl w-full">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Add New Dictionary Entry</h1>
                <Button type="submit" disabled={saving}>
                    {saving ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><CheckCircle className="mr-2 h-4 w-4" /> Save Entry</>
                    )}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                {/* Main Word Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the core details of the word.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="karen-word">Karen Word *</Label>
                            <Input id="karen-word" name="karenWord" placeholder="e.g. မင်္ဂလာပါ" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="korean-word">Korean Translation *</Label>
                            <Input id="korean-word" name="koreanWord" placeholder="e.g. 안녕하세요" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="romanization">Romanization (Optional)</Label>
                            <Input id="romanization" name="romanization" placeholder="e.g. min ga la ba" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pos">Part of Speech</Label>
                                <Select name="partOfSpeech">
                                    <SelectTrigger id="pos">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="noun">Noun</SelectItem>
                                        <SelectItem value="verb">Verb</SelectItem>
                                        <SelectItem value="adjective">Adjective</SelectItem>
                                        <SelectItem value="adverb">Adverb</SelectItem>
                                        <SelectItem value="pronoun">Pronoun</SelectItem>
                                        <SelectItem value="phrase">Phrase</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target">Target Audience</Label>
                                <Select name="targetAudience" defaultValue="all">
                                    <SelectTrigger id="target">
                                        <SelectValue placeholder="Target" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="children">Children&apos;s Dictionary</SelectItem>
                                        <SelectItem value="students">Student&apos;s Dictionary</SelectItem>
                                        <SelectItem value="adults">Adult&apos;s Dictionary</SelectItem>
                                        <SelectItem value="all">All Ages</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Multimedia Uploads */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Context Image</CardTitle>
                            <CardDescription>Take a picture or upload an image.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                name="mediaImage"
                                accept="image/*"
                                capture="environment"
                                ref={fileInputImageRef}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "image")}
                            />
                            {previewImage ? (
                                <div className="relative border-2 rounded-lg p-2 flex flex-col items-center justify-center bg-muted/20">
                                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-black/5">
                                        <Image src={previewImage} alt="Preview" fill className="object-cover" />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-4 right-4 shadow-md"
                                        onClick={() => clearMedia("image")}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Remove Image
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputImageRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Tap to Add Image</h4>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Audio Pronunciation</CardTitle>
                            <CardDescription>Record native pronunciation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                name="mediaAudio"
                                accept="audio/*"
                                capture="environment"
                                ref={fileInputAudioRef}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "audio")}
                            />
                            {previewAudio ? (
                                <div className="relative border-2 rounded-lg p-4 flex flex-col items-center justify-center bg-muted/20 gap-4">
                                    <audio controls src={previewAudio} className="w-full" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => clearMedia("audio")}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Remove Audio
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputAudioRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Mic className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Tap to Record Audio</h4>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sign Language Video</CardTitle>
                            <CardDescription>Record sign language or contextual video.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                name="mediaVideo"
                                accept="video/*"
                                capture="environment"
                                ref={fileInputVideoRef}
                                className="hidden"
                                onChange={(e) => handleFileChange(e, "video")}
                            />
                            {previewVideo ? (
                                <div className="relative border-2 rounded-lg p-2 flex flex-col items-center justify-center bg-muted/20">
                                    <video controls src={previewVideo} className="w-full rounded-md aspect-video bg-black" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-4 right-4 shadow-md"
                                        onClick={() => clearMedia("video")}
                                    >
                                        <X className="w-4 h-4 mr-2" /> Remove Video
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputVideoRef.current?.click()}
                                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center gap-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                >
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <FileVideo className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold">Tap to Record Video</h4>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Example Sentences */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Example Sentences</CardTitle>
                        <CardDescription>Provide context on how the word is used.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {examples.map((ex, idx) => (
                            <div key={idx} className="flex items-start gap-4 bg-muted/30 p-4 rounded-lg border">
                                <div className="grid flex-1 gap-4">
                                    <div className="space-y-1">
                                        <Label>Karen Sentence</Label>
                                        <Textarea
                                            name="exampleKaren"
                                            placeholder="Karen usage example..."
                                            value={ex.karen}
                                            onChange={(e) => handleExampleChange(idx, "karen", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Korean Translation</Label>
                                        <Input
                                            name="exampleKorean"
                                            placeholder="Korean translation..."
                                            value={ex.korean}
                                            onChange={(e) => handleExampleChange(idx, "korean", e.target.value)}
                                        />
                                    </div>
                                </div>
                                {examples.length > 1 && (
                                    <Button type="button" variant="ghost" size="icon" className="text-destructive mt-6" onClick={() => removeExample(idx)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button type="button" variant="outline" className="w-full" onClick={addExample}>
                            <Plus className="w-4 h-4 mr-2" /> Add Another Example
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
