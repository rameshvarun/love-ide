declare function ToolBar(name: string) : ToolBarSection;

declare class ToolBarSection {
  addButton(options: {
    icon: string,
    callback: string | () => void,
    tooltip?: string,
    iconset?: string,
    data?: string,
    priority?: number
  }): void;
};
