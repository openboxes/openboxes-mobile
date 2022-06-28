import React, { JSXElementConstructor, ReactElement } from 'react';

type ChildType = ReactElement<any, string | JSXElementConstructor<any>>;

const AddPropsToChildren = (children: React.ReactNode, callback: (child: ChildType) => any) => {
  if (Array.isArray(children)) {
    return React.Children.map(children, (child) => {
      // Checking isValidElement is the safe way and avoids a typescript error too.
      if (React.isValidElement(child)) {
        const props = callback(child);
        return React.cloneElement(child, props);
      }
      return child;
    });
  }

  if (React.isValidElement(children)) {
    const props = callback(children);
    return React.cloneElement(children, props);
  }
  return children;
};

export default AddPropsToChildren;
