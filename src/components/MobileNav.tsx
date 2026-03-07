"use client";

import { Menu, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "./ui/sheet";
import Link from "next/link";

export function MobileNav() {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/30 px-4 md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6" />
                            <span className="font-semibold text-lg">Karen Dictionary</span>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="grid gap-2 text-lg font-medium mt-6">
                        <Link
                            href="/"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                            Dictionary Search
                        </Link>
                        <Link
                            href="/add"
                            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground"
                        >
                            Add New Word
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-2">
                <h1 className="font-semibold px-2">Data Collector</h1>
            </div>
        </header>
    );
}
