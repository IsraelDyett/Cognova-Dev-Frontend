"use client";

import { useState } from "react";
import { useOnboardingStore } from "./store";
import { createWorkspace, inviteTeammates } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Users, Building2, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function OnboardingFlow() {
  const {
    step,
    email,
    workspaceName,
    invites,
    setStep,
    setWorkspaceName,
    addInvite,
    removeInvite,
  } = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteRole, setNewInviteRole] = useState<"member" | "admin">("member");

  const progress = (step / 4) * 100;

  const handleCreateWorkspace = async () => {
    setIsLoading(true);
    const response = await createWorkspace(workspaceName, email);
    setIsLoading(false);

    if (response.success) {
      setStep(3);
    }
  };

  const handleInviteTeammates = async () => {
    if (!invites.length) {
      setStep(4);
      return;
    }

    setIsLoading(true);
    const response = await inviteTeammates("workspace_id", invites);
    setIsLoading(false);

    if (response.success) {
      setStep(5);
    }
  };

  const handleAddInvite = () => {
    if (newInviteEmail && !invites.find((invite: any) => invite.email === newInviteEmail)) {
      addInvite(newInviteEmail, newInviteRole);
      setNewInviteEmail("");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-r from-yellow-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {step === 1
                ? siteConfig.applicationName
                : step === 2
                  ? "Create workspace"
                  : step === 2
                    ? "Invite teammates"
                    : "Get started"}
            </span>
            <Progress value={progress} className="w-20" />
          </CardTitle>
          <CardDescription>
            {step == 1 && `Welcome to ${siteConfig.applicationName}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step == 1 && (
            <Button className="w-full" onClick={() => setStep(2)}>
              Get started
            </Button>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace name</label>
                <Input
                  placeholder="Enter workspace name"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleCreateWorkspace}
                disabled={!workspaceName || isLoading}
              >
                {isLoading ? "Creating..." : "Create workspace"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter email address"
                    value={newInviteEmail}
                    onChange={(e) => setNewInviteEmail(e.target.value)}
                  />
                  <Select
                    value={newInviteRole}
                    onValueChange={(value: "member" | "admin") => setNewInviteRole(value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="w-full" onClick={handleAddInvite}>
                  <Users className="mr-2 h-4 w-4" />
                  Add email
                </Button>
              </div>

              {invites.map((invite: any) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span className="text-sm">{invite.email}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{invite.role}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeInvite(invite.email)}>
                      x
                    </Button>
                  </div>
                </div>
              ))}

              <div className="space-y-2">
                <Button className="w-full" onClick={handleInviteTeammates} disabled={isLoading}>
                  {isLoading ? "Sending invites..." : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStep(3)}>
                  I&apos;ll do this later
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Welcome to your workspace!</h3>
                <p className="text-sm text-muted-foreground">
                  Your workspace has been created successfully. You can now start collaborating with
                  your team.
                </p>
              </div>
              <Button className="w-full">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
