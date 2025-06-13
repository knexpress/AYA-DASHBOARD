// Flows will be imported for their side effects in this file.
// src/env.d.ts or root-level env.d.ts
import './flows/generateEnhancedResponseFlow';
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
  }
}