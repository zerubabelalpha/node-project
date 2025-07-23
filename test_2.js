

/* HTTP server that allows users to upload text files.
When a file is uploaded, the server will read its contents, 
convert the text to uppercase, 
and then provide a download link for the converted file
 */
import fs from 'fs'
import http from 'http'

import { Transform} from 'stream'

const ToUpper = new Transform({
    transform(chunk,encode,callback){
        this.push(chunk.toString().toUpperCase())
        callback();
    }
})

const server = http.createServer((req,res)=>{


    // file inputing method is required and we will update it soon

    const input_file='file uploading method'
    const output_file = path.join(__dirname,'uploads','converted.txt')

const readStream = fs.createReadStream(input_file)
const writestream = fs.createWriteStream(output_file)

readStream.pipe(ToUpper).pipe(writestream).on('data',()=>{console.log('//generate link')})

writestream.on('finish',()=>{
    res.writeHead(200,{'content-type':'text/html'})
    res.end(`<p>file uploaded and convertde  <a href="/download?file=${path.basename(output_file)}">download here</a>  </p>`)
})
writestream.on('error',(err)=>{
    res.statusCode(500)
    res.end('error writing the file')
})

})

//handle download
server.on('request',(req,res)=>{
    if(req.method.startsWith('/download')){
        const query = new URL(req.url,`http://${req.header.host}`).searchParams
        const filename = query.get('file')
        const filepath = path.join(__dirname,'uploads',filename);

        fs.access(filepath,fs.constants.F_OK,(err)=>{
            if(err){
                res.writeHead(400)
                res.end('file not found')
                return;
            }

            res.writeHead(200,{'content-type':'text/plain'})
            const readStream = fs.createReadStream(filepath)
            readStream.pipe(res)
        })
    }
})





server.listen(3000,'localhost',()=>{
    console.log('server satrted at http://localhost:3000')
})

    

