import { Handle, Position,type NodeProps} from '@xyflow/react';
import { useState, type ChangeEvent } from 'react';
import { type MyNode } from '../types/MyNodeData';
import { useCallback } from 'react';
// import { NodeResizerProps } from '@xyflow/react';



const StyledNode = (props: NodeProps<MyNode>) =>{
  const {data, isConnectable, selected} = props;

  const {label, color, shape } = data

  // const [NewLabel,SetNewLabel] = useState<string | undefined>(label)

  let shapeClass = '';
  if (shape === 'circle') {
    shapeClass = 'rounded-full';
  } else if (shape === 'diamond') {
    shapeClass = 'clip-diamond';
  } else {
    shapeClass = 'rounded-md';
  }

  // const onChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
  //   SetNewLabel(e.target.value)
  //   console.log(e.target.value);
  // }, []);
  
  console.log('Rendering StyledNode with data:', data);
  return(
    <div className={`${shapeClass} w-full h-full p-2 border ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: color }}>
      
      <div>
        {label}
        {/* <label htmlFor="text">Text:</label> */}
        {/* <input id="text" name="text" onChange={onChange} className="nodrag bg-transparent outline-none text-center" value={NewLabel}/> */}
        </div>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  )

}

export const StyledNodeEdit = (props: NodeProps<MyNode>) =>{
  const {data, isConnectable, selected} = props;

  const {label, color, shape } = data

  const [NewLabel,SetNewLabel] = useState<string | undefined>(label)

  let shapeClass = '';
  if (shape === 'circle') {
    shapeClass = 'rounded-full';
  } else if (shape === 'diamond') {
    shapeClass = 'clip-diamond';
  } else if(shape === 'oval') {
    shapeClass = 'clip-oval';
  }
  else{
    shapeClass= 'rounded-md border-2'
  }

  const onChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
    SetNewLabel(e.target.value)
    console.log(e.target.value);
  }, []);
  
  console.log('Rendering StyledNode with data:', data);
  return(
    
    <div className={`${shapeClass}-wrapper`}>
    <div className={`${shapeClass} h-full w-full p-2  ${selected ? 'ring-2 ring-blue-500' : ''}`} style={{ backgroundColor: color,display: 'flex',justifyContent:'center',alignItems:'center' }}>


      <div>
        {/* <label htmlFor="text">Text:</label> */}
        <input id="text" name="text" onChange={onChange} className="nodrag bg-transparent outline-none text-center" value={NewLabel}/>
      </div>


      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
    </div>
  )

}


export default StyledNode

