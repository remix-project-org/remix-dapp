import React, { useState, useEffect } from 'react'; // eslint-disable-line

export interface TreeViewItemProps {
  children?: React.ReactNode;
  id?: string;
  label: string | number | React.ReactNode;
  expand: boolean;
  onClick?: (...args: any) => void;
  onInput?: (...args: any) => void;
  onMouseOver?: (...args: any) => void;
  onMouseOut?: (...args: any) => void;
  className?: string;
  iconX?: string;
  iconY?: string;
  icon?: string;
  labelClass?: string;
  controlBehaviour?: boolean;
  innerRef?: any;
  onContextMenu?: (...args: any) => void;
  onBlur?: (...args: any) => void;
  showIcon?: boolean;
}

export const TreeViewItem = (props: TreeViewItemProps) => {
  const {
    id,
    children,
    label,
    labelClass,
    expand,
    iconX = 'fas fa-caret-right',
    iconY = '',
    icon,
    controlBehaviour = false,
    innerRef,
    showIcon = true,
    ...otherProps
  } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setIsExpanded(expand);
  }, [expand]);

  return (
    <li
      ref={innerRef}
      key={`treeViewLi${id}`}
      data-id={`treeViewLi${id}`}
      className="list-unstyled"
      {...otherProps}
    >
      <div
        key={`treeViewDiv${id}`}
        data-id={`treeViewDiv${id}`}
        className={`d-flex flex-row align-items-center ${labelClass}`}
        onClick={() => {
          !controlBehaviour && setIsExpanded(!isExpanded);
        }}
      >
        {children && showIcon ? (
          <div
            className={
              isExpanded ? `pl-2 ${iconY}` : `pl-2 ${iconX} caret flex-shrink-0`
            }
            style={{ visibility: children ? 'visible' : 'hidden' }}
          ></div>
        ) : icon ? (
          <div className={`pr-2 pl-2 ${icon} caret flex-shrink-0`}></div>
        ) : null}
        <span className="w-100 ml-1 pl-2">{label}</span>
      </div>
      {isExpanded ? children : null}
    </li>
  );
};

export default TreeViewItem;
