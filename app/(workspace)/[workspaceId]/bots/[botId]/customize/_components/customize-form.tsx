import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
// import { ColorPicker } from "@/components/ui/color-picker";

export const CustomizeForm = ({
  form,
}: {
  form: UseFormReturn<
    {
      name: string;
      description: string;
      systemMessage: string;
      placeholderMessage: string;
      welcomeMessage: string;
      starterQuestions: string[];
      avatarURL: string;
      botChatAvatarURL: string;
      uMessageColor: string;
      aMessageColor: string;
      showSources: boolean;
      sendButtonText: string;
      customCSS: string;
      embedAngle: string;
      embedWidgetSize: string;
      embedWidgetIconURL: string;
      embedAutoOpen: boolean;
      embedPingMessage: string;
    },
    any,
    undefined
  >;
}) => {
  const onSubmit = async (data: any) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Settings Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Settings</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter bot name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your bot's purpose"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="systemMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Message</FormLabel>
                    <FormDescription>Define the bot's behavior and initial context</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder="Enter system message"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface Settings */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Chat Interface</h3>

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter welcome message" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeholderMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Input Placeholder</FormLabel>
                    <FormControl>
                      <Input placeholder="Type your message..." {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sendButtonText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Button Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Send" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appearance</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="botChatAvatarURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Avatar</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter avatar URL" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatarURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Bot Avatar</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bot avatar URL" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uMessageColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Message Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aMessageColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bot Message Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="customCSS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom CSS</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter custom CSS"
                        className="font-mono text-sm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showSources"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Show Sources</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Embed Settings */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Embed Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="embedAngle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Position</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="embedWidgetSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="embedWidgetIconURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Widget Icon URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter widget icon URL" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="embedPingMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ping Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ping message" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="embedAutoOpen"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between space-y-0">
                    <FormLabel>Auto Open Widget</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="w-full sticky bottom-0 backdrop-blur-3xl py-4">
          <Button type="submit" className="w-full stick">
            Save Configuration
          </Button>
        </div>
      </form>
    </Form>
  );
};
