/**
 * Simple AI Chat, Use it to understand how AI chat works.
 * This is a **Dummy homepage**. Make sure to rewrite it for your application. You may use the components and styles.
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';


export function DemoPage() { // Don't touch this exporting, Its a named export
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>()


  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const start = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/supadata/transcript', {
        body: JSON.stringify({
          url: input
        }),
        method: 'POST'
      });
      const res = await response.json();
      setResult(JSON.stringify(res.data))
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: 'Failed to clear all sessions' };
    }
  };

  return (
    <AppLayout>
      <main className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4 overflow-hidden">
        <Button
          onClick={() => setIsDark(!isDark)}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-2xl hover:scale-110 hover:rotate-12 transition-all duration-200 active:scale-90 z-50"
        >
          {isDark ? '☀️' : '🌙'}
        </Button>

        <div className="absolute inset-0 bg-gradient-rainbow opacity-10 dark:opacity-20" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-6 relative z-10 mb-8"
        >
          <div className="flex justify-center">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary"
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-balance leading-tight">
            Creating your <span className="text-gradient">app</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto text-pretty">
            We are building your app, powered by Supadata SDK
          </p>
        </motion.div>

        <Card className="max-w-4xl mx-auto h-[60vh] flex flex-col relative z-10 backdrop-blur-xl bg-white/10 dark:bg-black/20 border-white/20 shadow-2xl">
          <div className="p-4 border-b flex items-center gap-4">
            <motion.div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </motion.div>
            <h2 className="font-display font-bold text-xl">
              Youtube Video Transcript
            </h2>
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Youtube URL" />
            <Button onClick={start} variant="outline" size="sm" disabled={isLoading}>
              Run
            </Button>
            {
              result && (
                <Textarea
                  value={result}
                  disabled
                  className="text-sm h-48 mt-6"
                />
              )
            }
          </div>
        </Card>
      </main>
    </AppLayout>
  );
}