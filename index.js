var fs = require('fs');
var path = require('path');



let createDirectory = function (filePath) {


    return new Promise(function (resolve,reject) {



        fs.exists(filePath,(exists)=>{
            if(exists)
            {
                resolve();
            }
            else{
                fs.mkdir(filePath,(error)=>{
                if(error)
                {
                    reject(error);
                }
                resolve();

    });
    }

    });

    });
}


let deleteFile = function (fullPath) {
    let promise = null;

    promise = new Promise(function (resolve,reject) {
        fs.exists(fullPath,(exists)=>{
            if(exists)
            {
                //delete
                fs.unlink(fullPath,(error)=>{
                    if(error)
                    {
                        reject(error);
                    }
                    else{
                        resolve();
            }
            });
                return;
            }
            resolve();

    });
    });
    return promise;







}

let createFile = function (fullPath,content) {
    return new Promise(function (resolve,reject) {

        fs.writeFile(fullPath,content,'utf8',(error)=>{
            if(error)
            {
                reject(error);
            }
            else{
                resolve();
    }
    });
    })

}

let writeFile = function (fileName,filePath,content) {
    let fullPath = path.join(filePath,fileName);

    return new Promise(function (resolve,reject) {
        deleteFile(fullPath).then(function () {
            createFile(fullPath,content).then(function () {
                resolve();
            });
        }).catch(function (error) {
            reject(error);
        });
    });

}


function FileWriteWebpackPlugin(options) {
    this.options = options;



}


FileWriteWebpackPlugin.prototype.apply = function (compiler) {

    let  options = this.options;
    let content = options.content,
        filePath = options.filePath,
        fileName = options.fileName;



    compiler.plugin('emit', function(compilation, cb) {
        if(!content||!fileName||!filePath)
        {
            compilation.errors.push(new Error('configWriterWebpackPlugin error,must be setting content , fileName and filePath'));
            cb();
        }

        let promise = createDirectory(filePath);
        promise.then(function () {

            writeFile(fileName,filePath,content).then(function () {
                cb();
            });



        }).catch(function (error) {
            if(error)
            {
                compilation.errors.push(new Error('configWriterWebpackPlugin error,'+error));
            }
            else{
                compilation.errors.push(new Error('configWriterWebpackPlugin error, create dir error '));
            }
        });



    });


}


module.exports = FileWriteWebpackPlugin;

