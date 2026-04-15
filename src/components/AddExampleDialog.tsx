"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Loader2 } from "lucide-react";
import { addExampleToWord } from "@/app/actions";

export function AddExampleDialog({ wordId }: { wordId: string }) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setSaving(true);
        try {
            await addExampleToWord(wordId, formData);
            setOpen(false);
        } catch (error) {
            console.error("Failed to add example", error);
            alert("Failed to add example. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Example
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form action={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add Example Sentence</DialogTitle>
                        <DialogDescription>
                            Add a Karen sentence and its Korean translation for this word.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="karen">Karen Sentence</Label>
                            <Input
                                id="karen"
                                name="karen"
                                placeholder="e.g. မင်္ဂလာပါ"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="korean">Korean Translation</Label>
                            <Input
                                id="korean"
                                name="korean"
                                placeholder="e.g. 안녕하세요"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Example
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
