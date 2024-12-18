"use client"

import * as React from "react"
import { useState, useEffect} from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/router"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { isString } from "util"

const formSchema = z.object({
    activity: z.string().min(0).max(50, {
        message: "Activity name cannot exceed 50 characters "
    }),

    participant: z.array(z.string()).nonempty("You need to select at least 1 participant"),
    expense: z.string().min(1).max(50, {
      message: "Expense must be logged or Expense greater than 50 characters"
    })
  });

interface Participant {
  id: number;
  name: string;
}

export function InputFormActivity(){
    const [currencyOpen, setCurrencyOpen] = React.useState(false);
    const [currencyValue, setCurrencyValue] = React.useState("");

    interface Currency{
    label: string,
    rate: number,    
}

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
        expense: "",
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

   
    async function onSubmit(values: z.infer<typeof formSchema>) {
     const formData: {
    expense: number;             // Expense is a number
    currency: string;            // Currency is a string
    participants: string[];      // Participants is an array of strings
    activity: string;            // Activity is a string
} = {
    expense: values.expense,
    currency: currencyValue,
    participants: values.participant,
    activity: values.activity,
};

      console.log(values.participant)
      try {
        const response = await fetch("/api/writeExpenseInfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          console.log("Successfully submitted");
          
        }
        else {
          console.log("Error in submitting");
        }
      }
      catch (error) {
        console.error("error in submitting form", error);
      }
      }
    
    
      const [CurrencyTable, setCurrencyTable] = useState<Currency[]>([]);
      useEffect(() => {
        async function accessCurrency() {
          try {
            const response = await fetch("/api/currencyInfo");
            const rateData : Currency[] = await response.json();
            setCurrencyTable(rateData);
          }
          catch (error) {
            console.error("error" , error);
          } 
        }
        accessCurrency();
      }, []);




     return (
      <div className="flex justify-center items-center w-1/2">
        <div className="pb-8 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-8 w-2/12 flex">
              <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Expense</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="w-33"/>
                  </FormControl>
                  <FormDescription>
                    Enter your expense
                  </FormDescription>
                  <FormMessage />       
               </FormItem>
              )}
            />
          <Popover open = {currencyOpen} onOpenChange={setCurrencyOpen}>
          <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between">

          {currencyValue ? CurrencyTable.find((CurrencyTable) => CurrencyTable.label === currencyValue)?.label
          : "Select Currency"}
          <ChevronsUpDown className="opacity-50" />
          </Button> 
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Currency..." className="h-9" />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {CurrencyTable.map((currency) => (
                <CommandItem
                  key={currency.label}
                  value={currency.label}
                  onSelect={(currentValue) => {
                    setCurrencyValue(currentValue === currencyValue ? "" : currentValue)
                    setCurrencyOpen(false)
                  }}
                >
                  {currency.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      currencyValue === currency.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
        </Popover>
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
      <div className="h-8">
              <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Activity</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} className="w-33"/>
                  </FormControl>
                  <FormDescription>
                    Enter your activity for tracking and posterity
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
      </div>
          
          </form>
        </Form>

        </div>
        </div>
      )


    }
