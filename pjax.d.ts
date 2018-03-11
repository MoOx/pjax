export = class Pjax {
  constructor(options?: Partial<IOptions>);

  static switches: {
    [key: string]: Switch
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

  switchesSelectors(selectors: string[], fromEl: Element | Document, toEl: Element | Document, options: IOptions): void;

  latestChance(href: string): void;

  onSwitch: VoidFunction;

  loadContent(html: string, options: IOptions): void;

  abortRequest(request: XMLHttpRequest): void;

  doRequest(location: string, options: IOptions | null,
            callback: (requestText: string, request: XMLHttpRequest, href: string) => void): XMLHttpRequest;

  handleResponse(requestText: string, request: XMLHttpRequest, href: string): void;

  loadUrl(href: string, options?: IOptions): void;

  afterAllSwitches: VoidFunction;
}

export interface StringKeyedObject<T = any> {
  [key: string]: T
}

export interface IOptions {
  elements: string;
  selectors: string[];
  switches: StringKeyedObject<Switch>;
  switchesOptions: StringKeyedObject;
  history: boolean;
  analytics: Function | false;
  scrollTo: number | number[] | false;
  scrollRestoration: boolean;
  cacheBust: boolean;
  debug: boolean;
  timeout: number
  currentUrlFullReload: boolean;
}

export type Switch = (oldEl: Element, newEl: Element, options?: IOptions, switchesOptions?: StringKeyedObject) => void;

export type ElementFunction = (el: Element) => void;
