import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import {SHA1} from 'crypto-js'
import * as moment from "moment-timezone"; 
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class RequestsInterceptor implements HttpInterceptor {
  constructor(public router: Router) {}
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log(localStorage.getItem("franchise_id")+"<==== franchise_id");
   console.log("request ==>");
   console.log(request);
    console.log("<==== end request");
    console.log(localStorage.getItem("franchise_id")+"<==== end request");

    var data = encrypt(JSON.stringify(request.body));
    var request = request.clone({body:data});
    if(localStorage.getItem("franchise_id")){
      request=   request.clone({ setHeaders: {
        Franchise:   encrypt(localStorage.getItem("franchise_id"))}
    });
  }
  var response= next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
      //  console.log('event' + event.body.data);
          var dec =decrypt(event.body.data);
          var res = event.clone({body:dec});

          console.log("response ==>");
          console.log(res);
          console.log("<==== end response");
          
          if(res.body != null)
          {
            if(res.body.message == 'Authorization Token not found'  )
            {
             this.router.navigate(["login"]);
            }
          }
         return res;
        }
      }
));
return response

  }
}
function encrypt(request){
  var secretKey = {"A":"y","B":"I","C":"q","D":"T","E":9,"F":"V","G":"J","H":"u","I":"c","J":"P","K":"a","L":4,"M":2,"N":"K","O":"S","P":"z","Q":"m","R":8,"S":"j","T":"F","U":"g","V":5,"W":"w","X":"b","Y":6,"Z":"H","a":"v","b":"R","c":"O","d":"r","e":"D","f":"U","g":"Y","h":0,"i":"h","j":3,"k":"Q","l":"s","m":"t","n":"C","o":"l","p":7,"q":"W","r":"i","s":"k","t":"L","u":"d","v":"M","w":"e","x":"x","y":1,"z":"G","0":"p","1":"X","2":"o","3":"B","4":"A","5":"E","6":"f","7":"Z","8":"n","9":"N"};
  var currentdate = formatedTimestamp(100);
  request=request.concat("#dte#");
  request=request.concat(currentdate);
  var arr = request.split('');
  var env ="";
  for (let key in arr) {
    var value = arr[key];
    if((/[a-zA-Z]/).test(value)||(/[0-9]/).test(value)){
      env=env.concat(secretKey[String(value)]);
    }else{
      env=env.concat(value);
    }
}
let hash = SHA1(env)
env=env.concat("!h!");
env=env.concat(hash.toString());
var ress = { 
  data:Base64.encode(env)
}; 
return JSON.stringify(ress);
} 
function decrypt(request){
  var secretKey = {"A":"y","B":"I","C":"q","D":"T","E":9,"F":"V","G":"J","H":"u","I":"c","J":"P","K":"a","L":4,"M":2,"N":"K","O":"S","P":"z","Q":"m","R":8,"S":"j","T":"F","U":"g","V":5,"W":"w","X":"b","Y":6,"Z":"H","a":"v","b":"R","c":"O","d":"r","e":"D","f":"U","g":"Y","h":0,"i":"h","j":3,"k":"Q","l":"s","m":"t","n":"C","o":"l","p":7,"q":"W","r":"i","s":"k","t":"L","u":"d","v":"M","w":"e","x":"x","y":1,"z":"G","0":"p","1":"X","2":"o","3":"B","4":"A","5":"E","6":"f","7":"Z","8":"n","9":"N"};
  var tarr = array_flip(secretKey);
  var currentdate = formatedTimestamp(0);
  request= Base64.decode(request);
  var Arr_request=request.split("!h!");
  if(SHA1(Arr_request[0]).toString() != Arr_request[1]){
    throw new Error('Valid token not returned');
  }
  request=request.concat(currentdate);
  var arr = request.split('');
  var env ="";
  for (let key in arr) {
    var value = arr[key];
    if((/[a-zA-Z]/).test(value)||(/[0-9]/).test(value)){
      env=env.concat(tarr[String(value)]);
    }else{
      env=env.concat(value);
    }
}
var date = env.split("#dte#");
if(date[1] < currentdate){
  throw new Error('Token expired');
}
return JSON.parse(date[0]);
}; 
const formatedTimestamp = (minute)=> {
moment.tz.setDefault("UTC");
  var a = new Date();
  var d =  new Date(a.getTime() + minute*60000);
  var date = d.toISOString().split('T')[0];
  var time = d.toTimeString().split(' ')[0];
  return `${date} ${time}`
}
function array_flip( trans )
{
    var key, tmp_ar = {};

    for ( key in trans )
    {
        if ( trans.hasOwnProperty( key ) )
        {
            tmp_ar[trans[key]] = key;
        }
    }

    return tmp_ar;
}