"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function Register() {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("client")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            name,
            role,
          },
        },
      })

      if (signUpError) {
        if (signUpError.status === 429) {
          throw new Error("Слишком много попыток регистрации. Пожалуйста, подождите несколько минут и попробуйте снова.")
        }
        throw signUpError
      }

      if (data.user) {
        toast({
          title: "Регистрация успешна!",
          description: "Пожалуйста, проверьте вашу почту для подтверждения аккаунта.",
        })

        router.push("/login")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Что-то пошло не так. Пожалуйста, попробуйте снова."
      toast({
        title: "Ошибка",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Создать аккаунт</CardTitle>
          <CardDescription>
            Присоединяйтесь к нашей платформе для доступа к психологическим тестам и профессиональной поддержке
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Полное имя</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Введите ваше полное имя"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Введите ваш email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Создайте пароль"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Я</Label>
              <Select
                name="role"
                value={role}
                onValueChange={setRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите вашу роль" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Клиент</SelectItem>
                  <SelectItem value="therapist">Терапевт</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Создание аккаунта..." : "Создать аккаунт"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}