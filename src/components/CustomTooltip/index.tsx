import React, { Fragment } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import {
  type OverlayDelay,
  type OverlayTriggerRenderProps,
} from 'react-bootstrap/esm/OverlayTrigger';
import { type Placement } from 'react-bootstrap/esm/types';

export interface CustomTooltipType {
  children:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | ((props: OverlayTriggerRenderProps) => React.ReactNode);
  placement?: Placement;
  tooltipId?: string;
  tooltipClasses?: string;
  tooltipText: string | JSX.Element;
  tooltipTextClasses?: string;
  delay?: OverlayDelay;
  hide?: boolean;
}

export function CustomTooltip({
  children,
  placement,
  tooltipId,
  tooltipClasses,
  tooltipText,
  tooltipTextClasses,
  delay,
  hide,
}: CustomTooltipType) {
  if (typeof tooltipText !== 'string') {
    const newTooltipText = React.cloneElement(tooltipText, {
      className: ' bg-secondary text-wrap p-1 px-2 ',
    });
    tooltipText = newTooltipText;
  }

  return !hide ? (
    <Fragment>
      <OverlayTrigger
        placement={placement}
        overlay={
          <Popover id={`popover-positioned-${placement}`}>
            <Popover.Body
              // eslint-disable-next-line @typescript-eslint/no-base-to-string
              id={!tooltipId ? `${tooltipText}Tooltip` : tooltipId}
              style={{ minWidth: 'fit-content' }}
              className={
                'text-wrap p-1 px-2 bg-secondary w-100' + tooltipClasses
              }
            >
              {typeof tooltipText === 'string' ? (
                <span
                  className={
                    // eslint-disable-next-line @typescript-eslint/no-base-to-string
                    'text-wrap p-1 px-2 bg-secondary ' + { tooltipTextClasses }
                  }
                >
                  {tooltipText}
                </span>
              ) : (
                tooltipText
              )}
            </Popover.Body>
          </Popover>
        }
      >
        {children}
      </OverlayTrigger>
    </Fragment>
  ) : (
    <Fragment>
      <>{children}</>
    </Fragment>
  );
}
