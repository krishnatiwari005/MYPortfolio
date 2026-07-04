'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import Input from '../ui/input';
import Badge from '../ui/badge';

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput = ({ tags, onChange, placeholder = 'Add item...' }: TagInputProps) => {
  const [inputVal, setInputVal] = useState('');

  const addTag = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputVal('');
  };

  const removeTag = (indexToRemove: number) => {
    onChange(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2">
        <Input
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => addTag(inputVal)}
          className="p-2.5 bg-accent-light text-accent-primary rounded-xl hover:bg-accent-primary/10 transition-colors border border-accent-primary/20 shrink-0 cursor-pointer"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-3 bg-bg-primary rounded-xl border border-border-default max-h-[150px] overflow-y-auto">
          {tags.map((tag, idx) => (
            <Badge key={idx} variant="accent" className="flex items-center gap-1 py-1 pr-1.5">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(idx)}
                className="hover:bg-accent-primary/20 rounded-full p-0.5 transition-colors cursor-pointer text-accent-primary"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagInput;
