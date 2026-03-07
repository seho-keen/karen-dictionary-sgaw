"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteWord } from "@/app/actions";
import { useState } from "react";

export function DeleteWordButton({ wordId }: { wordId: string }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("정말 이 단어를 삭제하시겠습니까?\nAre you sure you want to delete this word?")) return;
        setDeleting(true);
        await deleteWord(wordId);
    };

    return (
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <><Trash2 className="w-4 h-4 mr-2" /> Delete</>
            )}
        </Button>
    );
}
