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
    const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
    const [currencyRates, setCurrencyRates] = useState<Currency[]>([]);

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

        async function fetchCurrencyRates(){
            try {
                const response = await fetch("/api/currencyInfo");
                const ratesData: Currency[] = await response.json();
                setCurrencyRates(ratesData);
            }
            catch (error) {
                console.error("Error", error);
            }
        }
        fetchExpenses();
        fetchCurrencyRates();
    }, []);


    
    const handleCurrencyToggle = () => {
        setCurrentCurrencyIndex((currentCurrency) => 
            currentCurrency === currencyRates.length - 1 ? 0 : currentCurrency + 1
        );
    }
    const currentCurrencyFinal = currencyRates[currentCurrencyIndex] || {
        label: "SGD", rate: 1,
    };
    return (
        
        <div className="flex items-center justify-center">
            <Table className="overflow-x-auto w-5/6 max-w-3xl"> <TableCaption>Expense for the Trip</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">S/N</TableHead>
                        <TableHead className="text-center cursor-pointer" onClick={() => handleCurrencyToggle()}>
                            Amount Spent ({currentCurrencyFinal.label})</TableHead>
                        <TableHead className="text-center">Amount Spent (SGD)</TableHead>
                        <TableHead className="text-center">Activity</TableHead>
                        <TableHead className="text-center">Participant</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {expenses.map((xs) => (
                        <TableRow key={xs.id}>
                            <TableCell className="font-medium text-center">{xs.sn}</TableCell>
                            <TableCell className="text-center">{xs.expense * currentCurrencyFinal.rate}</TableCell>
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