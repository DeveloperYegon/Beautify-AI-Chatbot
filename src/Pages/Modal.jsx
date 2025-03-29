import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="block fixed z-1 left-0 top-0 w-[100%] overflow-auto bg-black h-[100%]" onClick={onClose}>
      <div className="top-[50%] left-[50%] bg-white absolute P-20 rounded-lg shadow shadow-[rgba(0,0,0,0.5)] translate-x-[-50%] translate-y-[-50%]" onClick={e => e.stopPropagation()}>
        <span className=" absolute close top-5 right-10 cursor-pointer text-2xl" onClick={onClose}>&times;</span>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;