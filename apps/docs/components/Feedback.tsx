"use client";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@rafty/ui";
import { useState } from "react";

export function Feedback() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="relative h-8">
      {!submitted ? (
        <div
          className="absolute inset-0 flex items-center justify-center gap-6 transition-opacity duration-300 md:justify-start"
          style={{ opacity: 1 }}
        >
          <p className="text-secondary-600 dark:text-secondary-400 text-[0.875rem] leading-[1.5rem]">
            Was this page helpful?
          </p>
          <div className="flex rounded-full">
            <Button
              data-response="yes"
              variant="outline"
              className="rounded-l-full py-1"
              type="submit"
              onClick={onSubmit}
            >
              Yes
            </Button>
            <Button
              data-response="no"
              variant="outline"
              className="rounded-r-full border-l-0 py-1"
              type="submit"
              onClick={onSubmit}
            >
              No
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-0 flex justify-center transition-opacity duration-300 md:justify-start"
          style={{ opacity: 1 }}
        >
          <div className="bg-primary-50/50 text-primary-900 ring-primary-500/20 dark:bg-primary-500/5 dark:text-primary-200 dark:ring-primary-500/30 flex items-center gap-3 rounded-full py-1 pl-1.5 pr-3 text-[0.875rem] leading-[1.5rem] ring-1 ring-inset">
            <CheckCircleIcon
              className="text-primary-500 rounded-full bg-white stroke-2"
              height={25}
              width={25}
            />
            Thanks for your feedback!
          </div>
        </div>
      )}
    </div>
  );
}
