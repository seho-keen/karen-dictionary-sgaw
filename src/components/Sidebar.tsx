import Link from "next/link";
import { BookOpen, PlusCircle, Search, Settings } from "lucide-react";

export function Sidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-muted/30">
            <div className="flex h-14 items-center border-b px-4 font-semibold">
                <BookOpen className="mr-2 h-5 w-5" />
                <span>Karen Dictionary</span>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Search className="h-4 w-4" />
                        Dictionary
                    </Link>
                    <Link
                        href="/add"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary bg-muted transition-all"
                    >
                        <PlusCircle className="h-4 w-4" />
                        Add New Word
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </nav>
            </div>
        </div>
    );
}
