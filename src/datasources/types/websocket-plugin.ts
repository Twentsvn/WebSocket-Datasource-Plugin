import { GSContext,  GSDataSource, GSStatus, PlainObject,} from "@godspeedsystems/core";

import Websocket , { Data } from "ws";
import fs from "fs";
import path from "path";


export default class DataSource extends GSDataSource {
  private socket !: Websocket;
  private isConnected = false;
  private logFilePath : string = "";
  private isClientInitialised = false;
  private duration !: number ;

  protected async initClient(): Promise<object> {
   const url = this.config.url;
   if(!url) throw new Error("Missing 'url' in config. ");

    this.duration = this.config.duration || 5000;

   console.log("Initializing WebSocket Client ...");
   // we can go for checks like
   if(!this.config.username){console.error("config no username");}
   if(!this.config.password){console.error("config no password");}

   console.log("initClient() called with config:", this.config);


   if(this.config.username === "admin" && this.config.password === "admin"){
    this.isClientInitialised = true;
   }

   if(this.isClientInitialised) {
    return { status : "Client Initialised", username : this.config.username };
                              }
else{
    return { status : "Failed to Initialised. Invalid Credentials "};
}

     // initialize your client
}
  

async execute(ctx: GSContext, args: PlainObject): Promise<any> {

  if(!this.isClientInitialised){
    throw new Error("Client is not initialised. Plese initialise the client.");
  }

    const { payload } = args;
    const url = this.config.url;
    if(!url) throw new Error ("Missing 'url' in config. ");
	  

    const timestamp = new Date().toISOString().replace(/[:.]/g,"-");
    const filename = `data-${timestamp}.jsonl`;
    const logsDir = path.resolve(process.cwd() , "logs" );
    
    if(!fs.existsSync(logsDir)){
      fs.mkdirSync(logsDir);
    }

    const logFilePath = path.join(logsDir , filename);

      const socket = new Websocket(url);

      return new Promise((resolve , reject) => {
        socket.on("open" , () => {

          // send subscription msg
          if(payload){
          socket.send(JSON.stringify(payload));
          }
          else{
            console.log("No payload provided , not sending any message.");
          }
          
          socket.on("message" , (data : Data)=> {
            try{
              const parsed = JSON.parse(data.toString());
              fs.appendFileSync(logFilePath , JSON.stringify(parsed)+ "\n", "utf-8");
            }
            catch(err) {
              console.error("Failed to write message to file: ", err);
            }
          });

          setTimeout(()=>{
            socket.close();
            resolve({
              status  : "done",
              file : filename , 
              message : `connection closed after ${this.duration /1000}s . Data logged.`,
            });
          },this.duration);
        });

        socket.on("close" , () =>{
          console.log(`WebSocket closed. File saved to ${logFilePath}`);
        });

        socket.on("error", (err) => {
          console.error("WebSocket Error:" , err);
          reject(err);
        });

      });
      // execute methods
    } 
    
}

const SourceType = 'DS';
const Type = "websocket-plugin"; // this is the loader file of the plugin, So the final loader file will be `types/${Type.js}`
const CONFIG_FILE_NAME = "websocket-plugin"; // in case of event source, this also works as event identifier, and in case of datasource works as datasource name
const DEFAULT_CONFIG = {};

export {
  DataSource,
  SourceType,
  Type,
  CONFIG_FILE_NAME,
  DEFAULT_CONFIG
}
