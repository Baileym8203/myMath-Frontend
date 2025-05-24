"use client";
import { MathJaxContext} from "better-react-mathjax";
import CourseLearnerComponent from "./components/courselearner";

const config = {
loader: {load: ["[tex]/html"] },
tex: {
packages: {"[+]": ["html"] },
},
};

// the main course learner page!
export default function CourseLearnerPage() {
return (
<main className="p-6 bg-gradient-to-br from-blue-500 to-purple-400 min-h-screen">
<MathJaxContext config={config}>
<CourseLearnerComponent />
</MathJaxContext>
</main>
)
}