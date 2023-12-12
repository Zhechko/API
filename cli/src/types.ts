export interface Options {
  depth?: number;
}

export interface Count {
  directories: number;
  files: number;
}

export interface TreeNode {
  name: number;
  items?: TreeNode[];
}