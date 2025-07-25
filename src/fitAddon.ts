/**
 * Copyright (c) 2017 The xterm.js authors. All rights reserved.
 * @license MIT
 */

import type { FitAddon as IFitApi } from "@xterm/addon-fit";
import type { ITerminalAddon, Terminal } from "@xterm/xterm";

// import { IRenderDimensions } from "browser/renderer/shared/Types";

interface ITerminalDimensions {
    /**
     * The number of rows in the terminal.
     */
    rows: number;

    /**
     * The number of columns in the terminal.
     */
    cols: number;
}

const MINIMUM_COLS = 2;
const MINIMUM_ROWS = 1;

export class FitAddon implements ITerminalAddon, IFitApi {
    private _terminal: Terminal | undefined;

    public activate(terminal: Terminal): void {
        this._terminal = terminal;
    }

    public dispose(): void {}

    public fit(): void {
        const dims = this.proposeDimensions();
        if (!dims || !this._terminal || isNaN(dims.cols) || isNaN(dims.rows)) {
            return;
        }

        // TODO: Remove reliance on private API
        const core = (this._terminal as any)._core;

        // Force a full render
        if (
            this._terminal.rows !== dims.rows ||
            this._terminal.cols !== dims.cols
        ) {
            core._renderService.clear();
            this._terminal.resize(dims.cols, dims.rows);
        }
    }

    public proposeDimensions(): ITerminalDimensions | undefined {
        if (!this._terminal) {
            return undefined;
        }

        if (!this._terminal.element || !this._terminal.element.parentElement) {
            return undefined;
        }

        // TODO: Remove reliance on private API
        const core = (this._terminal as any)._core;
        const dims: any = core._renderService.dimensions;

        if (dims.css.cell.width === 0 || dims.css.cell.height === 0) {
            return undefined;
        }

        const scrollbarWidth =
            this._terminal.options.scrollback === 0
                ? 0
                : core.viewport.scrollBarWidth;

        const parentElementStyle = window.getComputedStyle(
            this._terminal.element.parentElement,
        );
        const parentElementHeight = Number.parseInt(
            parentElementStyle.getPropertyValue("height"),
        );
        const parentElementWidth = Math.max(
            0,
            Number.parseInt(parentElementStyle.getPropertyValue("width")),
        );
        const parentElementPadding = {
            top: Number.parseInt(
                parentElementStyle.getPropertyValue("padding-top"),
            ),
            bottom: Number.parseInt(
                parentElementStyle.getPropertyValue("padding-bottom"),
            ),
            right: Number.parseInt(
                parentElementStyle.getPropertyValue("padding-right"),
            ),
            left: Number.parseInt(
                parentElementStyle.getPropertyValue("padding-left"),
            ),
        };
        const parentElementPaddingVer =
            parentElementPadding.top + parentElementPadding.bottom;
        const parentElementPaddingHor =
            /* parentElementPadding.right + */ parentElementPadding.left;
        const elementStyle = window.getComputedStyle(this._terminal.element);
        const elementPadding = {
            top: Number.parseInt(elementStyle.getPropertyValue("padding-top")),
            bottom: Number.parseInt(
                elementStyle.getPropertyValue("padding-bottom"),
            ),
            right: Number.parseInt(
                elementStyle.getPropertyValue("padding-right"),
            ),
            left: Number.parseInt(
                elementStyle.getPropertyValue("padding-left"),
            ),
        };
        const elementPaddingVer = elementPadding.top + elementPadding.bottom;
        const elementPaddingHor = elementPadding.right + elementPadding.left;
        const availableHeight =
            parentElementHeight - parentElementPaddingVer - elementPaddingVer;
        const availableWidth =
            parentElementWidth -
            parentElementPaddingHor -
            elementPaddingHor -
            scrollbarWidth;
        const geometry = {
            cols: Math.max(
                MINIMUM_COLS,
                Math.floor(availableWidth / dims.css.cell.width),
            ),
            rows: Math.max(
                MINIMUM_ROWS,
                Math.floor(availableHeight / dims.css.cell.height),
            ),
        };
        return geometry;
    }
}
