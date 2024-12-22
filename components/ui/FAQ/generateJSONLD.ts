import { Question } from "site/components/ui/FAQ/index.tsx";

export default function generateJSONLDForFAQ(questions: Question[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map((question) => ({
      "@type": "Question",
      "name": question.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": question.description,
      },
    })),
  };
}

export function appendJSONLDToHead(jsonld: unknown) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.innerHTML = JSON.stringify(jsonld);
  document.head.appendChild(script);
}
