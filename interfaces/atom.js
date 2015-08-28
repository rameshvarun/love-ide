declare module 'atom' {
  declare class Point extends atom$Point {}
  declare class Range extends atom$Range {}
};

type PointObject = atom$Point | [number, number];
type RangeObject = atom$Range | [PointObject, PointObject];

declare class atom$TextEditor {
  getTextInBufferRange(range: atom$Range): string;
};

declare class atom$Range {
  constructor(pointA: PointObject, pointB: PointObject): atom$Range;
};

declare class atom$Point {
  row: number;
  column: number;
};

declare class atom$Package {
  mainModule: any;
}

declare class atom$PackageManager {
  activatePackage(name: string): Promise<atom$Package>;
  getActivePackage(name: string): ?atom$Package;
};

declare class atom$AtomGlobal {
  packages: atom$PackageManager;
};

declare var atom: atom$AtomGlobal;
