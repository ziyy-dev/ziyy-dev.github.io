/** biome-ignore-all lint/a11y/noSvgWithoutTitle: ignored */
/** biome-ignore-all lint/a11y/useButtonType: ignored */

import { Terminal } from "./Terminal";

let id = 0;

export function Output({ data, source }: { data: string; source: string }) {
    return (
        // <div className="language-bash">
        //     <div className="rspress-code-title">xterm.js</div>
        //     {/* <div className="rspress-code-content rspress-scrollbar"> */}

        //     {/* </div> */}
        // </div>

        <Terminal id={`example-${id++}`} data={data} source={source} />
    );
}
