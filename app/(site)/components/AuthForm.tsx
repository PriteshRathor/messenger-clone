"use client"

import Button from "@/app/components/Button"
import Input from "@/app/components/Input/input"
import { useCallback, useEffect, useState } from "react"
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useForm, SubmitHandler, FieldValues } from "react-hook-form"
import AuthSocialButton from "./AuthSocialButton"
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variant = 'LOGIN' | 'REGISTER'

const AuthForm = () => {

    const session = useSession();
    const [variant, setVariant] = useState<Variant>("REGISTER")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    // console.log("router -----", router);

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router.push('/users')
        }
    }, [session?.status, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })
    const toggleVariant = useCallback(() => {
        if (variant === "LOGIN") {
            setVariant("REGISTER")
        } else {
            setVariant("LOGIN")
        }
        reset()
    }, [variant])



    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true)

        if (variant === "REGISTER") {
            // REGISTER API
            axios.post(`/api/register`, data).catch((error) => {
                toast.error(error.response.data)
            })
                .then(() => signIn('credentials', {
                    ...data,
                    redirect: false,
                }))
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('Invalid credentials!');
                    }

                    if (callback?.ok) {
                        toast.success('Successfully registered!');
                        router.push('/conversations')
                    }
                })
                .finally(() => setIsLoading(false))
            debugger
        }

        if (variant === "LOGIN") {
            // LOGIN API 
            signIn('credentials', {
                ...data,
                redirect: false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }

                if (callback?.ok) {
                    toast.success("Logged In Sucessfully!")
                    router.push('/users')
                }
            }).finally(() => setIsLoading(false))
        }

        setIsLoading(false)


    }
    const socialAction = (action: string) => {
        setIsLoading(true)

        // NextAuth Social sign in 
        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }

                if (callback?.ok) {
                    debugger
                    // router.push('/conversations')
                }
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div
                className="
          bg-white
            px-4
            py-8
            shadow
            sm:rounded-lg
            sm:px-10
          "
            >
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'REGISTER' && (
                        <Input
                            disabled={isLoading}
                            register={register}
                            errors={errors}
                            required
                            id="name"
                            label="Name"
                        />
                    )}
                    <Input
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        id="email"
                        label="Email address"
                        type="email"
                    />
                    <Input
                        disabled={isLoading}
                        register={register}
                        errors={errors}
                        required
                        id="password"
                        label="Password"
                        type="password"
                    />
                    <div>
                        <Button disabled={isLoading} fullWidth type="submit">
                            {variant === 'LOGIN' ? 'Sign in' : 'Register'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div
                            className="
                absolute 
                inset-0 
                flex 
                items-center
              "
                        >
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                <div
                    className="
            flex 
            gap-2 
            justify-center 
            text-sm 
            mt-6 
            px-2 
            text-gray-500
          "
                >
                    <div>
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <div
                        onClick={toggleVariant}
                        className="underline cursor-pointer"
                    >
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AuthForm