'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) {
      toast.error(ERROR_MESSAGES.COPY_FAILED);
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success(SUCCESS_MESSAGES.COPIED);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(ERROR_MESSAGES.COPY_FAILED);
      return false;
    }
  };

  return { copiedText, copy };
}
