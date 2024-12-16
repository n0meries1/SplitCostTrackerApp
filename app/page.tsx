import InputBox from "./components/input-option";
import ExpenseTable from "./components/expense-table";
import { InputFormActivity } from "./components/input-form";

export default function Home() {
  return (
    <>
    <InputBox></InputBox>
    <div className="flex flex-col items-center">
      <InputFormActivity></InputFormActivity>
      <ExpenseTable></ExpenseTable>
    </div>
    </>
  );
}
