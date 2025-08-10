import { motion } from 'framer-motion';
import { Check, X, ScanLine } from 'lucide-react';
import type { ClassificationResult } from '../lib/classifier';

interface Props {
  result: ClassificationResult;
}

export function ClassificationResult({ result }: Props) {
  const parseRecommendations = (text: string | string[]) => {
    if (Array.isArray(text)) {
      return text;
    }
    
    // Split by bullet points or numbered lists
    const lines = text.split(/[\n\r]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    const recommendations = [];
    
    for (const line of lines) {
      // Skip heading lines that contain "recommendation" or similar
      if (line.toLowerCase().includes('recommendation') || 
          line.toLowerCase().includes('disposal') ||
          line.toLowerCase().includes('recycling guide') ||
          line.match(/^#+\s/)) {
        continue;
      }
      
      // Clean up bullet points and numbers
      const cleaned = line
        .replace(/^[-*•]\s*/, '')  // Remove bullet points
        .replace(/^\d+\.\s*/, '')  // Remove numbers
        .replace(/^[a-z]\)\s*/i, '') // Remove letter lists
        .trim();
      
      if (cleaned.length > 10) { // Only add substantial recommendations
        recommendations.push(cleaned);
      }
    }
    
    return recommendations.length > 0 ? recommendations : [text];
  };

  const parseFormattedText = (text: string) => {
    // Professional text parsing similar to FAANG company implementations
    const parts: Array<{ text: string; type: string }> = [];
    
    // Enhanced regex to handle various markdown patterns
    const patterns = [
      { regex: /\*\*(.*?)\*\*/g, type: 'bold' },
      { regex: /\*(.*?)\*/g, type: 'italic' },
      { regex: /`(.*?)`/g, type: 'code' },
      { regex: /__(.*?)__/g, type: 'underline' }
    ];
    
    // Find all matches for all patterns
    const allMatches: Array<{
      start: number;
      end: number;
      content: string;
      type: string;
      fullMatch: string;
    }> = [];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.regex.exec(text)) !== null) {
        allMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[1],
          type: pattern.type,
          fullMatch: match[0]
        });
      }
    });
    
    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start);
    
    // Process non-overlapping matches
    const processedMatches: Array<{
      start: number;
      end: number;
      content: string;
      type: string;
      fullMatch: string;
    }> = [];
    
    allMatches.forEach(match => {
      const overlaps = processedMatches.some(processed => 
        (match.start >= processed.start && match.start < processed.end) ||
        (match.end > processed.start && match.end <= processed.end)
      );
      if (!overlaps) {
        processedMatches.push(match);
      }
    });
    
    // Build the parts array
    let lastIndex = 0;
    processedMatches.forEach(match => {
      // Add text before the match
      if (match.start > lastIndex) {
        const textBefore = text.slice(lastIndex, match.start);
        if (textBefore.trim()) {
          parts.push({ text: textBefore, type: 'text' });
        }
      }
      
      // Add the formatted match
      parts.push({ text: match.content, type: match.type });
      lastIndex = match.end;
    });
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      if (remainingText.trim()) {
        parts.push({ text: remainingText, type: 'text' });
      }
    }
    
    // If no matches found, return the original text
    return parts.length > 0 ? parts : [{ text, type: 'text' }];
  };

  const renderFormattedText = (parts: Array<{ text: string; type: string }>) => {
    return parts.map((part, index) => {
      switch (part.type) {
        case 'bold':
          return (
            <strong key={index} className="font-semibold text-orange-300">
              {part.text}
            </strong>
          );
        case 'italic':
          return (
            <em key={index} className="italic text-blue-300">
              {part.text}
            </em>
          );
        case 'code':
          return (
            <code key={index} className="bg-gray-800 text-green-300 px-1 py-0.5 rounded text-sm font-mono">
              {part.text}
            </code>
          );
        case 'underline':
          return (
            <span key={index} className="underline text-purple-300">
              {part.text}
            </span>
          );
        default:
          return <span key={index}>{part.text}</span>;
      }
    });
  };

  const parsedRecommendations = parseRecommendations(result.recommendations);
  const materialTextParts = parseFormattedText(result.material);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar relative"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 relative mb-4">
          <div className="absolute inset-0 bg-green-400/30 rounded-full blur-xl animate-pulse" />
          <div className="relative w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25">
            <ScanLine className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-2">
          Classification Result
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-900/20 via-black/20 to-emerald-900/20 backdrop-blur-sm rounded-xl p-4 border border-green-400/20 shadow-lg">
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm text-green-300 uppercase tracking-wide font-medium">Material Type:</span>
              <div className="bg-gradient-to-r from-green-950/40 to-emerald-950/40 rounded-lg p-4 border border-green-400/15 backdrop-blur-sm">
                <div className="text-white text-base leading-relaxed text-justify hyphens-auto break-words space-y-2">
                  <div className="font-light leading-7 tracking-wide">
                    {renderFormattedText(materialTextParts)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg border border-green-400/20 backdrop-blur-sm">
                <span className="text-xs text-green-300 uppercase tracking-wide block mb-1 font-medium">Confidence</span>
                <span className="font-bold text-white text-lg">
                  {(result.confidence * 100).toFixed(1)}%
                </span>
              </div>
              
              <div className="text-center p-3 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg border border-green-400/20 backdrop-blur-sm">
                <span className="text-xs text-green-300 uppercase tracking-wide block mb-1 font-medium">Recyclable</span>
                <div className="flex items-center justify-center mt-1">
                  {result.recyclable ? (
                    <>
                      <Check className="w-5 h-5 text-green-400 mr-1" />
                      <span className="text-green-400 font-semibold text-sm">Yes</span>
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 text-red-400 mr-1" />
                      <span className="text-red-400 font-semibold text-sm">No</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent mb-3 text-center">
            Recycling Recommendations
          </h3>
          <div className="space-y-2">
            {parsedRecommendations.map((rec, index) => {
              const formattedRec = parseFormattedText(rec);
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-green-950/30 to-emerald-950/30 backdrop-blur-sm rounded-lg p-4 border border-green-400/15"
                >
                  <Check className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div className="text-gray-200 text-sm leading-relaxed text-justify hyphens-auto flex-1 font-light tracking-wide">
                    {renderFormattedText(formattedRec)}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}