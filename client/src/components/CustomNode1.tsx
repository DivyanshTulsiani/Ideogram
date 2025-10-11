import { Handle, Position,type NodeProps} from '@xyflow/react';
import { type MyNode } from '../types/MyNodeData';



const StyledNode = (props: NodeProps<MyNode>) =>{
  const {data, isConnectable, selected} = props;

  const {label, color, shape } = data

  let shapeClass = '';
  if (shape === 'circle') {
    shapeClass = 'rounded-full';
  } else if (shape === 'diamond') {
    shapeClass = 'clip-diamond';
  } else {
    shapeClass = 'rounded-md';
  }
  
  console.log('Rendering StyledNode with data:', data);
  return(
    <div className={`${shapeClass} w-full h-full p-2 border ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: color }}>
      
      <div>{label}</div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )

}

export default StyledNode

