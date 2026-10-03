'use client';
import {useEffect,useState} from 'react';
const KEY='aventiq-saved';
export function useSavedOpportunities(){
 const [saved,setSaved]=useState<string[]>([]);
 useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem(KEY)||'[]'))}catch{}},[]);
 const toggleSave=(id:string)=>setSaved(cur=>{const next=cur.includes(id)?cur.filter(x=>x!==id):[...cur,id];localStorage.setItem(KEY,JSON.stringify(next));return next});
 return {saved,toggleSave,isSaved:(id:string)=>saved.includes(id)};
}