import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

interface Session {
  _id: string;
  calculation: string;
  notes: string;
  createdAt: number;
}

export default function CalculatorComponent() {
  const [calculation, setCalculation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("rad");
  const getSessions = useQuery(api.tasks2.getSessions);
  const saveSession = useMutation(api.tasks2.saveSession);

  const handleSave = async () => {
    if (!calculation || !notes) {
      alert("Please enter both calculation and notes.");
      return;
    }

    try {
      await saveSession({ notes, calculation });
      alert("Session saved!");
      setNotes("");
      setCalculation("");
    } catch (err) {
      console.error("Error saving session:", err);
      alert("Failed to save session.");
    }
  };

  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const replaceTrigFunctions = (expr: string) => {
    return expr
      .replace(/\bsin\(([\d.]+)\)/g, (_, angle) => `Math.sin(${angle})`)
      .replace(/\bcos\(([\d.]+)\)/g, (_, angle) => `Math.cos(${angle})`)
      .replace(/\btan\(([\d.]+)\)/g, (_, angle) => `Math.tan(${angle})`)
      .replace(/\basin\(([\d.]+)\)/g, (_, angle) => `Math.asin(${angle})`)
      .replace(/\bacos\(([\d.]+)\)/g, (_, angle) => `Math.acos(${angle})`)
      .replace(/\batan\(([\d.]+)\)/g, (_, angle) => `Math.atan(${angle})`);
  };

  const replaceMathFunctions = (expr: string) => {
    return expr
      .replace(/\blog10\(([\d.]+)\)/g, (_, value) => `Math.log10(${value})`)
      .replace(/\blog\(([\d.]+)\)/g, (_, value) => `Math.log(${value})`)
      .replace(/\bsqrt\(([\d.]+)\)/g, (_, value) => `Math.sqrt(${value})`)
      .replace(
        /\bpow\(([\d.]+),([\d.]+)\)/g,
        (_, base, exponent) => `Math.pow(${base}, ${exponent})`
      )
      .replace(/\bpi\b/g, `Math.PI`)
      .replace(/\be\b/g, `Math.E`)
      .replace(/\bexp\(([\d.]+)\)/g, (_, exponent) => `Math.exp(${exponent})`);
  };

  const handleCalculatorButton = (button: string) => {
    if (button === "=") {
      try {
        let expression = calculation;

        if (angleUnit === "deg") {
          expression = replaceTrigFunctions(expression).replace(
            /(\bsin\(([\d.]+)\)|\bcos\(([\d.]+)\)|\btan\(([\d.]+)\))+/g,
            (match, p1, p2, p3, p4) => {
              const angle = p2 || p3 || p4;
              const radValue = toRadians(parseFloat(angle));
              return match.replace(angle, radValue.toString());
            }
          );
        } else {
          expression = replaceTrigFunctions(expression);
        }

        expression = replaceMathFunctions(expression);

        setCalculation(eval(expression).toString());
      } catch (err) {
        console.error("Error evaluating expression:", err);
        setCalculation("Error");
      }
    } else if (button === "C") {
      setCalculation("");
    } else if (button === "del") {
      setCalculation((prev) => prev.slice(0, -1));
    } else if (button === "deg" || button === "rad") {
      setAngleUnit(button as "deg" | "rad");
      setCalculation((prev) => prev + button);
    } else {
      // Update the calculation string by appending the button value
      setCalculation((prev) => prev + button);
    }
  };

  return (
    <>
      <div className="text-4xl text-center p-8 rounded-2xl bg-slate-400">
        Personal Scientific Calculator with notes
        <h1 className="text-lg">- By Tushar 😀</h1>
      </div>
      <div className="flex justify-between border-2 h-screen">
        <div className="note-section w-1/3 p-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full h-48 p-2 border-2 border-gray-300 rounded"
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 rounded-2xl text-white p-4 mt-4"
          >
            Save Session
          </button>
        </div>

        <div className="calculator w-2/3 border-8 border-black p-8">
          <div className="display border-2 border-red-600 p-2 mb-4">
            <input
              type="text"
              value={calculation}
              readOnly
              className="w-full h-12 text-right px-2"
            />
          </div>
          <div className="buttons grid grid-cols-4 gap-2">
            {/* Basic arithmetic */}
            {["7", "8", "9", "/"].map((button) => (
              <button
                key={button}
                onClick={() => handleCalculatorButton(button)}
                className="p-4 border rounded"
              >
                {button}
              </button>
            ))}
            {["4", "5", "6", "*"].map((button) => (
              <button
                key={button}
                onClick={() => handleCalculatorButton(button)}
                className="p-4 border rounded"
              >
                {button}
              </button>
            ))}
            {["1", "2", "3", "-"].map((button) => (
              <button
                key={button}
                onClick={() => handleCalculatorButton(button)}
                className="p-4 border rounded"
              >
                {button}
              </button>
            ))}
            {["0", ".", "=", "+"].map((button) => (
              <button
                key={button}
                onClick={() => handleCalculatorButton(button)}
                className="p-4 border rounded"
              >
                {button}
              </button>
            ))}
            <button
              onClick={() => handleCalculatorButton("C")}
              className="col-span-2 p-4 border rounded"
            >
              Clear
            </button>
            <button
              onClick={() => handleCalculatorButton("del")}
              className="col-span-2 p-4 border rounded"
            >
              Delete
            </button>

            {/* Trigonometric functions */}
            {["sin", "cos", "tan", "asin", "acos", "atan"].map((func) => (
              <button
                key={func}
                onClick={() => handleCalculatorButton(func + "(")}
                className="p-4 border rounded"
              >
                {func}
              </button>
            ))}

            {/* Logarithmic and exponential functions */}
            {["log", "log10", "exp", "sqrt", "pow"].map((func) => (
              <button
                key={func}
                onClick={() => handleCalculatorButton(func + "(")}
                className="p-4 border rounded"
              >
                {func}
              </button>
            ))}

            <button
              onClick={() => handleCalculatorButton("pi")}
              className="p-4 border rounded"
            >
              π
            </button>
            <button
              onClick={() => handleCalculatorButton("1/(")}
              className="p-4 border rounded"
            >
              1/x
            </button>
            <button
              onClick={() => handleCalculatorButton("%")}
              className="p-4 border rounded"
            >
              %
            </button>

            <button
              onClick={() => handleCalculatorButton("(")}
              className="p-4 border rounded"
            >
              (
            </button>
            <button
              onClick={() => handleCalculatorButton(")")}
              className="p-4 border rounded"
            >
              )
            </button>

            <button
              onClick={() => handleCalculatorButton("deg")}
              className="p-4 border rounded"
            >
              Degrees
            </button>
            <button
              onClick={() => handleCalculatorButton("rad")}
              className="p-4 border rounded"
            >
              Radians
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
