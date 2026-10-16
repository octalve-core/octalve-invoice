"use client";
import {useEffect,useRef} from "react";
/**
 * Keyboard and focus management for the existing desktop dialogs and mobile sheets.
 * Does not grant any role, financial or data-access authority.
 */
export function useAccessibleDialog(open:boolean,onClose:()=>void){
 const closeRef=useRef(onClose);
 useEffect(()=>{closeRef.current=onClose;},[onClose]);
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const dialog=document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"],[role="alertdialog"][aria-modal="true"]');
  if(!dialog)return;
  const oldOverflow=document.body.style.overflow;
  document.body.style.overflow="hidden";
  const list=()=>Array.from(dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')).filter(el=>el.getClientRects().length>0&&el.getAttribute("aria-hidden")!=="true");
  const first=list()[0]||dialog;
  if(!dialog.hasAttribute("tabindex"))dialog.tabIndex=-1;
  first.focus({preventScroll:true});
  function keydown(e:KeyboardEvent){
   if(e.key==="Escape"){e.preventDefault();e.stopPropagation();closeRef.current();return;}
   if(e.key!=="Tab")return;
   const focusable=list();
   if(!focusable.length){e.preventDefault();dialog?.focus();return;}
   const firstItem=focusable[0],lastItem=focusable[focusable.length-1];
   if(e.shiftKey&&(document.activeElement===firstItem||document.activeElement===dialog)){
    e.preventDefault();lastItem.focus();return;
   }
   if(!e.shiftKey&&document.activeElement===lastItem){e.preventDefault();firstItem.focus();}
  }
  document.addEventListener("keydown",keydown,true);
  return ()=>{
   document.removeEventListener("keydown",keydown,true);
   document.body.style.overflow=oldOverflow;
   if(previous&&previous.isConnected)previous.focus({preventScroll:true});
  };
 },[open]);
}
