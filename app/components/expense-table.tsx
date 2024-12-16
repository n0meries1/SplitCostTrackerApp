'use client'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";



interface Currency{
    label: string,
    rate: number,    
}
const CurrencyTable: Currency[] = [
    {
        label: "Yen", rate: 113.0
    },
    {
        label: "USD", rate: 0.83
    },
    {
        label: "EUR", rate: 0.9
    },
    {
        label: "AUD", rate: 1.03
    },
]

interface Expense{
    id: string,
    sn: number,
    expense: number,
    currency: string,
    activity: string,
    participant: string,

}
export default function ExpenseTable() {

    const [expenses, setExpenses] = useState<Expense[]>([]);

    useEffect(()=> {
        async function fetchExpenses() {
            try {
                const response = await fetch("/api/expenseInfo");
                const data = await response.json();

                const addSN = data.map((item: any, index: number) => ({
                    ...item, sn: index + 1,
                }))
                setExpenses(addSN);
                
            }
            catch (error) {
                console.error("Failed to fetch", error);
            }
        }
        fetchExpenses();
    }, []);

    const [currentCurrency, setCurrentCurrency] = useState(0);
    const handleCurrencyToggle = () => {
        setCurrentCurrency((currentCurrency) => 
            currentCurrency === CurrencyTable.length - 1 ? 0 : currentCurrency + 1
        );
    }

    let currentCurrencyLabel = CurrencyTable[currentCurrency].label;
    let currentCurrencyRate = CurrencyTable[currentCurrency].rate;
    return (
        
        <div className="flex items-center justify-center">
            <Table className="overflow-x-auto w-5/6 max-w-3xl"> <TableCaption>Expense for the Trip</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">S/N</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleCurrencyToggle()}>
                            Amount Spent ({currentCurrencyLabel})</TableHead>
                        <TableHead className="text-center">Amount Spent (SGD)</TableHead>
                        <TableHead className="text-center">Activity</TableHead>
                        <TableHead className="text-center">Participant</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((xs) => (
                        <TableRow key={xs.id}>
                            <TableCell className="font-medium text-center">{xs.sn}</TableCell>
                            <TableCell className="text-center">{xs.expense / currentCurrencyRate}</TableCell>
                            <TableCell className="text-center">{xs.expense}</TableCell>
                            <TableCell className="text-cenexpenseer">{xs.activity}</TableCell>
                            <TableCell className="text-center">{xs.participant}</TableCell>                        
                        </TableRow>
                    ))
                    }
                </TableBody>
        
            </Table>
        </div>
    )
}