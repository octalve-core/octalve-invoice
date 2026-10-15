"use client";
import {getInitials,useMerchantPreview} from "./MerchantPreviewProvider";
export function UserAvatar({size="md"}:{size?:"sm"|"md"|"lg"}){
 const {user,userImage}=useMerchantPreview();
 const sizes={sm:"h-9 w-9 text-xs",md:"h-11 w-11 text-sm",lg:"h-20 w-20 text-2xl"};
 return <span aria-label={`User avatar: ${user.fullName||"Preview user"}`}
 className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0064E0] font-semibold text-white ${sizes[size]}`}>
  {userImage?<img src={userImage} alt="" className="h-full w-full object-cover"/>:getInitials(user.fullName||"Preview User")}
 </span>;
}
