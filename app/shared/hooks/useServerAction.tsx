"use client";

import { useState } from "react";

export default function useServerAction<T>(initialState: T) {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(initialState);

  return {
    response,
    isLoading,
    setResponse,
    setIsLoading,
  };
}
