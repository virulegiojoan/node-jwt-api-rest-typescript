
import { Request, Response } from "express"
import { comparePasswords, hashPassword } from "../services/passwordService"
import prisma from "../models/user"
import { generateToken } from "../services/authService"


export const register = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'Email is required' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' })
            return
        }
        const hashedPassword = await hashPassword(password)

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        const token = generateToken(user)
        res.status(201).json({ token })

    } catch (error: any) {

        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'email already exists' })
        }

        console.log(error)
        res.status(500).json({ error: 'error in the registration' })

    }

}

export const login = async (req: Request, res: Response): Promise<void> => {

    const { email, password } = req.body

    try {

        if (!email) {
            res.status(400).json({ message: 'Email is required' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required' })
            return
        }

        const user = await prisma.findUnique({ where: { email } })
        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }

        const passwordMatch = await comparePasswords(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Username and passwords do not match' })
        }

        const token = generateToken(user)
        res.status(200).json({ token })


    } catch (error: any) {
        console.log('Error: ', error)
    }

}