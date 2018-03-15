declare class Pjax {
  constructor(options?: Partial<Pjax.IOptions>);

  static switches: {
    [key in DefaultSwitches]: Pjax.Switch
  };

  static isSupported: () => boolean;

  log: VoidFunction;

  getElements(el: Element | Document): NodeListOf<Element>;

  parseDOM(el: Element | Document): void;

  refresh: ElementFunction;

  reload: VoidFunction;

  attachLink(el: HTMLAnchorElement): void;

  attachForm(el: HTMLFormElement): void;

  forEachSelectors(cb: ElementFunction, context: Pjax, DOMcontext?: Element | Document): void;

  switchesSelectors(selectors: string[], fromEl: Element | Document, toEl: Element | Document, options: Pjax.IOptions): void;

  latestChance(href: string): void;

  onSwitch: VoidFunction;

  loadContent(html: string, options: Pjax.IOptions): void;

  abortRequest(request: XMLHttpRequest): void;

  doRequest(location: string, options: Pjax.IOptions | null,
            callback: (requestText: string, request: XMLHttpRequest, href: string) => void): XMLHttpRequest;

  handleResponse(requestText: string, request: XMLHttpRequest, href: string): void;

  loadUrl(href: string, options?: Pjax.IOptions): void;

  afterAllSwitches: VoidFunction;

  // Allows reassignment of existing prototype functions to be able to do something before calling the original function
  [key: string]: Function;
}

declare namespace Pjax {
  export interface IOptions {
    elements: string;
    selectors: string[];
    switches: StringKeyedObject<Switch>;
    switchesOptions: StringKeyedObject;
    history: boolean;
    analytics: Function | false;
    scrollTo: number | [number, number] | false;
    scrollRestoration: boolean;
    cacheBust: boolean;
    debug: boolean;
    timeout: number;
    currentUrlFullReload: boolean;
  }

  export type Switch = (oldEl: Element, newEl: Element, options?: IOptions, switchesOptions?: StringKeyedObject) => void;
}

interface StringKeyedObject<T = any> {
  [key: string]: T
}

type ElementFunction = (el: Element) => void;

declare enum DefaultSwitches {
  innerHTML = "innerHTML",
  ouetrHTML = "outerHTML",
  sideBySide = "sideBySide"
}

export = Pjax;
