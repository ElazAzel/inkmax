import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PageGoal, PageNiche } from '@/domain/value-objects/PageGeneration';
import { PageGeneratorService } from '@/services/PageGeneratorService';
import { BaseBlock } from '@/domain/entities/Block';
import { toast } from "sonner";

interface PageGenerationWizardProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onGenerate: (blocks: BaseBlock[]) => void;
}

export function PageGenerationWizard({ isOpen, onOpenChange, onGenerate }: PageGenerationWizardProps) {
    const [niche, setNiche] = useState<PageNiche | ''>('');
    const [goal, setGoal] = useState<PageGoal | ''>('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!niche || !goal) {
            toast.error("Please select both a niche and a goal.");
            return;
        }

        setIsLoading(true);
        try {
            // Simulate a small delay for "AI" feeling
            await new Promise(resolve => setTimeout(resolve, 800));

            const blocks = PageGeneratorService.generateBlocks(niche, goal);
            onGenerate(blocks);
            onOpenChange(false);
            toast.success("Page structure generated successfully!");
        } catch (error) {
            console.error("Generation failed", error);
            toast.error("Failed to generate page structure.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Your Magic Page</DialogTitle>
                    <DialogDescription>
                        Tell us about your needs, and our AI will build the perfect structure for you.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="niche">What is your niche?</Label>
                        <Select onValueChange={(v) => setNiche(v as PageNiche)}>
                            <SelectTrigger id="niche">
                                <SelectValue placeholder="Select a niche" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fitness">Fitness & Health</SelectItem>
                                <SelectItem value="real_estate">Real Estate</SelectItem>
                                <SelectItem value="marketing">Marketing & Business</SelectItem>
                                <SelectItem value="creative">Creative & Design</SelectItem>
                                <SelectItem value="ecommerce">E-commerce</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="beauty">Beauty & Wellness</SelectItem>
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="goal">What is your main goal?</Label>
                        <Select onValueChange={(v) => setGoal(v as PageGoal)}>
                            <SelectTrigger id="goal">
                                <SelectValue placeholder="Select a goal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="collect_leads">Collect Leads</SelectItem>
                                <SelectItem value="sell_product">Sell a Product</SelectItem>
                                <SelectItem value="schedule_appointment">Schedule Appointments</SelectItem>
                                <SelectItem value="showcase_portfolio">Showcase Portfolio</SelectItem>
                                <SelectItem value="grow_social_media">Grow Social Media</SelectItem>
                                <SelectItem value="newsletter_signup">Newsletter Signup</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleGenerate} disabled={!niche || !goal || isLoading}>
                        {isLoading ? "Generating..." : "Generate Page"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
