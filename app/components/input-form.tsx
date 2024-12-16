"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    activity: z.string().min(0).max(50, {
        message: "Activity name cannot exceed 50 characters "
    }),

    participant: z.array(z.string()).nonempty("You need to select at least 1 participant"),
});

interface Participant {
  id: number;
  name: string;
}

export function InputFormActivity(){
    const [participants, setParticipants] = React.useState<Participant[]>([
      { id: 1, name: "Haojun"},
      { id: 2, name: "Kaiwen"},
      { id: 3, name: "Winnie"},
      { id: 4, name: "Calyn"},
    ]);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        activity: "",
        participant: participants.map((p) => p.name),
      },
    });

    const handleAddParticipants = () => {
      setParticipants((prev) => [
        ...prev, 
        { id: Date.now(), name: "New Participant"},
      ]);
    };

    const handleNameChange = (id: number, newName: string) => {
      setParticipants((prev) => 
        prev.map((xs) => (xs.id === id ? { ...xs, name: newName} : xs))
      .filter((xs) => xs.name.trim() !=="")
    );
      form.setValue(
      "participant",
      participants.map((xs) => (xs.id === id ? newName : xs.name))
      .filter((name) => name.trim() !== "")
    );
    };

    const handleCheckboxToggle = (name: string) => {
      const currentParticipants = form.getValues("participant");
      if (currentParticipants.includes(name)) {
        form.setValue(
          "participant",
          currentParticipants.filter((xs) => xs !== name)
        );
      }

      else {
        form.setValue("participant", [...currentParticipants, name]);
      }
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
      console.log(values.activity);
      console.log(values.participant);
    }




     return (
        <div className="pb-8 flex items-center justify-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 w-2/12 flex">
          <FormField
          control={form.control}
          name="participant"
          render={({ field }) => (
            <FormItem className="space-y-3">
            <FormLabel>Participants</FormLabel>
            <FormControl>
              <div className="flex flex-col space-y-1">
                {participants.map((participant) => (
                  <div
                    key={participant}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={field.value.includes(participant.name)}
                      onChange={ () => handleCheckboxToggle(participant.name)
                      }className="h-4 w-4h-5 w-5 text-blue-600 border-gray-300"
                    />
                    <input value={participant.name} onChange={(e) => handleNameChange(participant.id, e.target.value)} 
                    className="border rounded px-2 py-1 w-full"></input>
                  </div>
                ))}
              </div>
            </FormControl>
            <Button
                  type="button"
                  onClick={handleAddParticipants}
                  className="mt-3"
                >
                  Add Participant
                </Button>
            <FormMessage />
          </FormItem>
          
        )}
      />
      
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="w-32"/>
                  </FormControl>
                  <FormDescription>
                    Enter your activity for tracking and posterity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>

        </div>
      )

}

