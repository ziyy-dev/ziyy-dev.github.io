/** biome-ignore-all lint/suspicious/noControlCharactersInRegex: ignore */
import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import { FitAddon } from "../fitAddon";
import "@xterm/xterm/css/xterm.css";

interface TerminalOptions {
    id: string;
    data: string;
    source: string;
}

// const instances: Record<string, boolean> = {};

// TODO: recalculate rows on terminal resize
export function Terminal({ id, data, source }: TerminalOptions) {
    const ref = useRef(null);
    data = `$ ziyy -c "${source}" \n\n${data}\n\n$ `;
    const rows = data.split("\n").length + 5;
    const term = new XTerminal({
        disableStdin: true,
        cursorBlink: false,
        cursorStyle: "block",
        rows,
        convertEol: true,
        lineHeight: CSS.rem(1.25).value,
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    // document.addEventListener("resize", async () => {
    //     console.log("resized");
    //     fitAddon.fit();
    // });

    useEffect(() => {
        const instance = document.querySelector(`#${id} > .xterm`);
        // console.log(instance);
        if (!instance) {
            term.open(ref.current as unknown as HTMLElement);
            term.write(data);
        } else {
            term.clear();
            term.write(data);
        }
        console.log(fitAddon.proposeDimensions());
        fitAddon.fit();
    }, []);

    return (
        <div
            id={id}
            className="example-output"
            ref={ref}
            // style={{ position: "absolute" }}
        />
    );
}
