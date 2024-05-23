import React from 'react';

export interface TreeViewProps {
  children?: React.ReactNode;
  id?: string;
}

export const TreeView = (props: TreeViewProps) => {
  const { children, id, ...otherProps } = props;

  return (
    <ul
      data-id={`treeViewUl${id}`}
      className="list-unstyled ml-0 pl-1"
      {...otherProps}
    >
      {children}
    </ul>
  );
};

export default TreeView;
export * from './item';
