import React, { useState } from 'react';
import FileUpload from './fileUpload';
import { NFTStorage, File } from 'nft.storage';

const ArtForm = () => {
  const [ userName, setUserName ] = useState('');
  const [ artName, setArtName ] = useState('');
  
  const [isValid, setIsValid] = useState(true);
  // If forms are filled, setNextPage = true
  const [nextPage, setNextPage] = useState(false);
  // If setStep to change page
  const [step, setStep] = useState(0);

  const [image, setImage] = useState(null);

  const submitHandler = (event) => {
    if (event.keyCode == 13) {
      let valid = false;
      let userName = event.target.value.trim();
      if ( userName.length > 3) {
        setUserName(userName);
        valid = true;
      } else {
        valid = false;
      }
    } else {
      console.log('err');
    }
    setIsValid(valid);
  };

  const inputChangeHandler = (event) => {
    if (event.target.value.trim().length > 0) {
      console.log('hee')
    }
  };




  const selectNextHandler = () => {
    if (nextPage==true) {
      setNextPage((prevActivePage) => prevActivePage + 1);
    };
  };


  const apiKey = process.env.API_KEY;
  const client = new NFTStorage({ token: apiKey })

  const updateUploadedFiles = (files) => 
    setNewUserInfo({ ...newUserInfo, profileImages: files});

  const handleSubmit = (event) => {
    event.preventDefault();
    // logic to add image
  };
  

  const styles = {divClass: 'text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer hover:bg-gray-200  bg-gray-100 text-gray-700 border duration-200 ease-in-out border-gray-600 transition',
                  textBorder: 'bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u'
                }


  return (
    <>
    {/* <div className="w-full max-w-xs md:justify-center">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label 
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" 
            for="grid-first-name"
            onChange={inputChangeHandler}
          >
            Preferred Name
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Beeple"/>
          <p className="text-red-500 text-xs italic">Please fill out this field.</p>
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
            Name of Art Piece
          </label>
          <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="CryptoPunks #1223"/>
        </div>
      </div>
      <div className="p-6 card bordered">
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">Enable Deadline</span> 
          <input type="checkbox" checked="checked" className="checkbox checkbox-secondary" />
        </label>
      </div>
    </div>
    <FileUpload/>
    </form>
    </div> */}
    <div className="p-5 my-20">
    <h2 className="title text-3xl mb-8 mx-auto text-center font-bold text-purple-700">The NFT Generator 3000</h2>
    <div className="mx-4 p-4">
        <div className="flex items-center">
            <div className="flex items-center text-teal-600 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bookmark ">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-teal-600">Before you proceed</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-teal-600"></div>
            <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail ">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Personal</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
            <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail ">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Upload</div>
            </div>
            <div className="flex-auto border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
            <div className="flex items-center text-gray-500 relative">
                <div className="rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-database ">
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                </div>
                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-500">Confirm</div>
            </div>
        </div>
    </div>

    { nextPage==0 && 
      <div className="mt-8 p-4">
        <div>
            <div className="font-bold text-gray-600 text-xs leading-8 uppercase h-6 mx-2 mt-3">UserName</div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className={`${styles.textBorder} ${!isValid ? 'border-red-500' : ''}`}>
                      <input 
                        placeholder="Beeple" 
                        className="p-1 px-2 appearance-none outline-none w-full text-gray-800"
                        onChange={inputChangeHandler}  
                        /> 
                    </div>
                </div>
                <div className="w-full flex-1 mx-2 svelte-1l8159u">
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                      <input placeholder="Gordan Ramsay" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> 
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row">
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase"> Ethereum Address</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="Just a hint.." className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> </div>
                </div>
                <div className="w-full mx-2 flex-1 svelte-1l8159u">
                    <div className="font-bold h-6 mt-3 text-gray-600 text-xs leading-8 uppercase">Discord</div>
                    <div className="bg-white my-2 p-1 flex border border-gray-200 rounded svelte-1l8159u">
                        <input placeholder="sendmeat#5744" className="p-1 px-2 appearance-none outline-none w-full text-gray-800"/> </div>
                </div>
            </div>
        </div>
        <div className="flex p-2 mt-4">
          <button className={`${styles.divClasses} ${step==0 ? 'disabled:opacity-50' : ''}`}>Previous</button>
        <div className="flex-auto flex flex-row-reverse">
          <button className="text-base  ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
            hover:bg-teal-600  
            bg-purple-500 
            text-white 
            font-bold
            border duration-200 ease-in-out 
            border-teal-600 transition"
            onSelectNext={selectNextHandler}
            >Next</button>
            </div>
        </div>
    </div>}
    <FileUpload 
      accept=".jpg,.png,.jpeg,.gif"
      label="NFT Images(s)"
      updateFilesCb={updateUploadedFiles}
    />
    <button className="text-base  ml-2  hover:scale-110 hover:bg-purple-600 focus:shadow-outline focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer 
      hover:bg-teal-600  
      bg-purple-500 
      text-white 
      font-bold
      border duration-200 ease-in-out 
      border-teal-600 transition"
      onSubmit={handleSubmit}
      >Submit</button>
  </div>


    </>
  )
}

export default ArtForm;