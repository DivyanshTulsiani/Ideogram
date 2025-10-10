import React, { memo } from 'react';
import { Handle, Position,type NodeProps,type Node} from '@xyflow/react';

interface CustomNodeData{
  id: string;
  type: 'input' | 'default' | 'output' | 'Custom1' | 'Custom2'
  data: {
    label: string;
    color?: string;
    shape?: string;
  }
  position: {
    x: number;
    y: number;
  };

}

//well this requires to add custom types in typescript we specifically need to change 
//data which is one of the nodeprops predifined in type NodeProps that reactflow gives us 
//beforehand

const Custom1 = ({ data } : NodeProps<CustomNodeData>) => {
  const nodecolor = ""
  return (
    <div className={`bg-${data.color}`}>

    </div>
  );
}

export default memo(Custom1);
