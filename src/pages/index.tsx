import Head from 'next/head';
import React from 'react';
import config from '../../config.json';
import { Input } from '../components/input';
import { useHistory } from '../components/history/hook';
import { History } from '../components/history/History';
import { banner, sumfetch } from '../utils/bin';


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
        <meta
          name="description"
          content="Sanjeev Sekar — Engineering Manager at AWS Labs focused on Growth & AI. Personal terminal-style site with resume, projects, and blog."
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sankumsek.bio" />
        <meta property="og:title" content="Sanjeev Sekar | Engineering Manager, AWS Labs" />
        <meta
          property="og:description"
          content="Engineering Manager at AWS Labs focused on Growth & AI. Explore my resume, projects, and blog."
        />
        <meta property="og:image" content="https://sankumsek.bio/apple-icon-180x180.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sanjeev Sekar | Engineering Manager, AWS Labs" />
        <meta
          name="twitter:description"
          content="Engineering Manager at AWS Labs focused on Growth & AI. Explore my resume, projects, and blog."
        />
        <meta name="twitter:image" content="https://sankumsek.bio/apple-icon-180x180.png" />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Sanjeev Sekar',
              url: 'https://sankumsek.bio',
              email: config.email,
              jobTitle: 'Engineering Manager',
              worksFor: {
                '@type': 'Organization',
                name: 'AWS Labs',
              },
              sameAs: [
                `https://github.com/${config.social.github}`,
                `https://www.linkedin.com/in/${config.social.linkedin}`,
              ],
            }),
          }}
        />
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
        </div>
      </div>
    </>
  );
};

export default IndexPage;
