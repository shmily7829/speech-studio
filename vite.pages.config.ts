import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {fileURLToPath} from 'node:url';
export default defineConfig({root:fileURLToPath(new URL('./pages',import.meta.url)),base:'/speech-studio/',publicDir:false,plugins:[react()],define:{'import.meta.env.VITE_STATIC':JSON.stringify('true')},build:{outDir:'../dist-pages',emptyOutDir:true},server:{host:'127.0.0.1',port:5174}});
