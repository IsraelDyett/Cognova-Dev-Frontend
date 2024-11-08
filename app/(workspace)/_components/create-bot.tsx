"use client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormAction,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { debug } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Model } from "@prisma/client";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBotSchema } from "@/lib/zod/schemas/bot";
import { createBot, getModels } from "../actions";
import { useSidebarStore } from "@/components/sidebar-store";

const defaultStarterQuestions = ["Hello, how can I help you today?"];

export function CreateBot() {
  const router = useRouter();
  const { workspaces } = useSidebarStore();
  const [models, setModels] = useState<Model[]>([]);
  const form = useForm<z.infer<typeof createBotSchema>>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      name: "",
      workspaceId: "",
      modelId: "",
      starterQuestions: defaultStarterQuestions,
    },
  });
  const onSubmit = async (data: z.infer<typeof createBotSchema>) => {
    const createdBot = await createBot(data);
    if (createdBot) {
      form.reset();
      toast.success(createdBot.message);
      router.push(createdBot.redirect);
    }
  };
  const alreadyMounted = useRef(false);
  useEffect(() => {
    if (!alreadyMounted.current) {
      Promise.all([
        debug("[USE-EFFECT] {CREATE-BOT] {GET-MODELS}"),
        getModels().then((models) => setModels(models)),
      ]);
    }
    alreadyMounted.current = true;
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Create Bot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a bot</DialogTitle>
          <DialogDescription>Enter the details for your new Bot.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" autoCapitalize="none" autoCorrect="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workspaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select workspace" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workspaces.map((workspace) => (
                        <SelectItem key={workspace.id} value={workspace.id}>
                          {workspace.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the workspace the bot will be associated with.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LLM Model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select LLM Model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the model to use for the bot.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormAction>Create</FormAction>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
