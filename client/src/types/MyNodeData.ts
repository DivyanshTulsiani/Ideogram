import type { Node } from '@xyflow/react'

export interface MyNodeData extends Record<string,unknown>{
  label: string;
  color?: string;
  shape?: 'rectangle' | 'circle' | string;
}

export type MyNode =  Node<MyNodeData,'input' | 'default' | 'output'>