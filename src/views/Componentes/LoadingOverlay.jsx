import React from 'react';

const LoadingOverlay = ({ loading }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-10 transition-opacity ${loading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      <div className="border-4 border-teal-500 border-opacity-60 rounded-full w-16 h-16 animate-spin bg-gradient-to-br from-teal-100 to-teal-300"></div>
    </div>
  );
};

export default LoadingOverlay;
