import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner, sumfetch } from '../utils/bin';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next";


interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const containerRef = React.useRef(null);
  const {
    history,
    command,
    lastCommandIndex,
    setCommand,
    setHistory,
    clearHistory,
    setLastCommandIndex,
  } = useHistory([]);

  const [isAutoTyping, setIsAutoTyping] = React.useState(false);
  const [hasAutoTyped, setHasAutoTyped] = React.useState(false);

  const init = React.useCallback(() => setHistory(banner()), []);

  React.useEffect(() => {
    init();
  }, [init]);

  // Auto-type sumfetch after banner displays
  React.useEffect(() => {
    if (history.length === 1 && !hasAutoTyped) {
      const autoTypeCommand = 'sumfetch';
      let currentIndex = 0;

      // Wait before starting to type
      const startDelay = setTimeout(() => {
        setIsAutoTyping(true);

        // Type each character
        const typeInterval = setInterval(() => {
          if (currentIndex < autoTypeCommand.length) {
            setCommand(autoTypeCommand.slice(0, currentIndex + 1));
            currentIndex++;
          } else {
            clearInterval(typeInterval);

            // Execute the command after a brief pause
            setTimeout(async () => {
              const output = await sumfetch([]);
              setHistory(output, 'sumfetch');
              setCommand('');
              setIsAutoTyping(false);
              setHasAutoTyped(true);
            }, 200);
          }
        }, 80);
      }, 800);

      return () => clearTimeout(startDelay);
    }
  }, [history, hasAutoTyped, setCommand, setHistory]);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.scrollIntoView();
      inputRef.current.focus({ preventScroll: true });
    }
  }, [history]);

  return (
    <>
      <Head>
        <title>{config.title}</title>
      </Head>

      <div className="p-8 overflow-hidden h-full border-2 rounded border-light-yellow dark:border-dark-yellow">
        <div ref={containerRef} className="overflow-y-auto h-full">
          <History history={history} />

          <Input
            inputRef={inputRef}
            containerRef={containerRef}
            command={command}
            history={history}
            lastCommandIndex={lastCommandIndex}
            setCommand={setCommand}
            setHistory={setHistory}
            setLastCommandIndex={setLastCommandIndex}
            clearHistory={clearHistory}
            disabled={isAutoTyping}
          />
          < Analytics />
          < SpeedInsights />
        </div>
      </div>
    </>
  );
};

export default IndexPage;
