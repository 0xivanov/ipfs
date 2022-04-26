// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Dropbox {

    string public name = "Dropbox";

    uint private fileCount;

    mapping(uint => File) files;

    constructor() {

        fileCount = 1;
    }

    struct File {
        string fileName;
        uint fileSize;
        string fileHash;
        uint uploadTime;
        address uploader;
    }

    function uploadFile(string memory _fileName, uint _fileSize, string memory _fileHash) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure uploader address exists
    //require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(_fileName, _fileSize, _fileHash, block.timestamp, msg.sender);
    }
}
