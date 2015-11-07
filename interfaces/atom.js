declare module 'atom' {
  declare class Point extends atom$Point {}
  declare class Range extends atom$Range {}
};

declare module 'shell' {
  declare function openExternal(url: string): void;
};

type PointObject = atom$Point | [number, number];
type RangeObject = atom$Range | [PointObject, PointObject];

declare class atom$TextEditor {
  getTextInBufferRange(range: atom$Range): string;
  getTitle(): string;
};

declare class atom$Range {
  constructor(pointA: PointObject, pointB: PointObject): atom$Range;
  start: atom$Point;
  end: atom$Point;
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
  getApmPath(): string;
  getAvailablePackageMetadata(): Array<atom$PackageMetadata>;
};

declare class atom$PackageMetadata {
  name: string;
  version: string;
}

declare class atom$NotificationManager {
  addFatalError(message: string, options: { detail?: string }): void;
  addSuccess(message: string, options: { detail?: string }): void;
}

declare class atom$ConfigManager {
  getPaths(): Array<string>;
  get(name: string): any;
}

declare class atom$Project {
  getPaths(): Array<string>;
}

declare class atom$AtomGlobal {
  packages: atom$PackageManager;
  notifications: atom$NotificationManager;
  config: atom$ConfigManager;
  project: atom$Project;
};

declare var atom: atom$AtomGlobal;
