import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Dropbox from "./abis/Dropbox.json"
import { create } from "ipfs-http-client";


function App() {

  const [account, setAccount] = useState(undefined)
  const [provider, setProvider] = useState(undefined)
  const [file, setFile] = useState(undefined)
  const [dropbox, setDropbox] = useState(undefined)

  useEffect(() => {
    const accountChangeListener = () => {
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0])
        console.log("after")
      })
    }

    accountChangeListener()
  }, [])

  const connectAccount = async () => {
    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      provider.send("eth_requestAccounts").then((accounts) => {
        console.log(accounts)
        setAccount(accounts[0])
      })
      .catch((error) => {
        alert("metamask connection rejected")
        console.log(error)
      })
    } else {
      alert("install metamask")
    }
  }


	const changeHandler = (event) => {
    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      setFile({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
    }
	};

	const handleSubmission = async () => {
    const ipfs = create({ host: 'localhost', port: '5001', protocol: 'http'})

    console.log("Submitting file to IPFS...")
    console.log(file)
    // Add file to the IPFS
    try {
      const result = await ipfs.add(file.buffer)
      console.log(result)

      console.log("BLAAA")
    
      const fileName = file.name
      const fileType = file.type
      await loadContract().then(
        () => {
          dropbox.functions.uploadFile(fileName, result.size, result.cid).send((result) => {
            console.log(result)
          })
        }
      )
      //console.log(dropbox)

    } catch (error) {
      console.log(error)
    }
	}

  const loadContract = async () => {
    const networkId = await provider.getNetwork()
    const networkData = Dropbox.networks[networkId.chainId]

    if(networkData) {
      // Assign contract
      const dropbox = new ethers.Contract(networkData.address, Dropbox.abi, provider)
      setDropbox(dropbox)
      console.log(dropbox)
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  return (
    <>
      <button disabled={account} onClick={
        () => {
          connectAccount()
        }
      }>
      connect to metamask</button>
      {
        account ? <div>{account}</div> : <div>no account detected</div>
      }

      <input type="file" name="file" onChange={changeHandler} />
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
    </>
  )
}


export default App