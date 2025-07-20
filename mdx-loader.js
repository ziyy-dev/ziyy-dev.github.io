/** biome-ignore-all lint/suspicious/noControlCharactersInRegex: ignore */

// import { readFileSync, writeFileSync } from "node:fs";
// import { join } from "node:path";
import { style } from "ziyy";

const START_REGEXP = /^```ziyy\s?(?<args>(.+\s?)+)?$/;
const TITLE_REGEXP = /title="(?<title>.*)"/;
const LINE_HIGHLIGHT_REGEXP = /\{.*\}/;

const NO_ANSI_ARG = "no-ansi";
const NO_XTERM_ARG = "no-xterm";
const NO_OUTPUT_ARG = "no-output";

const END_STR = "```";
const ANSI_INSERT = "::ansi::";
const XTERM_INSERT = "::xterm::";

/**
 * @typedef CodeBlock
 * @property {ReturnType<parseArgs>} args
 * @property {number} start
 * @property {number} end
 * @property {number} ansi
 * @property {number} xterm
 * @property {boolean} isOpen
 */

/**
 *
 * @param {string[]} args
 */
function parseArgs(args) {
    let title = "ziyy";
    let lineHighlight = "";
    let noAnsi = false;
    let noXterm = false;

    for (const arg of args) {
        const titleMatch = arg.match(TITLE_REGEXP);
        const lineHighlightMatch = arg.match(LINE_HIGHLIGHT_REGEXP);
        if (titleMatch) {
            // console.log(titleMatch);
            title = titleMatch.groups?.title ? titleMatch.groups.title : title;
        } else if (lineHighlightMatch) {
            lineHighlight = lineHighlightMatch[0]
                ? lineHighlightMatch[0]
                : lineHighlight;
        } else if (arg === NO_ANSI_ARG) {
            noAnsi = true;
        } else if (arg === NO_XTERM_ARG) {
            noXterm = true;
        } else if (arg === NO_OUTPUT_ARG) {
            noAnsi = true;
            noXterm = true;
        }
    }

    return { title, lineHighlight, noAnsi, noXterm };
}

/**
 *
 * @param {string} content
 * @returns
 */
export default function mdxLoader(content) {
    if (/```ziyy/.test(content)) {
        const lines = content.split("\n");
        let xterm = false;

        // /** @type {[number, { title: string | undefined; noAnsi: boolean; noOutput: boolean }][]} */ const starts =
        //     [];
        // /** @type {number[]} */ let ends = [];

        /** @type {CodeBlock[]} */
        const codeBlocks = [];

        /** @type {CodeBlock | undefined} */
        let codeBlock;

        for (const line of lines.entries()) {
            const match = line[1].match(START_REGEXP);
            if (match) {
                const args = parseArgs(
                    match.groups?.args ? match.groups.args.split(" ") : [],
                );
                codeBlock = {
                    args,
                    start: line[0],
                    end: -1,
                    ansi: -1,
                    xterm: -1,
                    isOpen: true,
                };
            } else if (line[1] === END_STR && codeBlock?.isOpen) {
                codeBlock.end = line[0];
                codeBlocks.push(codeBlock);
                codeBlock = undefined;
            } else if (line[1] === ANSI_INSERT) {
                const c = codeBlocks.at(-1);
                if (c) c.ansi = line[0];
            } else if (line[1] === XTERM_INSERT) {
                const c = codeBlocks.at(-1);
                if (c) c.xterm = line[0];
            }
        }

        // console.log(codeBlocks);

        for (const codeBlock of codeBlocks) {
            lines[codeBlock.start] =
                `${END_STR}html title="${codeBlock.args.title}" ${codeBlock.args.lineHighlight}`;

            if (codeBlock.end > 0) {
                const source = lines
                    .slice(codeBlock.start + 1, codeBlock.end)
                    .join("\n");
                const styled = style(source);
                lines[codeBlock.end] = `${END_STR}\n`;

                if (!codeBlock.args.noAnsi) {
                    const ansiStr = `\n${END_STR}text title="ansi"\n${styled.replace(/\x1b/g, "\\x1b")}\n${END_STR}\n`;
                    if (codeBlock.ansi > 0) {
                        lines[codeBlock.ansi] = ansiStr;
                    } else {
                        lines[codeBlock.end] += ansiStr;
                    }
                }

                if (!codeBlock.args.noXterm) {
                    xterm = true;
                    const xtermStr = `\n<Output data={${JSON.stringify(styled)}} source={${JSON.stringify(source)}} />`;
                    if (codeBlock.xterm > 0) {
                        lines[codeBlock.xterm] = xtermStr;
                    } else if (codeBlock.ansi > 0) {
                        lines[codeBlock.ansi] += xtermStr;
                    } else {
                        lines[codeBlock.end] += xtermStr;
                    }
                }
            }
        }

        if (xterm)
            lines.unshift('import { Output } from "@/components/Output";\n');

        const s = lines.join("\n");
        // console.log(s);
        return s;
    }
    return content;
}

// const output = ziyyLoader(
//     readFileSync(
//         join(import.meta.dirname, "docs", "guide", "start", "introduction.mdx"),
//         "utf-8",
//     ),
// );

// writeFileSync(join(import.meta.dirname, "output.mdx"), output);
