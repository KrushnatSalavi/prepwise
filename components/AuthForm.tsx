"use client"

import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const formSchema = z.object({
    username: z.string().min(2).max(50)
})


const AuthForm = () => {
  return (
    <div>
      
    </div>
  )
}

export default AuthForm
