/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  // Adicione outras variáveis de ambiente que você usa com VITE_ aqui
  // readonly VITE_OUTRA_VAR: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
