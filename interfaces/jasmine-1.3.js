// FlowType declarations for Jasmine 1.3 (bundled with Atom).

declare function beforeEach(action: () => void): void;
declare function afterEach(action: () => void): void;

declare function xit(expectation: string, assertion: () => void): void;
declare function it(expectation: string, assertion: () => void): void;

declare function describe(expectation: string, spec: () => void): void;
declare function xdescribe(expectation: string, spec: () => void): void;

declare function runs(asyncMethod: Function): void;
