import React from 'react';

const Feature: React.FC = () => {
  return (
    <div className="text-2xl flex justify-center items-center font-bold">
      <img
        className="w-[69px] h-[69px]"
        src={require('/public/logo.png')}
        alt=""
      />
      PDF Edit All
    </div>
  );
};

export default Feature;
