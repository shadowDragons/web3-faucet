import React from 'react';

function GoerliFaucet() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex justify-end p-4">
        <span className="text-gray-400 text-sm">Logged in as: example@example.com</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-2xl w-full px-4 py-8 sm:px-6 sm:py-12 bg-gray-800 rounded-lg shadow-lg text-white">
          <h1 className="text-4xl font-bold mb-6 text-center">Goerli Faucet</h1>
          <form className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="w-full">
                <label htmlFor="address" className="sr-only">Address</label>
                <input type="text" id="address" name="address" placeholder="Address"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
                  required />
              </div>
            </div>
            <button type="submit"
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold text-white">Request
              Funds</button>
          </form>
        </div>
        <div className="mt-8">
          <img src="your-qrcode-image.png" alt="Donate QR Code" />
          <p className="mt-4 text-gray-600">Scan the QR code to donate</p>
        </div>
      </div>
    </div>
  );
}

export default GoerliFaucet;