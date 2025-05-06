"use client";
import { Button } from '@/components/ui/button';
import { Card} from '@/components/ui/card';
import { CheckboxGroup } from './checkbox-group';
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { PROGRAMMING_LANGUAGES } from '@/lib/utils';


export default function Matchmaking() {
	const [categories, setCategories] = useState<string[]>([]);

	useEffect(() => {
    fetch('http://127.0.0.1:8000/api/problem/tags')
      .then(res => res.json())
      .then(data => setCategories((data.tags ?? []).sort((a: string, b: string) => a.localeCompare(b))))
      .catch(() => setCategories([]));
	}, [])

	console.log(categories);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Matchmaking - Select Preferences</h2>

      <Card className="w-full max-w-4xl p-6 bg-card rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Programming Languages Card */}
					<CheckboxGroup title="Programming Languages" options={PROGRAMMING_LANGUAGES} idPrefix="programming-language" />
          {/* Categories Card */}
					<CheckboxGroup title="Categories" options={categories} idPrefix="category" />
        </div>
        {/* Inline checkbox and button */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox />
            <span>Allow Uncategorized Problems?</span>
          </label>
          <Button className="self-center">Begin</Button>
        </div>
      </Card>
    </div>
  );
}

