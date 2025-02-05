import React from 'react'
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session) redirect('/')
  const userId = session?.user?.id
        
  return (
    <div>Not available yet </div>
  )
}
