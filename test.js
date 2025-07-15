
import http from 'http'
import {URL} from 'url'  

let todo=[
    {id:1, task:'read',completed:false},
    {id:2, task:'study',completed:true},
    {id:3, task:'play',completed:false}
]
const server = http.createServer((req,res)=>{
    const {method,url} = req
    const parsedurl = new URL(url,  `http://${req.headers.host}`)
    const pathname = parsedurl.pathname

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if(method==='OPTIONS'){   //options
        res.writeHead(204)
        res.end()
        return;
    }

    else if(method==='GET'&& pathname==='/todo'){  //get
        res.writeHead(200,{'Content-Type':'application/json'})
    res.end(JSON.stringify(todo))}

    else if(method==='GET' && pathname.startsWith('/todo/')){
        const id = parseInt(pathname.split('/')[2])
        const index = todo.findIndex(t=>t.id ===id)

        try{
            if(todo[index]){
                res.writeHead(200,{'content-type':'application/json'})
                res.end(JSON.stringify(todo[index]))
            }
            else{
                res.writeHead(400,{'content-type':'application/json'})
            res.end(JSON.stringify({error:`task with id ${id} not found`}))
            }
        }
        catch(e){
            res.writeHead(400,{'content-type':'application/json'})
            res.end(JSON.stringify({error:'page not found'}))
        }
    }


    else if (method==='POST' && pathname==='/todo'){   //post

        let body =''
        req.on('data',chunk=>{
            body+=chunk.toString()
        })

        req.on('end',()=>{
            try{
                const newtodo=JSON.parse(body)
                newtodo.id=todo.length>0? Math.max(...todo.map(t=>t.id))+1:1
                todo.push(newtodo)
                res.writeHead(201,{'content-type':'application/json'})
                res.end(JSON.stringify(newtodo))

            }
            catch(e){
                res.writeHead(400,{'content-type':'application/json'})
                res.end(JSON.stringify({error:'todo not found'}))
            }
        })
    }

    else if (method ==='PUT' && pathname.startsWith('/todo/')){

         const id = parseInt(pathname.split('/')[2])
        let body = ''

        req.on('data',(chunk)=>
        {
            body+=chunk.toString()
        })


    req.on('end',()=>{

                           
      try{
            const updatedtodo =JSON.parse(body)
            const index = todo.findIndex(t=>t.id===id)


            if(index== -1){
                res.writeHead(404,{'content-type':'application/json'})
                res.end(JSON.stringify({error:'item not found'}))
            }
            else{
                todo[index]={...todo[index] , ... updatedtodo}
                res.writeHead(200,{'content-type':'application/json'})
                res.end(JSON.stringify(todo[index]))
            }
        }

        catch(e){

            res.writeHead(400,{'content-type':'application/json'})
            res.end(JSON.stringify({error:'couldnt find '}))
        }

     })}

    else if(method==='DELETE'&& pathname.startsWith('/todo/')){
        const id = parseInt(pathname.split('/')[2])
        const index = todo.findIndex(t=>t.id === id)

        if(index === -1){
            res.writeHead(404,{'content-type':'application/json'})
            res.end(JSON.stringify({error:'page not found'}))
        }
        else{
            todo = todo.filter(t=>t.id !== id)
            res.writeHead(204)
            res.end()
        }

    }
   
        
    
    else{
        res.writeHead(404,{'content-type':'application/json'})
        res.end(JSON.stringify({error:'page not found'}))
    }

})
server.listen(8080,()=>{
    console.log('server started at http://localhost:8080')
})