import React from 'react';

const Rough = () => {
  return (
    <div className='m-0 p-0 h-[100vh] w-[100vw] overflow-hidden'>
      <iframe
      className='w-[100vw] h-[100vh]'
        src='index.html'
        title="Godot Game"
      ></iframe>
    </div>
  );
};

export default Rough;
