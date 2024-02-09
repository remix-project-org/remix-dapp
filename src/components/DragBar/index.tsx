// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import './index.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const DragBar = () => {
  const dispatch = useAppDispatch();
  const { hidden, height } = useAppSelector((state) => state.terminal);
  const [dragState, setDragState] = useState<boolean>(false);
  const [dragBarPosY, setDragBarPosY] = useState<number>(0);
  const nodeRef = React.useRef(null); // fix for strictmode

  function stopDrag(e: any, data: any) {
    const h = window.innerHeight - data.y;
    dispatch({ type: 'terminal/save', payload: { height: h, hidden: false } });
    setDragBarPosY(window.innerHeight - h - 5);
    setDragState(false);
  }
  const handleResize = () => {
    setDragBarPosY(window.innerHeight - height - 5);
  };

  useEffect(() => {
    handleResize();
  }, [hidden]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    // TODO: not a good way to wait on the ref doms element to be rendered of course
    setTimeout(() => {
      handleResize();
    }, 2000);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function startDrag() {
    setDragState(true);
  }
  return (
    <>
      <div className={`overlay ${dragState ? '' : 'd-none'}`}></div>
      <Draggable
        nodeRef={nodeRef}
        position={{ x: 0, y: dragBarPosY }}
        onStart={startDrag}
        onStop={stopDrag}
        axis="y"
      >
        <div
          ref={nodeRef}
          className={`dragbar_terminal ${dragState ? 'ondrag' : ''}`}
        ></div>
      </Draggable>
    </>
  );
};

export default DragBar;
