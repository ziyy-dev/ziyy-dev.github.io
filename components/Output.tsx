/** biome-ignore-all lint/a11y/noSvgWithoutTitle: ignored */
/** biome-ignore-all lint/a11y/useButtonType: ignored */

import type { JSX } from 'react';

export default function Output({ children }: { children: JSX.Element }) {
  return (
    <div className="language-bash">
      <div className="rspress-code-title">output</div>
      <div className="rspress-code-content rspress-scrollbar">
        <div>
          <pre className="code" style={{ backgroundColor: 'inherit' }}>
            <code
              className="language-bash"
              style={{ whiteSpace: 'pre', backgroundColor: '#070707' }}
            >
              <span
                style={{
                  display: 'block',
                  padding: '0px 1.25rem',
                }}
              >
                {children}
              </span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
