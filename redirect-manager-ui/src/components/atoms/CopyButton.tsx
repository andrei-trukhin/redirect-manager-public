import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import IconButton from './IconButton';

export interface CopyButtonProps {
  value: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <IconButton
      icon={copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={className}
    />
  );
};

export default CopyButton;


