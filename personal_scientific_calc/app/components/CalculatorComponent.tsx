import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../convex/_generated/api";

// Define TypeScript interface for session data
interface Session {
  _id: string;
  calculation: string;
  notes: string;
  createdAt: number;
}

export default function CalculatorComponent() {
  const [calculation, setCalculation] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [angleUnit, setAngleUnit] = useState<"deg" | "rad">("rad"); // Degrees or radians

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

  // Function to convert degrees to radians
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  // Function to replace trigonometric functions with Math functions
  const replaceTrigFunctions = (expr: string) => {
    // Replace trigonometric functions with corresponding Math functions
    return expr
      .replace(/\bsin\(([\d.]+)\)/g, (_, angle) => `Math.sin(${angle})`)
      .replace(/\bcos\(([\d.]+)\)/g, (_, angle) => `Math.cos(${angle})`)
      .replace(/\btan\(([\d.]+)\)/g, (_, angle) => `Math.tan(${angle})`)
      .replace(/\basin\(([\d.]+)\)/g, (_, angle) => `Math.asin(${angle})`)
      .replace(/\bacos\(([\d.]+)\)/g, (_, angle) => `Math.acos(${angle})`)
      .replace(/\batan\(([\d.]+)\)/g, (_, angle) => `Math.atan(${angle})`);
  };

  // Function to replace logarithmic and exponential functions with Math functions
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

  // Handle scientific calculator input
  const handleCalculatorButton = (button: string) => {
    if (button === "=") {
      try {
        let expression = calculation;

        // Handle angle unit conversion for trigonometric functions
        if (angleUnit === "deg") {
          // Convert degrees to radians for trigonometric functions
          expression = replaceTrigFunctions(expression).replace(
            /(\bsin\(([\d.]+)\)|\bcos\(([\d.]+)\)|\btan\(([\d.]+)\))+/g,
            (match, p1, p2, p3, p4) => {
              // Handle cases where the angle is in degrees
              const angle = p2 || p3 || p4;
              const radValue = toRadians(parseFloat(angle));
              return match.replace(angle, radValue.toString());
            }
          );
        } else {
          // Directly replace trigonometric functions
          expression = replaceTrigFunctions(expression);
        }

        // Replace other math functions
        expression = replaceMathFunctions(expression);

        // Evaluate the expression using JavaScript's eval function
        // Make sure to handle possible errors and sanitize input
        // eslint-disable-next-line no-eval
        setCalculation(eval(expression).toString());
      } catch (err) {
        console.error("Error evaluating expression:", err);
        setCalculation("Error");
      }
    } else if (button === "C") {
      setCalculation("");
    } else if (button === "del") {
      setCalculation((prev) => prev.slice(0, -1)); // Remove the last character
    } else if (button === "deg" || button === "rad") {
      setAngleUnit(button as "deg" | "rad"); // Toggle between degrees and radians
    } else {
      setCalculation((prev) => prev + button);
    }
  };

  return (
    <>
      <div className="flex justify-between border-2 border-red-500 h-screen">
        <div className="note-section">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write your notes here..."
          />
          <button onClick={handleSave} className="bg-blue-600 rounded-2xl  text-white p-4">Save Session</button>

    
        </div>

        <div className="border-8 border-black p-8">
          <div className=" ">
            <div className="display border-2 border-red-600">
              <input type="text" value={calculation} readOnly />
            </div>
            <div className="buttons">
              {/* Basic arithmetic */}
              {["7", "8", "9", "/"].map((button) => (
                <button
                  key={button}
                  onClick={() => handleCalculatorButton(button)}
                >
                  {button}
                </button>
              ))}
              {["4", "5", "6", "*"].map((button) => (
                <button
                  key={button}
                  onClick={() => handleCalculatorButton(button)}
                >
                  {button}
                </button>
              ))}
              {["1", "2", "3", "-"].map((button) => (
                <button
                  key={button}
                  onClick={() => handleCalculatorButton(button)}
                >
                  {button}
                </button>
              ))}
              {["0", ".", "=", "+"].map((button) => (
                <button
                  key={button}
                  onClick={() => handleCalculatorButton(button)}
                >
                  {button}
                </button>
              ))}
              <button onClick={() => handleCalculatorButton("C")}>Clear</button>
              <button onClick={() => handleCalculatorButton("del")}>
                Delete
              </button>

              {/* Trigonometric functions */}
              {["sin", "cos", "tan", "asin", "acos", "atan"].map((func) => (
                <button
                  key={func}
                  onClick={() => handleCalculatorButton(func + "(")}
                >
                  {func}
                </button>
              ))}

              {/* Logarithmic and exponential functions */}
              {["log", "log10", "exp", "sqrt", "pow"].map((func) => (
                <button
                  key={func}
                  onClick={() => handleCalculatorButton(func + "(")}
                >
                  {func}
                </button>
              ))}

              {/* Factorial and constants */}
              <button onClick={() => handleCalculatorButton("!")}>!</button>
              <button onClick={() => handleCalculatorButton("pi")}>π</button>
              <button onClick={() => handleCalculatorButton(",")}>,</button>

              {/* Degree and Radian toggle */}
              <button onClick={() => handleCalculatorButton("deg")}>
                Degrees
              </button>
              <button onClick={() => handleCalculatorButton("rad")}>
                Radians
              </button>

              {/* Inverse and modulus */}
              <button onClick={() => handleCalculatorButton("1/(")}>1/x</button>
              <button onClick={() => handleCalculatorButton("%")}>%</button>

              {/* Parentheses */}
              <button onClick={() => handleCalculatorButton("(")}>(</button>
              <button onClick={() => handleCalculatorButton(")")}>)</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
