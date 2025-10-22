import { useReactFlow, type XYPosition } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { type OnDropAction, useDnD, useDnDPosition } from '../hooks/useDnd';
import { memo } from 'react';

// This is a simple ID generator for the nodes.
// You can customize this to use your own ID generation logic.
let id = 0;
const getId = () => `dndnode_${id++}`;

function Sidebar() {
  const { onDragStart, isDragging } = useDnD();
  // The type of the node that is being dragged.
  const [type, setType] = useState<string | null>(null);

  const { setNodes } = useReactFlow();

  const createAddNewNode = useCallback(
    (nodeType: string, label: string, shape: string): OnDropAction => {
      return ({ position }: { position: XYPosition }) => {
        // Here, we create a new node and add it to the flow.
        // You can customize the behavior of what happens when a node is dropped on the flow here.
        const newNode = {
          id: getId(),
          type: nodeType,
          position,
          data: { label: `${label}`, shape: `${shape}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setType(null);
      };
    },
    [setNodes, setType],
  );

  return (
    <>
      {/* The ghost node will be rendered at pointer position when dragging. */}
      {isDragging && <DragGhost type={type} />}
      <aside className='shadow-sm'> 

        <section>

          <div
            className="dndnode input"
            onPointerDown={(event) => {
              setType('edit');
              onDragStart(event, createAddNewNode('edit', 'hehhhllo', 'rectangle'));
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square"><rect width="18" height="18" x="3" y="3" rx="2"></rect></svg>
          </div>
          <div
            className="dndnode"
            onPointerDown={(event) => {
              setType('edit');
              onDragStart(event, createAddNewNode('edit', 'hello', 'diamond'));
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-diamond"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"></path></svg>

          </div>
          <div
            className="dndnode output"
            onPointerDown={(event) => {
              setType('edit');
              onDragStart(event, createAddNewNode('edit', 'hello', 'oval'));
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle"><circle cx="12" cy="12" r="10"></circle></svg>
          </div>
        </section>

        <section className='border-t-1 border-black'>
          <div className='mt-3 flex justify-center items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
          </div>
        </section>

      </aside>

    </>
  );
}

interface DragGhostProps {
  type: string | null;
}

// The DragGhost component is used to display a ghost node when dragging a node into the flow.
export function DragGhost({ type }: DragGhostProps) {
  const { position } = useDnDPosition();
  // console.log('DragGhost position:', position);

  if (!position) return null;

  return (
    <div
      className={`dndnode ghostnode ${type}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`
      }}
    >
      {type && `${type.charAt(0).toUpperCase() + type.slice(1)} Node`}
    </div>
  );
}


export default memo(Sidebar)