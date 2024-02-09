import React from 'react';
import './index.css';

export interface TreeViewProps {
  children?: React.ReactNode;
  id?: string;
}

export const TreeView = (props: TreeViewProps) => {
  const { children, id, ...otherProps } = props;

  return (
    <ul data-id={`treeViewUl${id}`} className="ul_tv ml-0 pl-1" {...otherProps}>
      {children}
    </ul>
  );
};

export default TreeView;
export * from './item';
