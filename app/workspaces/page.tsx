"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "./store";
import { createWorkspace, inviteTeammates } from "./actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Users, Building2, ArrowRight } from "lucide-react";
import { workspaceSchema, inviteSchema } from "@/zod/schemas/workspace";
import { getPlans, getRoles } from "../actions";
import type { Plan, Role } from "@prisma/client";
import type { z } from "zod";

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;
type InviteFormValues = z.infer<typeof inviteSchema>;

export default function OnboardingFlow() {
  const {
    step,
    plans,
    roles,
    invites,
    isLoading,
    setStep,
    setPlans,
    setRoles,
    addInvite,
    removeInvite,
    setIsLoading,
    workspaceId,
    setWorkspaceId,
  } = useOnboardingStore();

  // Form for both workspace name and plan selection
  const workspaceForm = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      displayName: "",
    },
    mode: "onChange",
  });

  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: "",
      roleId: "",
    },
  });

  const progress = (step / 4) * 100;

  useEffect(() => {
    const loadData = async () => {
      const [plansData, rolesData] = await Promise.all([getPlans(), getRoles()]);
      setPlans(plansData);
      setRoles(rolesData);
      if (rolesData.length > 0) {
        inviteForm.setValue("roleId", rolesData[0].id);
      }
    };
    loadData();
  }, []);

  // Called when both workspace name and plan are selected
  const handleWorkspaceCreation = async (data: WorkspaceFormValues) => {
    setIsLoading(true);
    try {
      const response = await createWorkspace(data.displayName);
      if (response.success && response.workspaceId) {
        setWorkspaceId(response.workspaceId);
        setStep(3);
      }
    } catch (error) {
      console.error("Workspace creation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1 && workspaceForm.getValues("displayName")) {
      setStep(2);
    } else if (step === 2) {
      workspaceForm.handleSubmit(handleWorkspaceCreation)();
    }
  };

  const onInviteSubmit = async (data: InviteFormValues) => {
    addInvite(data.email, data.roleId);
    inviteForm.reset({ ...inviteForm.getValues(), email: "" });
  };

  const handleInviteTeammates = async () => {
    alert(invites.length);
    if (!invites.length) {
      setStep(4);
      return;
    }

    setIsLoading(true);
    try {
      const response = await inviteTeammates(`${workspaceId}`, invites);
      if (response.success) {
        setStep(4);
      }
    } catch (error) {
      console.error("Failed to send invites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-r from-yellow-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>
              {step === 1 && "Name your workspace"}
              {step === 2 && "Choose a plan"}
              {step === 3 && "Invite your team"}
              {step === 4 && "All set!"}
            </span>
            <Progress value={progress} className="w-20" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(step === 1 || step === 2) && (
            <Form {...workspaceForm}>
              <form className="space-y-4">
                {step === 1 && (
                  <FormField
                    control={workspaceForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter workspace name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button
                  type="button"
                  className="w-full"
                  onClick={handleNextStep}
                  disabled={
                    isLoading ||
                    (step === 1 && !workspaceForm.getValues("displayName"))
                  }
                >
                  {isLoading ? "Processing..." : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Form {...inviteForm}>
                <form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-4">
                  <div className="flex gap-2">
                    <FormField
                      control={inviteForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={inviteForm.control}
                      name="roleId"
                      render={({ field }) => (
                        <FormItem className="w-[140px]">
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role: Role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.displayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Add team member
                  </Button>
                </form>
              </Form>

              {invites.map((invite) => (
                <div
                  key={invite.email}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span className="text-sm">{invite.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeInvite(invite.email)}>
                    Remove
                  </Button>
                </div>
              ))}

              <Button className="w-full" onClick={handleInviteTeammates} disabled={isLoading}>
                {isLoading ? "Sending invites..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Workspace created!</h3>
                <p className="text-sm text-muted-foreground">
                  Your workspace is ready. You can now start collaborating with your team.
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
