"use client";
import { join } from "path";
import { useState } from "react";
import { useRef } from "react";
// class socketSingleton{
  
//   static socketURL:string
//   static socket:WebSocket
//   constructor(url:string){
//     socketSingleton.socketURL = url
    
//   }
  
//   static getInstance(){
//     if(!socketSingleton.socket){
//       return new WebSocket(this.socketURL)
//     }else{
//       return socketSingleton.socket
//     }
//   }
// }
class socketSingleton {
  private static socket: WebSocket;

  private constructor(url: string) {
    throw new Error('socketSingleton is a singleton class. Use getInstance() to obtain the instance.');
  }

  static getInstance(url:string): WebSocket {
    if (!socketSingleton.socket) {
      try {
        socketSingleton.socket = new WebSocket(url);
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
      }
    }
    return socketSingleton.socket;
  }
}


export default function ChatMain(searchParams:{[key:string]:string}) {  
  const [sendMessage, setSendMessage] = useState<string>('')

  const web = socketSingleton.getInstance(`http://localhost:8080/`)

  web.onopen = function () {
    console.log("connection is establiched");
    const joinEvent = { type: "join", payload: { roomId: searchParams.roomID } };
    web.send(JSON.stringify(joinEvent))
  };
  web.onmessage = function (event:any) {
    console.log("Received message:", event.data);
    setChildDivs((state) => [...state, { content: event.data }]);
  };

  interface ChildDiv {
    content: string;
  }
  const [childDivs, setChildDivs] = useState<ChildDiv[]>([]);

  const handelAppend = () => {
    web.send(JSON.stringify({ type: "message", payload: { roomId: "123",message:sendMessage } }));
   
  };
  return (
    <main className="flex justify-center items-center mt-28">
      <div></div>

      <div className="w-120">
        <div className=" flex-row g-3 w-120">
          {childDivs.map((obj, index) => (
            <div className=" align-middle" key={index}>
              {obj.content + ` ${index}`}
            </div>
          ))}
        </div>
        <div className=" flex">
          <input name='userMessageSend' value={sendMessage} onChange={(e)=>setSendMessage(e.target.value)} className="border border-green rounded " type="text" />
          <button
            className="p-2 bg-green-400 rounded m-2"
            onClick={handelAppend}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
