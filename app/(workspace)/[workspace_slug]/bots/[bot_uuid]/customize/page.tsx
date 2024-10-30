'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CustomizePage() {
    const [botName, setBotName] = useState('My Bot')
    const [primaryColor, setPrimaryColor] = useState('#007bff')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the customization options to your backend
        alert('Customization options saved!')
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Customize</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <Label htmlFor="botName">Bot Name</Label>
                    <Input
                        id="botName"
                        value={botName}
                        onChange={(e) => setBotName(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full h-10"
                    />
                </div>
                <Button type="submit">Save Changes</Button>
            </form>
        </div>
    )
}