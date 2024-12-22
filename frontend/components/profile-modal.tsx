"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { UserProfile } from "@/types"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialProfile: UserProfile
  onSave: (profile: UserProfile) => void
}

export function ProfileModal({
  open,
  onOpenChange,
  initialProfile,
  onSave,
}: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [dateFromOpen, setDateFromOpen] = useState(false)
  const [dateToOpen, setDateToOpen] = useState(false)

  const handleSave = () => {
    onSave(profile)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>个人资料</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="age">年龄</Label>
            <Input
              id="age"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mbti">MBTI</Label>
            <Input
              id="mbti"
              value={profile.mbti}
              onChange={(e) => setProfile({ ...profile, mbti: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="income">月收入</Label>
            <Input
              id="income"
              value={profile.income}
              onChange={(e) => setProfile({ ...profile, income: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="companions">同行人数</Label>
            <Input
              id="companions"
              type="number"
              min="1"
              value={profile.companions}
              onChange={(e) => setProfile({ ...profile, companions: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="targetCity">目标城市</Label>
            <Input
              id="targetCity"
              value={profile.targetCity}
              onChange={(e) => setProfile({ ...profile, targetCity: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>规划时间</Label>
            <div className="flex gap-4">
              <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.travelDateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.travelDateFrom ? format(new Date(profile.travelDateFrom), 'PPP') : <span>开始日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={profile.travelDateFrom ? new Date(profile.travelDateFrom) : undefined}
                    onSelect={(date) => {
                      setProfile({ ...profile, travelDateFrom: date ? date.toISOString() : '' })
                      setDateFromOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
              <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profile.travelDateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profile.travelDateTo ? format(new Date(profile.travelDateTo), 'PPP') : <span>结束日期</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={profile.travelDateTo ? new Date(profile.travelDateTo) : undefined}
                    onSelect={(date) => {
                      setProfile({ ...profile, travelDateTo: date ? date.toISOString() : '' })
                      setDateToOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleSave}>保存更改</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 