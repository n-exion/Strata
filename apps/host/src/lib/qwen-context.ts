/** Flash-Next's extended contexts. 1M uses Strata's binary unit (1,048,576 tokens). */
export const QWEN_CONTEXT_CHOICES = [8192, 32768, 65536, 131072, 204800, 262144, 393216, 524288, 1048576];
export const QWEN_CONTEXT_NOTE = 'Experimental context extension. Uses more memory and may make answers less reliable.';

export function qwenContexts(contexts: number[] = QWEN_CONTEXT_CHOICES, family?: string): number[] {
  // Qwen3.6 uses a separate engine path without YaRN. Do not add the new 1M choice to it.
  return family === 'qwen36' ? contexts.filter(n => n <= 524288) : contexts;
}
